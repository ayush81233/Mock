import React, { useState, useEffect } from "react";
import { getAdminApplications, updateAdminApplicationStatus } from "../api";
import "./AdminDashboard.css";

const STATUS_CONFIG = {
  DRAFT: { label: "Draft", class: "status-draft", bg: "#f3f4f6", text: "#4b5563" },
  SUBMITTED: { label: "Submitted", class: "status-submitted", bg: "#eff6ff", text: "#2563eb" },
  UNDER_REVIEW: { label: "Under Review", class: "status-review", bg: "#fef3c7", text: "#d97706" },
  APPROVED: { label: "Approved", class: "status-approved", bg: "#dcfce7", text: "#16a34a" },
  REJECTED: { label: "Rejected", class: "status-rejected", bg: "#fee2e2", text: "#dc2626" },
  CORRECTION_REQUIRED: { label: "Correction Required", class: "status-correction", bg: "#ffedd5", text: "#ea580c" },
};

export default function AdminDashboard() {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    submitted: 0,
    under_review: 0,
    approved: 0,
    rejected: 0,
    correction_required: 0,
    draft: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");

  // Modal states
  const [selectedApp, setSelectedApp] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const fetchApplications = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAdminApplications({ status: activeFilter, q: searchQuery });
      setApplications(data.results || []);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      setError(err.message || "Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [activeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchApplications();
  };

  const openUpdateModal = (app) => {
    setSelectedApp(app);
    setNewStatus(app.status);
    setRemarks("");
    setIsUpdateModalOpen(true);
  };

  const openDetailModal = (app) => {
    setSelectedApp(app);
    setIsDetailModalOpen(true);
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    setSubmitting(true);
    try {
      const res = await updateAdminApplicationStatus(selectedApp.application_number, newStatus, remarks);
      setIsUpdateModalOpen(false);
      setToastMessage(res.message || `Application ${selectedApp.application_number} updated successfully!`);
      fetchApplications();
      setTimeout(() => setToastMessage(""), 4000);
    } catch (err) {
      alert("Error updating status: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-dashboard-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="admin-toast">
          <span>✓</span> {toastMessage}
        </div>
      )}

      {/* Header Banner */}
      <div className="admin-header-banner">
        <div className="admin-header-content">
          <div className="admin-badge">GOVERNMENT SCHEMES PORTAL</div>
          <h1>YojanaSaathi Admin Dashboard</h1>
          <p>Review citizen applications, verify documents, and update processing statuses in real-time.</p>
        </div>
        <button className="admin-refresh-btn" onClick={fetchApplications} disabled={loading}>
          {loading ? "Refreshing..." : "↻ Refresh List"}
        </button>
      </div>

      {/* Analytics Statistics Row */}
      <div className="admin-stats-grid">
        <div className="stat-card stat-total" onClick={() => setActiveFilter("ALL")}>
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Applications</div>
        </div>

        <div className="stat-card stat-submitted" onClick={() => setActiveFilter("SUBMITTED")}>
          <div className="stat-number">{stats.submitted}</div>
          <div className="stat-label">Submitted</div>
        </div>

        <div className="stat-card stat-review" onClick={() => setActiveFilter("UNDER_REVIEW")}>
          <div className="stat-number">{stats.under_review}</div>
          <div className="stat-label">Under Review</div>
        </div>

        <div className="stat-card stat-approved" onClick={() => setActiveFilter("APPROVED")}>
          <div className="stat-number">{stats.approved}</div>
          <div className="stat-label">Approved</div>
        </div>

        <div className="stat-card stat-action" onClick={() => setActiveFilter("CORRECTION_REQUIRED")}>
          <div className="stat-number">{stats.correction_required + stats.rejected}</div>
          <div className="stat-label">Action / Rejected</div>
        </div>
      </div>

      {/* Control Bar: Search & Status Filter Tabs */}
      <div className="admin-control-bar">
        <div className="status-tabs">
          {[
            { key: "ALL", label: "All Statuses" },
            { key: "SUBMITTED", label: "Submitted" },
            { key: "UNDER_REVIEW", label: "Under Review" },
            { key: "APPROVED", label: "Approved" },
            { key: "CORRECTION_REQUIRED", label: "Correction Required" },
            { key: "REJECTED", label: "Rejected" },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`tab-btn ${activeFilter === tab.key ? "active" : ""}`}
              onClick={() => setActiveFilter(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form className="admin-search-form" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search Application #, Mobile, Scheme..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      {/* Main Applications Table */}
      <div className="admin-table-wrapper">
        {loading ? (
          <div className="admin-state-box">
            <div className="admin-spinner"></div>
            <p>Loading application data...</p>
          </div>
        ) : error ? (
          <div className="admin-state-box error-box">
            <p>Error: {error}</p>
            <button onClick={fetchApplications}>Try Again</button>
          </div>
        ) : applications.length === 0 ? (
          <div className="admin-state-box">
            <p>No applications found matching your criteria.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Application #</th>
                <th>Citizen Details</th>
                <th>Scheme</th>
                <th>Submitted Date</th>
                <th>Status</th>
                <th>Docs</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => {
                const statusInfo = STATUS_CONFIG[app.status] || {
                  label: app.status,
                  class: "status-draft",
                };

                return (
                  <tr key={app.id}>
                    <td className="font-mono font-bold">{app.application_number}</td>
                    <td>
                      <div className="citizen-name">{app.citizen_full_name || "Applicant"}</div>
                      <div className="citizen-mobile">📱 {app.citizen_mobile}</div>
                    </td>
                    <td>
                      <div className="scheme-title">{app.scheme_title}</div>
                      <span className="scheme-category-badge">{app.scheme_category}</span>
                    </td>
                    <td>{app.submitted_at ? new Date(app.submitted_at).toLocaleDateString("en-IN") : "—"}</td>
                    <td>
                      <span className={`status-pill ${statusInfo.class}`}>{statusInfo.label}</span>
                    </td>
                    <td>
                      <span className="docs-badge">
                        📄 {app.verified_documents_count || 0}/{app.documents_count || 0}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="action-btn-group">
                        <button className="btn-action-view" onClick={() => openDetailModal(app)}>
                          View
                        </button>
                        <button className="btn-action-update" onClick={() => openUpdateModal(app)}>
                          Update Status
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* UPDATE STATUS MODAL */}
      {isUpdateModalOpen && selectedApp && (
        <div className="modal-backdrop" onClick={() => setIsUpdateModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Update Status — {selectedApp.application_number}</h3>
              <button className="modal-close-btn" onClick={() => setIsUpdateModalOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleStatusUpdate} className="modal-body">
              <div className="info-summary-box">
                <div>
                  <strong>Applicant:</strong> {selectedApp.citizen_full_name || "N/A"} ({selectedApp.citizen_mobile})
                </div>
                <div>
                  <strong>Scheme:</strong> {selectedApp.scheme_title}
                </div>
                <div>
                  <strong>Current Status:</strong>{" "}
                  <span className={`status-pill ${STATUS_CONFIG[selectedApp.status]?.class || ""}`}>
                    {STATUS_CONFIG[selectedApp.status]?.label || selectedApp.status}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label>Select New Application Status:</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="admin-select"
                  required
                >
                  <option value="SUBMITTED">Submitted</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="APPROVED">Approved (Grant Scheme)</option>
                  <option value="CORRECTION_REQUIRED">Correction Required</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div className="form-group">
                <label>Remarks / Note to Citizen (Optional):</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Income certificate requires re-upload or Application approved."
                  rows="3"
                  className="admin-textarea"
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsUpdateModalOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-save" disabled={submitting}>
                  {submitting ? "Saving..." : "Save & Notify Citizen"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW APPLICATION DETAILS MODAL */}
      {isDetailModalOpen && selectedApp && (
        <div className="modal-backdrop" onClick={() => setIsDetailModalOpen(false)}>
          <div className="modal-card modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Application Details — {selectedApp.application_number}</h3>
              <button className="modal-close-btn" onClick={() => setIsDetailModalOpen(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body scrollable-modal-body">
              <div className="detail-section">
                <h4>Applicant Information</h4>
                <div className="detail-grid">
                  <div>
                    <strong>Full Name:</strong> {selectedApp.citizen_full_name || "N/A"}
                  </div>
                  <div>
                    <strong>Mobile Number:</strong> {selectedApp.citizen_mobile}
                  </div>
                  <div>
                    <strong>Scheme Applied:</strong> {selectedApp.scheme_title}
                  </div>
                  <div>
                    <strong>Submission Date:</strong>{" "}
                    {selectedApp.submitted_at ? new Date(selectedApp.submitted_at).toLocaleString("en-IN") : "Draft"}
                  </div>
                </div>
              </div>

              {selectedApp.form_data && Object.keys(selectedApp.form_data).length > 0 && (
                <div className="detail-section">
                  <h4>Submitted Form Fields</h4>
                  <div className="form-fields-grid">
                    {Object.entries(selectedApp.form_data).map(([key, val]) => (
                      <div key={key} className="form-field-item">
                        <span className="field-key">{key.replace(/_/g, " ")}:</span>
                        <span className="field-val">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="detail-section">
                <h4>Uploaded Documents ({selectedApp.documents?.length || 0})</h4>
                {selectedApp.documents && selectedApp.documents.length > 0 ? (
                  <div className="doc-list font-sans">
                    {selectedApp.documents.map((doc) => (
                      <div key={doc.id} className="doc-item">
                        <div>
                          <strong>{doc.document_type}</strong> — <span>{doc.file_name}</span>
                          <span className={`doc-status status-${doc.verification_status.toLowerCase()}`}>
                            {doc.verification_status}
                          </span>
                        </div>
                        {doc.download_url && (
                          <a
                            href={doc.download_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="doc-download-link"
                          >
                            ⬇ Download
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray">No documents uploaded for this application.</p>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-action-update"
                onClick={() => {
                  setIsDetailModalOpen(false);
                  openUpdateModal(selectedApp);
                }}
              >
                Update Status
              </button>
              <button type="button" className="btn-cancel" onClick={() => setIsDetailModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
