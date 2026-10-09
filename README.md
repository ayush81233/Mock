# YojanaSaathi — Government Scheme Navigator

> ⚠ **DEMO PORTAL** — This is an educational demonstration project, not an official government website. All scheme information, application records, and verification data are for demonstration purposes only.

---

## Project Overview

**YojanaSaathi** is a full-stack demonstration of a citizen-facing government welfare scheme portal, built to explore:

- Secure citizen authentication (OTP-based mobile verification via Twilio)
- Multi-step online application forms with document upload
- Application status tracking with audit trail timeline
- Trilingual UI (English · ಕನ್ನಡ · हिन्दी)
- AI-agent-ready read-only status API endpoint (Phase 4)

---

## Architecture

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite, React Router v7 |
| Backend | Django 6.1 + Django REST Framework |
| Auth | Twilio Verify (OTP) + DRF Token Auth |
| Database | SQLite (local dev) |
| Styles | Vanilla CSS with design-token system |

---

## Quick Start (Local Development)

### Prerequisites
- Python 3.11+
- Node.js 20+
- A [Twilio account](https://www.twilio.com/) with a Verify service SID

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/GOVERNMENT-YOJANA-PORTAL.git
cd GOVERNMENT-YOJANA-PORTAL
```

### 2. Backend setup

```bash
# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file from template
cp backend/.env.example backend/.env
# Edit backend/.env and set DJANGO_SECRET_KEY and Twilio credentials

# Apply migrations and seed scheme data
cd backend
python manage.py migrate
python manage.py loaddata schemes/fixtures/schemes.json   # if available
python manage.py createsuperuser                           # optional

# Start the backend server (default: http://127.0.0.1:8000)
python manage.py runserver
```

### 3. Frontend setup

```bash
# In a separate terminal, from the project root:
cd frontend
npm install

# (Optional) create a local env file
cp .env.example .env

# Start the development server (default: http://localhost:5173)
npm run dev
```

> The Vite dev server is pre-configured to proxy `/api` and `/media` requests to `http://127.0.0.1:8000` automatically — no CORS issues during development.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `DJANGO_SECRET_KEY` | **Yes** | Long random Django secret key |
| `DJANGO_DEBUG` | No | `True` for local dev, `False` in production |
| `DJANGO_ALLOWED_HOSTS` | No | Comma-separated hostnames |
| `DJANGO_CORS_ALLOWED_ORIGINS` | No | Comma-separated origins (scheme+host+port) |
| `DJANGO_CSRF_TRUSTED_ORIGINS` | No | Comma-separated CSRF origins |
| `TWILIO_ACCOUNT_SID` | **Yes** | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | **Yes** | Twilio auth token |
| `TWILIO_VERIFY_SERVICE_SID` | **Yes** | Twilio Verify service SID |
| `TWILIO_ALLOWED_MOBILE` | **Yes** | Comma-separated 10-digit mobile numbers |
| `OTP_MODE` | No | `twilio` (live) or `console` (dev testing) |

Copy `backend/.env.example` to `backend/.env` and fill in all required values.

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | No | Override API base URL (leave blank for dev proxy) |
| `VITE_BACKEND_URL` | No | Backend URL for Vite proxy (default: `http://127.0.0.1:8000`) |

---

## Running Tests

```bash
# Backend unit + integration tests (17 tests)
cd /path/to/GOVERNMENT-YOJANA-PORTAL
source venv/bin/activate
python backend/manage.py test applications accounts schemes --verbosity=2

# Frontend production build check
cd frontend && npm run build
```

---

## API Reference

### Authentication
All citizen endpoints require `Authorization: Token <token>` header obtained after OTP verification.

### Key Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/request-otp/` | None | Send OTP to mobile number |
| `POST` | `/api/auth/verify-otp/` | None | Verify OTP and receive token |
| `GET` | `/api/schemes/` | None | List all schemes |
| `GET` | `/api/schemes/<id>/` | None | Scheme details |
| `GET` | `/api/schemes/<id>/blank-form-pdf/` | None | Download blank application PDF |
| `POST` | `/api/applications/` | Token | Create application draft |
| `GET` | `/api/applications/mine/` | Token | List citizen's applications |
| `GET` | `/api/applications/<app_no>/` | Token | Application detail |
| `POST` | `/api/applications/<app_no>/submit/` | Token | Submit application |
| `GET` | **`/api/applications/<app_no>/status/`** | Token | **Read-only status (Phase 4)** |
| `POST` | `/api/applications/<app_no>/documents/` | Token | Upload document |
| `GET` | `/api/applications/<app_no>/pdf/` | Token | Download application PDF |

### Phase 4 — Status Endpoint (AI Agent Integration)

```
GET /api/applications/{application_number}/status/
Authorization: Token <citizen_token>
```

**Response (200 OK):**
```json
{
  "application_number": "YJS-XXXXXXXX",
  "scheme_id": "health-001",
  "scheme_title": "National Health Support Scheme",
  "status": "SUBMITTED",
  "status_label": "Submitted",
  "submitted_at": "2026-10-08T14:23:00Z",
  "updated_at": "2026-10-08T14:23:00Z",
  "next_step": "Your application has been received and is awaiting review."
}
```

**Security guarantees:**
- Requires a valid citizen Token (same as all other citizen endpoints)
- Owner-only access: a citizen can only query their own applications
- Cross-citizen access returns `404` (not `403`) to avoid leaking existence
- Does **not** expose: form_data, documents, Aadhaar, bank information, or any PII
- Rate limiting recommended at reverse-proxy layer before exposing publicly

---

## Project Structure

```
GOVERNMENT-YOJANA-PORTAL/
├── backend/
│   ├── accounts/          # Citizen auth, OTP (Twilio), Token
│   ├── applications/      # Application workflow, documents, notifications
│   │   ├── models.py
│   │   ├── views.py       # Phase 4: application_status endpoint
│   │   ├── serializers.py # ApplicationStatusSerializer (safe fields only)
│   │   ├── tests.py       # 17 tests incl. Phase 4 status endpoint tests
│   │   └── urls.py
│   ├── schemes/           # Scheme data, trilingual translations
│   ├── config/
│   │   └── settings.py    # All secrets from env vars; security hardened
│   ├── .env.example       # ← copy to .env before running
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── api.js         # Centralized API client (env-var-driven base URL)
│   │   ├── i18n/          # en.js, kn.js (Kannada), hi.js (Hindi)
│   │   ├── pages/         # Home, Schemes, SchemeDetails, Apply, MyServices…
│   │   ├── components/    # Header, Footer
│   │   └── styles/
│   │       └── global.css # Full government-portal design system
│   ├── vite.config.js     # Dev proxy: /api → Django backend
│   └── .env.example       # ← copy to .env if needed
├── .gitignore             # Excludes db.sqlite3, media/, .env files
└── README.md
```

---

## Security Notes

This project follows these security practices:

- ✅ `SECRET_KEY` loaded from environment variable — never hardcoded
- ✅ `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS` env-driven
- ✅ Production HTTPS/cookie security activated when `DJANGO_DEBUG=False`
- ✅ `backend/db.sqlite3` and `backend/media/` excluded from Git tracking
- ✅ `.env` files excluded from Git — only `.env.example` files are committed
- ✅ File upload: only PDF/JPG/JPEG/PNG, max 5 MB per file
- ✅ Cross-citizen access returns 404 to avoid information leakage
- ✅ Status endpoint exposes no PII or sensitive application data

**Do not store real citizen data, Aadhaar numbers, or government credentials in this demo environment.**

---

## Localization

The UI supports three languages switchable from the header:

| Language | Code | Coverage |
|---|---|---|
| English | `en` | 100% |
| ಕನ್ನಡ (Kannada) | `kn` | 100% |
| हिन्दी (Hindi) | `hi` | 100% |

Language preference is persisted in `localStorage`.

---

## License

This project is a demonstration portfolio project. Not for production or official government use.

---

*Built with Django · React · Vite · Twilio · ❤️ for Indian governance technology*
