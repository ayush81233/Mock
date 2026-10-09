import os

from django.core.exceptions import ObjectDoesNotExist
from django.http import FileResponse, Http404
from django.utils import timezone

from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
    parser_classes,
)
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from accounts.models import Citizen
from schemes.models import Scheme

from .models import Application, ApplicationDocument, Notification, verify_document
from .pdf_generator import generate_application_pdf, generate_blank_form_pdf
from .serializers import (
    ApplicationSerializer,
    ApplicationDocumentSerializer,
    ApplicationStatusSerializer,
    NotificationSerializer,
)


# Allowed upload extensions and MIME types
ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


def get_citizen_for_user(user):
    """
    Safely retrieve or create the Citizen profile for the authenticated User.
    Prevents AttributeError or Citizen.DoesNotExist exceptions.
    """
    if not user or not user.is_authenticated:
        return None

    try:
        if hasattr(user, "citizen_profile") and user.citizen_profile:
            return user.citizen_profile
    except (ObjectDoesNotExist, Exception):
        pass

    citizen = Citizen.objects.filter(user=user).first()
    if citizen:
        return citizen

    username = getattr(user, "username", "") or ""
    if username.startswith("citizen_"):
        mobile = username.replace("citizen_", "")
        citizen = Citizen.objects.filter(mobile=mobile).first()
        if citizen:
            citizen.user = user
            citizen.save(update_fields=["user"])
            return citizen

        return Citizen.objects.create(
            user=user,
            mobile=mobile,
            is_verified=True,
        )

    return None


# =========================================================
# APPLICATION CRUD
# =========================================================

