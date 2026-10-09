from rest_framework import serializers

from .models import Application, ApplicationDocument, Notification


class ApplicationDocumentSerializer(serializers.ModelSerializer):
    download_url = serializers.SerializerMethodField()

    class Meta:
        model = ApplicationDocument
        fields = [
            "id",
            "document_type",
            "file_name",
            "file_size",
            "file_type",
            "verification_status",
            "remarks",
            "uploaded_at",
            "verified_at",
            "download_url",
        ]
        read_only_fields = [
            "id",
            "file_size",
            "file_type",
            "verification_status",
            "uploaded_at",
            "verified_at",
            "download_url",
        ]

    def get_download_url(self, obj):
        return f"/api/applications/{obj.application.application_number}/documents/{obj.id}/download/"


class ApplicationSerializer(serializers.ModelSerializer):
    scheme_title = serializers.CharField(
        source="scheme.title",
        read_only=True
    )

    scheme_category = serializers.CharField(
        source="scheme.category",
        read_only=True
    )

    documents = ApplicationDocumentSerializer(
        many=True,
        read_only=True
    )

    documents_count = serializers.IntegerField(
        read_only=True
    )

    verified_documents_count = serializers.IntegerField(
        read_only=True
    )

    total_required_documents_count = serializers.IntegerField(
        read_only=True
    )

    all_documents_verified = serializers.BooleanField(
        read_only=True
    )

    class Meta:
        model = Application
        fields = [
            "id",
            "application_number",
            "citizen",
            "scheme",
            "scheme_title",
            "scheme_category",
            "form_data",
            "status",
            "submitted_at",
            "created_at",
            "updated_at",
            "documents",
            "documents_count",
            "verified_documents_count",
            "total_required_documents_count",
            "all_documents_verified",
        ]
        read_only_fields = [
            "id",
            "application_number",
            "citizen",
            "status",
            "submitted_at",
            "created_at",
            "updated_at",
            "documents",
            "documents_count",
            "verified_documents_count",
            "total_required_documents_count",
            "all_documents_verified",
        ]


class NotificationSerializer(serializers.ModelSerializer):
    application_number = serializers.CharField(
        source="application.application_number",
        read_only=True,
        allow_null=True
    )

    class Meta:
        model = Notification
        fields = [
            "id",
            "application",
            "application_number",
            "title",
            "message",
            "type",
            "is_read",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "application",
            "application_number",
            "title",
            "message",
            "type",
            "created_at",
        ]