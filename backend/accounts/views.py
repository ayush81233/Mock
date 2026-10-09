
import logging

from django.conf import settings
from django.contrib.auth.models import User

from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view
from rest_framework.response import Response

from twilio.base.exceptions import TwilioRestException
from twilio.rest import Client

from .models import Citizen
from .serializers import CitizenSerializer

logger = logging.getLogger(__name__)


# =========================================================
# TWILIO CLIENT
# =========================================================

def get_twilio_client():
    account_sid = (settings.TWILIO_ACCOUNT_SID or "").strip()
    auth_token = (settings.TWILIO_AUTH_TOKEN or "").strip()

    if not account_sid or not auth_token:
        raise RuntimeError(
            "Twilio account credentials are not configured."
        )

    service_sid = (
        getattr(settings, "TWILIO_VERIFY_SERVICE_SID", "") or ""
    ).strip()

    if not service_sid or not service_sid.startswith("VA"):
        raise RuntimeError(
            "TWILIO_VERIFY_SERVICE_SID is missing or invalid."
        )

    return Client(account_sid, auth_token)


# =========================================================
# MOBILE NUMBER NORMALIZATION
# =========================================================

def normalize_mobile(mobile):
    """
    Accept:
      9876543210
      919876543210
      +919876543210
      09876543210

    Return a 10-digit Indian mobile number or None.
    """
    if not mobile:
        return None

    digits = "".join(
        character
        for character in str(mobile).strip()
        if character.isdigit()
    )

    if len(digits) == 12 and digits.startswith("91"):
        digits = digits[2:]
    elif len(digits) == 11 and digits.startswith("0"):
        digits = digits[1:]

    if len(digits) != 10:
        return None

    return digits


def get_allowed_mobiles():
    """
    Read one or more authorized test numbers from
    TWILIO_ALLOWED_MOBILE. Comma-separated values are supported.
    """
    raw_allowed = getattr(
        settings, "TWILIO_ALLOWED_MOBILE", ""
    )

    if isinstance(raw_allowed, (list, tuple)):
        numbers = raw_allowed
    else:
        numbers = str(raw_allowed).split(",")

    return {
        normalized
        for number in numbers
        if (normalized := normalize_mobile(number))
    }


def validate_allowed_mobile(mobile):
    allowed_mobiles = get_allowed_mobiles()

    return bool(allowed_mobiles) and mobile in allowed_mobiles


# =========================================================
# REQUEST OTP
# =========================================================

@api_view(["POST"])
def request_otp(request):
    mobile = normalize_mobile(request.data.get("mobile", ""))

    if not mobile:
        return Response(
            {"error": "Please enter a valid 10-digit mobile number."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not validate_allowed_mobile(mobile):
        return Response(
            {
                "error": (
                    "OTP verification is available only for the "
                    "configured test mobile number."
                )
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    phone_number = f"+91{mobile}"

    try:
        client = get_twilio_client()

        verification = (
            client.verify.v2
            .services(settings.TWILIO_VERIFY_SERVICE_SID.strip())
            .verifications
            .create(
                channel="sms",
                to=phone_number,
            )
        )

        logger.info(
            "OTP request processed. status=%s",
            verification.status,
        )

        return Response(
            {
                "message": "OTP sent successfully.",
                "status": verification.status,
            },
            status=status.HTTP_200_OK,
        )

    except TwilioRestException as exc:
        logger.error(
            "Twilio OTP request failed: status=%s code=%s message=%s",
            exc.status,
            exc.code,
            exc.msg,
        )

        return Response(
            {
                "error": (
                    "Unable to send OTP. Check the Twilio "
                    "configuration and backend logs."
                ),
                "twilio_error_code": exc.code,
            },
            status=status.HTTP_502_BAD_GATEWAY,
        )

    except Exception:
        logger.exception("Unexpected error while requesting OTP.")

        return Response(
            {"error": "Unable to send OTP. Please try again."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


# =========================================================
# VERIFY OTP
# =========================================================

@api_view(["POST"])
def verify_otp(request):
    try:
        mobile = normalize_mobile(request.data.get("mobile", ""))
        otp = str(request.data.get("otp", "")).strip()

        if not mobile:
            return Response(
                {"error": "Please enter a valid 10-digit mobile number."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not validate_allowed_mobile(mobile):
            return Response(
                {
                    "error": (
                        "OTP verification is available only for the "
                        "configured test mobile number."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(otp) != 6 or not otp.isdigit():
            return Response(
                {"error": "Please enter a valid 6-digit OTP."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        phone_number = f"+91{mobile}"

        client = get_twilio_client()

        verification_check = (
            client.verify.v2
            .services(settings.TWILIO_VERIFY_SERVICE_SID.strip())
            .verification_checks
            .create(
                to=phone_number,
                code=otp,
            )
        )

        if verification_check.status != "approved":
            return Response(
                {"error": "Incorrect or expired OTP."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # =====================================================
        # OTP VERIFIED: GET OR CREATE USER AND CITIZEN SAFELY
        # =====================================================

        user, _ = User.objects.get_or_create(
            username=f"citizen_{mobile}"
        )

        citizen = Citizen.objects.filter(mobile=mobile).first()

        if not citizen:
            if hasattr(user, "citizen_profile") and user.citizen_profile:
                citizen = user.citizen_profile
                citizen.mobile = mobile
                citizen.is_verified = True
                citizen.save()
                citizen_created = False
            else:
                citizen = Citizen.objects.create(
                    user=user,
                    mobile=mobile,
                    is_verified=True,
                )
                citizen_created = True
        else:
            citizen_created = False
            if citizen.user != user:
                Citizen.objects.filter(user=user).exclude(id=citizen.id).update(user=None)
                citizen.user = user
                citizen.is_verified = True
                citizen.save(update_fields=["user", "is_verified"])
            elif not citizen.is_verified:
                citizen.is_verified = True
                citizen.save(update_fields=["is_verified"])

        # =====================================================
        # CREATE OR RETRIEVE DRF AUTH TOKEN
        # =====================================================

        token, _ = Token.objects.get_or_create(user=user)

        return Response(
            {
                "message": "OTP verified successfully.",
                "token": token.key,
                "citizen_id": citizen.id,
                "is_new_citizen": citizen_created,
                "citizen": CitizenSerializer(citizen).data,
            },
            status=status.HTTP_200_OK,
        )

    except TwilioRestException as exc:
        logger.error(
            "Twilio verification failed: status=%s code=%s message=%s",
            exc.status,
            exc.code,
            exc.msg,
        )

        return Response(
            {
                "error": (
                    "Twilio could not verify the OTP. "
                    "Check the Verify Service configuration and "
                    "backend logs."
                ),
                "twilio_error_code": exc.code,
            },
            status=status.HTTP_502_BAD_GATEWAY,
        )

    except Exception as exc:
        logger.exception("Unexpected error while verifying OTP: %s", exc)

        return Response(
            {"error": f"Unable to verify OTP: {str(exc)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