@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_application(request):
    scheme_id = request.data.get("scheme_id")

    if not scheme_id:
        return Response(
            {"error": "scheme_id is required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        scheme = Scheme.objects.get(id=scheme_id)
    except Scheme.DoesNotExist:
        try:
            from django.core.management import call_command
            call_command("seed_schemes")
            scheme = Scheme.objects.get(id=scheme_id)
        except Scheme.DoesNotExist:
            return Response(
                {"error": f"Scheme '{scheme_id}' not found."},
                status=status.HTTP_404_NOT_FOUND
            )

    citizen = get_citizen_for_user(request.user)
    if not citizen:
        return Response(
            {"error": "Citizen profile not found."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Check if citizen already has a draft for this scheme, reuse if present
    existing_draft = Application.objects.filter(
        citizen=citizen,
        scheme=scheme,
        status="DRAFT"
    ).first()

    if existing_draft:
        incoming_form_data = request.data.get("form_data")
        if incoming_form_data and isinstance(incoming_form_data, dict):
            current_form = existing_draft.form_data or {}
            current_form.update(incoming_form_data)
            existing_draft.form_data = current_form
            existing_draft.save(update_fields=["form_data", "updated_at"])
        serializer = ApplicationSerializer(existing_draft)
        return Response(serializer.data, status=status.HTTP_200_OK)

    application = Application.objects.create(
        citizen=citizen,
        scheme=scheme,
        form_data=request.data.get("form_data", {}),
        status="DRAFT"
    )

    serializer = ApplicationSerializer(application)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def my_applications(request):
    citizen = get_citizen_for_user(request.user)
    if not citizen:
        return Response(
            {"error": "Citizen profile not found."},
            status=status.HTTP_400_BAD_REQUEST
        )

    applications = (
        Application.objects
        .filter(citizen=citizen)
        .select_related("scheme")
        .prefetch_related("documents")
        .order_by("-created_at")
    )

    serializer = ApplicationSerializer(applications, many=True)
    return Response(
        {
            "count": applications.count(),
            "results": serializer.data
        }
    )


@api_view(["GET", "PATCH"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def application_detail(request, application_number):
    citizen = get_citizen_for_user(request.user)
    if not citizen:
        return Response(
            {"error": "Citizen profile not found."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        application = (
            Application.objects
            .select_related("scheme")
            .prefetch_related("documents")
            .get(
                application_number=application_number,
                citizen=citizen
            )
        )
    except Application.DoesNotExist:
        return Response(
            {"error": "Application not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    if request.method == "PATCH":
        if application.status not in ["DRAFT", "CORRECTION_REQUIRED"]:
            return Response(
                {"error": "Only draft applications can be edited."},
                status=status.HTTP_400_BAD_REQUEST
            )

        form_data = request.data.get("form_data")
        if form_data is not None:
            if isinstance(form_data, dict):
                current_data = application.form_data or {}
                current_data.update(form_data)
                application.form_data = current_data
            else:
                application.form_data = form_data

        application.save(update_fields=["form_data", "updated_at"])

    serializer = ApplicationSerializer(application)
    return Response(serializer.data)


# =========================================================
# SUBMIT APPLICATION WITH FIELD & DOCUMENT VALIDATION
# =========================================================

@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def submit_application(request, application_number):
    citizen = get_citizen_for_user(request.user)
    if not citizen:
        return Response(
            {"error": "Citizen profile not found."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        application = (
            Application.objects
            .select_related("scheme")
            .prefetch_related("documents")
            .get(
                application_number=application_number,
                citizen=citizen
            )
        )
    except Application.DoesNotExist:
        return Response(
            {"error": "Application not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    if application.status not in ["DRAFT", "CORRECTION_REQUIRED"]:
        return Response(
            {"error": "This application has already been submitted."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # 1. Update form_data if provided in submit payload
    if request.data.get("form_data"):
        incoming = request.data.get("form_data")
        if isinstance(incoming, dict):
            merged = application.form_data or {}
            merged.update(incoming)
            application.form_data = merged
            application.save(update_fields=["form_data", "updated_at"])

    form_data = application.form_data or {}
    scheme = application.scheme

    # 2. Validate Scheme Application Fields
    scheme_fields = scheme.application_fields or []
    for field in scheme_fields:
        if not isinstance(field, dict):
            continue
        fname = field.get("name")
        flabel = field.get("label", fname)
        is_required = field.get("required", False)

        if is_required:
            val = form_data.get(fname)
            if val is None or (isinstance(val, str) and not val.strip()) or val is False:
                return Response(
                    {"error": f"{flabel} is required."},
                    status=status.HTTP_400_BAD_REQUEST
                )

    # 3. Validate Required Documents
    required_docs = scheme.documents or []
    uploaded_doc_types = set(
        application.documents.values_list("document_type", flat=True)
    )

    for doc_name in required_docs:
        # If document name is marked optional, e.g. "where applicable"
        if "where applicable" in doc_name.lower():
            continue
        if doc_name not in uploaded_doc_types:
            return Response(
                {"error": f"{doc_name} is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

    # 4. Save and Submit
    application.status = "SUBMITTED"
    application.submitted_at = timezone.now()
    application.save(update_fields=["status", "submitted_at", "updated_at"])

    # Update uploaded documents to UNDER_REVIEW
    application.documents.filter(verification_status="UPLOADED").update(
        verification_status="UNDER_REVIEW"
    )

    # 5. Create Citizen Notification
    Notification.objects.create(
        citizen=citizen,
        application=application,
        title="Application Submitted",
        message=f"Your application {application.application_number} for '{scheme.title}' has been successfully submitted.",
        type="application_submitted"
    )

    serializer = ApplicationSerializer(application)
    return Response(
        {
            "message": "Application submitted successfully.",
            "application": serializer.data
        },
        status=status.HTTP_200_OK
    )


# =========================================================
# DOCUMENT MANAGEMENT & UPLOAD
# =========================================================

@api_view(["GET", "POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def application_documents(request, application_number):
    citizen = get_citizen_for_user(request.user)
    if not citizen:
        return Response(
            {"error": "Citizen profile not found."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        application = Application.objects.get(
            application_number=application_number,
            citizen=citizen
        )
    except Application.DoesNotExist:
        return Response(
            {"error": "Application not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    if request.method == "GET":
        docs = application.documents.all()
        serializer = ApplicationDocumentSerializer(docs, many=True)
        return Response(serializer.data)

    # POST: Upload document
    if application.status not in ["DRAFT", "CORRECTION_REQUIRED", "SUBMITTED"]:
        return Response(
            {"error": "Documents cannot be added to this application at this stage."},
            status=status.HTTP_400_BAD_REQUEST
        )

    document_type = request.data.get("document_type", "").strip()
    uploaded_file = request.FILES.get("file")

    if not document_type:
        return Response(
            {"error": "document_type is required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not uploaded_file:
        return Response(
            {"error": "File is required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Validate file size
    if uploaded_file.size > MAX_FILE_SIZE:
        return Response(
            {"error": "File size exceeds 5MB limit. Please upload a smaller file."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Validate file extension
    ext = os.path.splitext(uploaded_file.name)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        return Response(
            {"error": "Invalid file format. Only PDF, JPG, JPEG, and PNG files are allowed."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Upsert document for this document_type
    doc, created = ApplicationDocument.objects.update_or_create(
        application=application,
        document_type=document_type,
        defaults={
            "file": uploaded_file,
            "file_name": uploaded_file.name,
            "file_size": uploaded_file.size,
            "file_type": uploaded_file.content_type or f"application/{ext[1:]}",
            "verification_status": "UPLOADED",
            "remarks": "",
            "verified_at": None,
        }
    )

    serializer = ApplicationDocumentSerializer(doc)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["DELETE"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def delete_document(request, application_number, document_id):
    citizen = get_citizen_for_user(request.user)
    if not citizen:
        return Response({"error": "Citizen profile not found."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        application = Application.objects.get(application_number=application_number, citizen=citizen)
    except Application.DoesNotExist:
        return Response({"error": "Application not found."}, status=status.HTTP_404_NOT_FOUND)

    if application.status not in ["DRAFT", "CORRECTION_REQUIRED"]:
        return Response({"error": "Documents can only be removed from draft applications."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        doc = application.documents.get(id=document_id)
        doc.delete()
        return Response({"message": "Document removed successfully."})
    except ApplicationDocument.DoesNotExist:
        return Response({"error": "Document not found."}, status=status.HTTP_404_NOT_FOUND)


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def download_document(request, application_number, document_id):
    is_staff = request.user.is_staff or request.user.is_superuser

    try:
        if is_staff:
            application = Application.objects.get(application_number=application_number)
        else:
            citizen = get_citizen_for_user(request.user)
            if not citizen:
                raise Http404("Citizen profile not found.")
            application = Application.objects.get(
                application_number=application_number,
                citizen=citizen
            )
    except (Application.DoesNotExist, AttributeError):
        raise Http404("Application not found.")

    try:
        doc = application.documents.get(id=document_id)
    except ApplicationDocument.DoesNotExist:
        raise Http404("Document not found.")

    if not doc.file or not os.path.exists(doc.file.path):
        raise Http404("Document file not available.")

    response = FileResponse(
        open(doc.file.path, "rb"),
        content_type=doc.file_type or "application/octet-stream"
    )
    response["Content-Disposition"] = f'inline; filename="{doc.file_name or "document"}"'
    return response


# =========================================================
# PDF GENERATION ENDPOINTS
# =========================================================

@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def download_application_pdf(request, application_number):
    is_staff = request.user.is_staff or request.user.is_superuser

    try:
        if is_staff:
            application = (
                Application.objects
                .select_related("citizen", "scheme")
                .prefetch_related("documents")
                .get(application_number=application_number)
            )
        else:
            citizen = get_citizen_for_user(request.user)
            if not citizen:
                raise Http404("Citizen profile not found.")
            application = (
                Application.objects
                .select_related("citizen", "scheme")
                .prefetch_related("documents")
                .get(
                    application_number=application_number,
                    citizen=citizen
                )
            )
    except (Application.DoesNotExist, AttributeError):
        raise Http404("Application not found.")

    pdf_buffer = generate_application_pdf(application)
    response = FileResponse(pdf_buffer, content_type="application/pdf")
    response["Content-Disposition"] = f'attachment; filename="Application_{application.application_number}.pdf"'
    return response


@api_view(["GET"])
@permission_classes([AllowAny])
def download_blank_form_pdf(request, scheme_id):
    try:
        scheme = Scheme.objects.get(id=scheme_id)
    except Scheme.DoesNotExist:
        raise Http404("Scheme not found.")

    pdf_buffer = generate_blank_form_pdf(scheme)
    response = FileResponse(pdf_buffer, content_type="application/pdf")
    response["Content-Disposition"] = f'attachment; filename="Blank_Form_{scheme.id}.pdf"'
    return response


# =========================================================
# NOTIFICATIONS API
# =========================================================

@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def citizen_notifications(request):
    citizen = get_citizen_for_user(request.user)
    if not citizen:
        return Response({"error": "Citizen profile not found."}, status=status.HTTP_400_BAD_REQUEST)

    notes = Notification.objects.filter(citizen=citizen).order_by("-created_at")
    serializer = NotificationSerializer(notes, many=True)
    unread_count = notes.filter(is_read=False).count()

    return Response({
        "unread_count": unread_count,
        "results": serializer.data
    })


@api_view(["PATCH"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def mark_notification_read(request, notification_id):
    citizen = get_citizen_for_user(request.user)
    if not citizen:
        return Response({"error": "Citizen profile not found."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        note = Notification.objects.get(id=notification_id, citizen=citizen)
        note.is_read = True
        note.save(update_fields=["is_read"])
        return Response({"message": "Marked as read."})
    except Notification.DoesNotExist:
        return Response({"error": "Notification not found."}, status=status.HTTP_404_NOT_FOUND)


@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def mark_all_notifications_read(request):
    citizen = get_citizen_for_user(request.user)
    if not citizen:
        return Response({"error": "Citizen profile not found."}, status=status.HTTP_400_BAD_REQUEST)

    Notification.objects.filter(citizen=citizen, is_read=False).update(is_read=True)
    return Response({"message": "All notifications marked as read."})


# =========================================================
# DEMO REVIEWER / VERIFICATION WORKFLOW
# =========================================================

@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def demo_verify_document(request, application_number, document_id):
    new_status = request.data.get("status", "VERIFIED").upper()
    remarks = request.data.get("remarks", "Verified by YojanaSaathi Demo Review")

    if new_status not in ["VERIFIED", "REJECTED", "CORRECTION_REQUIRED", "UNDER_REVIEW"]:
        return Response({"error": "Invalid verification status."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        application = Application.objects.get(application_number=application_number)
        doc = application.documents.get(id=document_id)
    except (Application.DoesNotExist, ApplicationDocument.DoesNotExist):
        return Response({"error": "Document not found."}, status=status.HTTP_404_NOT_FOUND)

    verify_document(doc, new_status, remarks=remarks)
    serializer = ApplicationDocumentSerializer(doc)
    return Response({
        "message": f"Document marked as {new_status}.",
        "document": serializer.data
    })


@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def demo_verify_all_documents(request, application_number):
    try:
        application = Application.objects.get(application_number=application_number)
    except Application.DoesNotExist:
        return Response({"error": "Application not found."}, status=status.HTTP_400_BAD_REQUEST)

    docs = application.documents.all()
    if not docs.exists():
        return Response({"error": "No documents uploaded yet to verify."}, status=status.HTTP_400_BAD_REQUEST)

    for doc in docs:
        verify_document(doc, "VERIFIED", remarks="Verified by YojanaSaathi Demo Review")

    if application.status == "SUBMITTED":
        application.status = "UNDER_REVIEW"
        application.save(update_fields=["status", "updated_at"])

    serializer = ApplicationSerializer(application)
    return Response({
        "message": "All application documents successfully verified (Demo Review).",
        "application": serializer.data
    })


# =========================================================
# PHASE 4 — READ-ONLY APPLICATION STATUS ENDPOINT
# =========================================================

@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def application_status(request, application_number):
    citizen = get_citizen_for_user(request.user)
    if not citizen:
        return Response(
            {"error": "Citizen profile not found."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        application = Application.objects.select_related("scheme").get(
            application_number=application_number,
            citizen=citizen
        )
    except Application.DoesNotExist:
        return Response(
            {"error": "Application not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = ApplicationStatusSerializer(application)
    return Response(serializer.data)