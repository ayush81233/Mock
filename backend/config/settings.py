
"""
Django settings for config project.

Environment variables (via backend/.env or deployment environment)
control all sensitive and deployment-specific values.
"""

import os
import sys
import urllib.parse
from pathlib import Path

from corsheaders.defaults import default_headers
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(BASE_DIR / ".env")


# ============================================================
# SECURITY
# ============================================================

SECRET_KEY = os.getenv("DJANGO_SECRET_KEY")

if not SECRET_KEY:
    if "test" in sys.argv:
        SECRET_KEY = "test-only-insecure-key-not-for-production-use"
    else:
        raise RuntimeError(
            "DJANGO_SECRET_KEY environment variable is not set. "
            "Set it in backend/.env or your deployment environment."
        )

YOJANASAATHI_AGENT_API_KEY = os.getenv(
    "YOJANASAATHI_AGENT_API_KEY", ""
)


# ============================================================
# DEBUG
# ============================================================

DEBUG = os.getenv(
    "DJANGO_DEBUG", "False"
).lower() in ("true", "1", "yes")


# ============================================================
# HOSTS, CORS AND CSRF
# ============================================================

_allowed_hosts_raw = os.getenv(
    "DJANGO_ALLOWED_HOSTS",
    "governmentyojana-zxvh.onrender.com,localhost,127.0.0.1",
)

ALLOWED_HOSTS = [
    host.strip()
    for host in _allowed_hosts_raw.split(",")
    if host.strip()
]

_cors_raw = os.getenv(
    "DJANGO_CORS_ALLOWED_ORIGINS",
    "https://governmentyojana.netlify.app,"
    "http://localhost:5173,"
    "http://127.0.0.1:5173",
)

CORS_ALLOWED_ORIGINS = [
    origin.strip().rstrip("/")
    for origin in _cors_raw.split(",")
    if origin.strip()
]

CORS_ALLOW_HEADERS = list(default_headers) + [
    "x-agent-api-key",
    "x-citizen-delegation-token",
]

_csrf_raw = os.getenv(
    "DJANGO_CSRF_TRUSTED_ORIGINS",
    "https://governmentyojana.netlify.app,"
    "http://localhost:5173,"
    "http://127.0.0.1:5173",
)

CSRF_TRUSTED_ORIGINS = [
    origin.strip().rstrip("/")
    for origin in _csrf_raw.split(",")
    if origin.strip()
]


# ============================================================
# TWILIO OTP
# ============================================================

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID", "")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN", "")

TWILIO_VERIFY_SERVICE_SID = os.getenv(
    "TWILIO_VERIFY_SERVICE_SID", ""
)

TWILIO_ALLOWED_MOBILE = os.getenv(
    "TWILIO_ALLOWED_MOBILE", ""
)

OTP_MODE = os.getenv("OTP_MODE", "twilio")


# ============================================================
# MEDIA FILES
# ============================================================

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"


# ============================================================
# APPLICATIONS
# ============================================================

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "rest_framework",
    "rest_framework.authtoken",
    "corsheaders",

    "schemes",
    "accounts",
    "applications",
    "agent_api",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"


# ============================================================
# DATABASE
# ============================================================

DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    url = urllib.parse.urlparse(DATABASE_URL)

    if url.scheme in ("postgres", "postgresql"):
        DATABASES = {
            "default": {
                "ENGINE": "django.db.backends.postgresql",
                "NAME": urllib.parse.unquote(
                    url.path.lstrip("/")
                ),
                "USER": urllib.parse.unquote(
                    url.username or ""
                ),
                "PASSWORD": urllib.parse.unquote(
                    url.password or ""
                ),
                "HOST": url.hostname or "",
                "PORT": str(url.port or "5432"),
                "CONN_MAX_AGE": 600,
                "OPTIONS": {
                    "sslmode": "require",
                },
            }
        }

    elif url.scheme == "sqlite":
        DATABASES = {
            "default": {
                "ENGINE": "django.db.backends.sqlite3",
                "NAME": url.path,
            }
        }

    else:
        raise ValueError(
            "Unsupported DATABASE_URL scheme. "
            "Use PostgreSQL or SQLite."
        )

else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }


# ============================================================
# PASSWORD VALIDATION
# ============================================================

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "UserAttributeSimilarityValidator"
        ),
    },
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "MinimumLengthValidator"
        ),
    },
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "CommonPasswordValidator"
        ),
    },
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "NumericPasswordValidator"
        ),
    },
]


# ============================================================
# INTERNATIONALIZATION
# ============================================================

LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Kolkata"

USE_I18N = True
USE_TZ = True


# ============================================================
# STATIC FILES
# ============================================================

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"


# ============================================================
# EMAIL
# ============================================================

EMAIL_BACKEND = os.getenv(
    "DJANGO_EMAIL_BACKEND",
    (
        "django.core.mail.backends.smtp.EmailBackend"
        if not DEBUG
        else "django.core.mail.backends.console.EmailBackend"
    ),
)


# ============================================================
# DJANGO REST FRAMEWORK
# ============================================================

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.TokenAuthentication",
    ],
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "100/min",
        "user": "300/min",
        "agent_api": "120/min",
        "agent_public": "300/min",
    },
}


# ============================================================
# PRODUCTION SECURITY
# ============================================================

if not DEBUG:
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True

    SECURE_HSTS_SECONDS = int(
        os.getenv("DJANGO_SECURE_HSTS_SECONDS", "31536000")
    )

    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True

    SECURE_PROXY_SSL_HEADER = (
        "HTTP_X_FORWARDED_PROTO",
        "https",
    )

    if os.getenv(
        "DJANGO_SECURE_SSL_REDIRECT", "True"
    ).lower() in ("true", "1", "yes"):
        SECURE_SSL_REDIRECT = True

    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = "DENY"
