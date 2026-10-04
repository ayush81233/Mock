from django.contrib import admin
from django.urls import path

from schemes.views import (
    api_status,
    scheme_list,
    scheme_detail,
)


urlpatterns = [
    path("admin/", admin.site.urls),

    path(
        "api/status/",
        api_status
    ),

    path(
        "api/schemes/",
        scheme_list
    ),

    path(
        "api/schemes/<str:scheme_id>/",
        scheme_detail
    ),
]