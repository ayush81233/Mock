from django.urls import path

from .views import request_otp, verify_otp


urlpatterns = [
    path("request-otp/", request_otp),
    path("verify-otp/", verify_otp),
]