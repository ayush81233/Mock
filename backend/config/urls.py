from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path


from applications.views import (
    citizen_notifications,
    download_blank_form_pdf,
    mark_all_notifications_read,
    mark_notification_read,
)
from schemes.views import api_status, scheme_detail, scheme_list


urlpatterns = [
    path("admin/", admin.site.urls),

    # General API
    path("api/status/", api_status),

    # Dedicated YojanaSaathi AI Agent Machine-to-Machine API (v1)
    path("api/agent/v1/", include("agent_api.urls")),

    # Schemes API
    path("api/schemes/", scheme_list),
    path("api/schemes/<str:scheme_id>/", scheme_detail),
    path("api/schemes/<str:scheme_id>/blank-form-pdf/", download_blank_form_pdf),

    # Citizen authentication & delegation
    path("api/auth/", include("accounts.urls")),

    # Applications API
    path("api/applications/", include("applications.urls")),

    # Notifications API
    path("api/notifications/", citizen_notifications),
    path("api/notifications/<uuid:notification_id>/read/", mark_notification_read),
    path("api/notifications/mark-all-read/", mark_all_notifications_read),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)