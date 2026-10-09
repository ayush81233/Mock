const DEFAULT_API_BASE_URL = import.meta.env.DEV
  ? "/api"
  : "https://governmentyojana-zxvh.onrender.com/api";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL
).replace(/\/+$/, "");

/* =========================
   RESPONSE HANDLING
   ========================= */

async function readJsonResponse(response, fallbackMessage) {
  const contentType = response.headers.get("content-type") || "";
  const text = await response.text();

  let data = {};

  if (contentType.includes("application/json")) {
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(
        `The server returned invalid JSON (HTTP ${response.status}).`
      );
    }
  } else {
    const preview = text
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    throw new Error(
      `The API returned a non-JSON response (HTTP ${response.status}). ` +
      (preview ? preview.slice(0, 180) : fallbackMessage)
    );
  }

  if (!response.ok) {
    throw new Error(
      data.error || data.detail || fallbackMessage
    );
  }

  return data;
}

function requireCitizenToken() {
  const token = getCitizenToken();

  if (!token) {
    throw new Error("Citizen authentication is required.");
  }

  return token;
}

function tokenHeaders(token, extra = {}) {
  return {
    ...extra,
    Authorization: `Token ${token}`,
  };
}

/* =========================
   SCHEMES
   ========================= */

export async function getSchemes(params = {}) {
  const queryParams = new URLSearchParams();

  if (params.q) {
    queryParams.set("q", params.q);
  }

  if (params.category && params.category !== "All") {
    queryParams.set("category", params.category);
  }

  const queryString = queryParams.toString();

  const url = queryString
    ? `${API_BASE_URL}/schemes/?${queryString}`
    : `${API_BASE_URL}/schemes/`;

  const response = await fetch(url);

  const data = await readJsonResponse(
    response,
    "Failed to fetch schemes."
  );

  return Array.isArray(data) ? data : (data.results || []);
}

export async function getScheme(id) {
  const response = await fetch(
    `${API_BASE_URL}/schemes/${encodeURIComponent(id)}/`
  );

  return readJsonResponse(response, "Failed to fetch scheme.");
}

/* =========================
   CITIZEN AUTHENTICATION
   ========================= */

export async function requestOTP(mobile) {
  const response = await fetch(
    `${API_BASE_URL}/auth/request-otp/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mobile }),
    }
  );

  return readJsonResponse(response, "Unable to send OTP.");
}

export async function verifyOTP(mobile, otp) {
  const response = await fetch(
    `${API_BASE_URL}/auth/verify-otp/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mobile, otp }),
    }
  );

  return readJsonResponse(response, "Unable to verify OTP.");
}

/* =========================
   CITIZEN SESSION
   ========================= */

export function saveCitizenSession(data) {
  if (!data?.token) {
    throw new Error(
      "The authentication response did not include a token."
    );
  }

  localStorage.setItem("citizen_token", data.token);
  localStorage.setItem(
    "citizen",
    JSON.stringify(data.citizen ?? null)
  );
}

export function getCitizenToken() {
  return localStorage.getItem("citizen_token");
}

export function getCitizen() {
  const citizen = localStorage.getItem("citizen");

  if (!citizen) {
    return null;
  }

  try {
    return JSON.parse(citizen);
  } catch {
    return null;
  }
}

export function logoutCitizen() {
  localStorage.removeItem("citizen_token");
  localStorage.removeItem("citizen");
}

/* =========================
   APPLICATIONS
   ========================= */

export async function createApplication(schemeId, formData) {
  const token = requireCitizenToken();

  const response = await fetch(
    `${API_BASE_URL}/applications/`,
    {
      method: "POST",
      headers: tokenHeaders(token, {
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        scheme_id: schemeId,
        form_data: formData,
      }),
    }
  );

  return readJsonResponse(
    response,
    "Unable to create application."
  );
}

export async function getMyApplications() {
  const token = requireCitizenToken();

  const response = await fetch(
    `${API_BASE_URL}/applications/mine/`,
    {
      headers: tokenHeaders(token),
    }
  );

  return readJsonResponse(
    response,
    "Unable to fetch applications."
  );
}

export async function getApplication(applicationNumber) {
  const token = requireCitizenToken();

  const response = await fetch(
    `${API_BASE_URL}/applications/${encodeURIComponent(applicationNumber)}/`,
    {
      headers: tokenHeaders(token),
    }
  );

  return readJsonResponse(
    response,
    "Unable to fetch application."
  );
}

export async function updateApplication(
  applicationNumber,
  formData
) {
  const token = requireCitizenToken();

  const response = await fetch(
    `${API_BASE_URL}/applications/${encodeURIComponent(applicationNumber)}/`,
    {
      method: "PATCH",
      headers: tokenHeaders(token, {
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        form_data: formData,
      }),
    }
  );

  return readJsonResponse(
    response,
    "Unable to update application."
  );
}

export async function submitApplication(
  applicationNumber,
  formData = null
) {
  const token = requireCitizenToken();

  const payload = formData
    ? { form_data: formData }
    : {};

  const response = await fetch(
    `${API_BASE_URL}/applications/${encodeURIComponent(applicationNumber)}/submit/`,
    {
      method: "POST",
      headers: tokenHeaders(token, {
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(payload),
    }
  );

  return readJsonResponse(
    response,
    "Unable to submit application."
  );
}

/* =========================
   DOCUMENTS
   ========================= */

export async function uploadApplicationDocument(
  applicationNumber,
  documentType,
  file
) {
  const token = requireCitizenToken();

  const formData = new FormData();

  formData.append("document_type", documentType);
  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/applications/${encodeURIComponent(applicationNumber)}/documents/`,
    {
      method: "POST",
      headers: tokenHeaders(token),
      body: formData,
    }
  );

  return readJsonResponse(
    response,
    "Unable to upload document."
  );
}

export async function getApplicationDocuments(applicationNumber) {
  const token = requireCitizenToken();

  const response = await fetch(
    `${API_BASE_URL}/applications/${encodeURIComponent(applicationNumber)}/documents/`,
    {
      headers: tokenHeaders(token),
    }
  );

  return readJsonResponse(
    response,
    "Unable to fetch documents."
  );
}

export async function deleteApplicationDocument(
  applicationNumber,
  documentId
) {
  const token = requireCitizenToken();

  const response = await fetch(
    `${API_BASE_URL}/applications/${encodeURIComponent(applicationNumber)}/documents/${encodeURIComponent(documentId)}/`,
    {
      method: "DELETE",
      headers: tokenHeaders(token),
    }
  );

  if (response.status === 204 || response.status === 205) {
    return null;
  }

  return readJsonResponse(
    response,
    "Unable to delete document."
  );
}

export async function downloadApplicationDocument(
  applicationNumber,
  documentId,
  fileName
) {
  const token = requireCitizenToken();

  const response = await fetch(
    `${API_BASE_URL}/applications/${encodeURIComponent(applicationNumber)}/documents/${encodeURIComponent(documentId)}/download/`,
    {
      headers: tokenHeaders(token),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Unable to download document (HTTP ${response.status}).`
    );
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName || "document";

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.URL.revokeObjectURL(url);
}

/* =========================
   PDF GENERATION & DOWNLOAD
   ========================= */

export async function downloadApplicationPdf(applicationNumber) {
  const token = requireCitizenToken();

  const response = await fetch(
    `${API_BASE_URL}/applications/${encodeURIComponent(applicationNumber)}/pdf/`,
    {
      headers: tokenHeaders(token),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Unable to generate application PDF (HTTP ${response.status}).`
    );
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `Application_${applicationNumber}.pdf`;

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.URL.revokeObjectURL(url);
}

export async function downloadBlankFormPdf(
  schemeId,
  schemeTitle = "Scheme"
) {
  const response = await fetch(
    `${API_BASE_URL}/schemes/${encodeURIComponent(schemeId)}/blank-form-pdf/`
  );

  if (!response.ok) {
    throw new Error(
      `Unable to download blank form PDF (HTTP ${response.status}).`
    );
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `Blank_Form_${schemeId}.pdf`;

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.URL.revokeObjectURL(url);
}

/* =========================
   NOTIFICATIONS
   ========================= */

export async function getNotifications() {
  const token = getCitizenToken();

  if (!token) {
    return {
      unread_count: 0,
      results: [],
    };
  }

  const response = await fetch(
    `${API_BASE_URL}/notifications/`,
    {
      headers: tokenHeaders(token),
    }
  );

  return readJsonResponse(
    response,
    "Unable to fetch notifications."
  );
}

export async function markNotificationRead(notificationId) {
  const token = getCitizenToken();

  if (!token) {
    return;
  }

  const response = await fetch(
    `${API_BASE_URL}/notifications/${encodeURIComponent(notificationId)}/read/`,
    {
      method: "PATCH",
      headers: tokenHeaders(token),
    }
  );

  if (!response.ok) {
    await readJsonResponse(
      response,
      "Unable to mark notification as read."
    );
  }
}

export async function markAllNotificationsRead() {
  const token = getCitizenToken();

  if (!token) {
    return;
  }

  const response = await fetch(
    `${API_BASE_URL}/notifications/mark-all-read/`,
    {
      method: "POST",
      headers: tokenHeaders(token),
    }
  );

  if (!response.ok) {
    await readJsonResponse(
      response,
      "Unable to mark notifications as read."
    );
  }
}

/* =========================
   DEMO REVIEW ACTIONS
   ========================= */

export async function demoVerifyAllDocuments(applicationNumber) {
  const token = requireCitizenToken();

  const response = await fetch(
    `${API_BASE_URL}/applications/${encodeURIComponent(applicationNumber)}/demo-verify/`,
    {
      method: "POST",
      headers: tokenHeaders(token),
    }
  );

  return readJsonResponse(
    response,
    "Unable to complete demo verification."
  );
}

export async function demoVerifyDocument(
  applicationNumber,
  documentId,
  status = "VERIFIED",
  remarks = "Verified by YojanaSaathi Demo Review"
) {
  const token = requireCitizenToken();

  const response = await fetch(
    `${API_BASE_URL}/applications/${encodeURIComponent(applicationNumber)}/documents/${encodeURIComponent(documentId)}/verify/`,
    {
      method: "POST",
      headers: tokenHeaders(token, {
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        status,
        remarks,
      }),
    }
  );

  return readJsonResponse(
    response,
    "Unable to verify document."
  );
}

/* =========================
   APPLICATION STATUS
   ========================= */

export async function getApplicationStatus(applicationNumber) {
  const token = requireCitizenToken();

  const response = await fetch(
    `${API_BASE_URL}/applications/${encodeURIComponent(applicationNumber)}/status/`,
    {
      headers: tokenHeaders(token),
    }
  );

  return readJsonResponse(
    response,
    "Unable to fetch application status."
  );
}

/* =========================
   YOJANASAATHI AGENT DELEGATION
   ========================= */

export async function createAgentDelegation(
  durationHours = 24,
  scopes = null
) {
  const token = requireCitizenToken();

  const payload = {
    duration_hours: durationHours,
  };

  if (scopes) {
    payload.scopes = scopes;
  }

  const response = await fetch(
    `${API_BASE_URL}/auth/agent-delegation/`,
    {
      method: "POST",
      headers: tokenHeaders(token, {
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(payload),
    }
  );

  return readJsonResponse(
    response,
    "Unable to create agent delegation."
  );
}

export async function getAgentDelegations() {
  const token = requireCitizenToken();

  const response = await fetch(
    `${API_BASE_URL}/auth/agent-delegations/`,
    {
      headers: tokenHeaders(token),
    }
  );

  return readJsonResponse(
    response,
    "Unable to fetch agent delegations."
  );
}

export async function revokeAgentDelegation(delegationId) {
  const token = requireCitizenToken();

  const response = await fetch(
    `${API_BASE_URL}/auth/agent-delegation/${encodeURIComponent(delegationId)}/revoke/`,
    {
      method: "POST",
      headers: tokenHeaders(token),
    }
  );

  return readJsonResponse(
    response,
    "Unable to revoke agent delegation."
  );
}

/* =========================
   API BASE URL
   ========================= */

export default API_BASE_URL;