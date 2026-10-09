import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "../i18n";
import "./SchemeDetails.css";

import { getScheme, downloadBlankFormPdf } from "../api";

function SchemeDetails() {
  const { id } = useParams();
  const { t, getLocalizedScheme } = useTranslation();

  const [rawScheme, setRawScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingBlank, setDownloadingBlank] = useState(false);

  useEffect(() => {
    getScheme(id)
      .then((data) => {
        setRawScheme(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load the scheme details.");
        setLoading(false);
      });
  }, [id]);

  const scheme = getLocalizedScheme(rawScheme);

  const handleDownloadBlank = async () => {
    if (!scheme) return;
    setDownloadingBlank(true);
    try {
      await downloadBlankFormPdf(scheme.id, scheme.title);
    } catch (err) {
      console.error(err);
      alert("Unable to download blank form at this moment.");
    } finally {
      setDownloadingBlank(false);
    }
  };

  if (loading) {
    return (
      <section className="page-section">
        <div className="container">
          <p>{t("common.loading")}</p>
        </div>
      </section>
    );
  }

  if (error || !scheme) {
    return (
      <section className="page-section not-found">
        <div className="container">
          <h1>{t("schemes.schemeNotFound")}</h1>
          <p>{error}</p>

          <Link to="/schemes" className="back-link">
            {t("schemes.backToSchemes")}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="scheme-details-page">
      <div className="details-header">
        <div className="container">
          <Link to="/schemes" className="back-link">
            {t("schemes.backToSchemes")}
          </Link>

          <span className="details-category">
            {scheme.category}
          </span>

          <h1>{scheme.title}</h1>
          <p>{scheme.short_description}</p>
        </div>
      </div>

      <div className="details-content">
        <div className="container">
          <div className="details-layout">

            {/* Left Content Column */}
            <div className="details-main">
              <section className="detail-section">
                <h2>{t("schemes.aboutScheme")}</h2>
                <p>{scheme.description}</p>
              </section>

              <section className="detail-section">
                <h2>{t("schemes.eligibilityCriteria")}</h2>
                <ul>
                  {scheme.eligibility && scheme.eligibility.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </section>

              <section className="detail-section">
                <h2>{t("schemes.keyBenefits")}</h2>
                <ul>
                  {scheme.benefits && scheme.benefits.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </section>

              <section className="detail-section">
                <h2>{t("schemes.mandatoryDocuments")}</h2>
                <ul>
                  {scheme.documents && scheme.documents.map((item, index) => (
                    <li key={index}>
                      <strong>{item}</strong>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="detail-section">
                <h2>{t("schemes.applicationProcess")}</h2>
                <ol>
                  {scheme.application_process && scheme.application_process.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ol>
              </section>
            </div>

            {/* Right Action Sidebar */}
            <aside className="details-sidebar">
              <div className="apply-box">
                <span>ONLINE CITIZEN ACCESS</span>
                <h3>{t("schemes.applyOnline")}</h3>
                <p>
                  {t("schemes.applyOnlineDesc")}
                </p>

                <Link
                  to={`/apply/${scheme.id}`}
                  className="scheme-button"
                  style={{
                    display: "block",
                    textAlign: "center",
                    textDecoration: "none",
                    marginTop: "16px",
                    padding: "14px",
                    fontWeight: "700",
                    backgroundColor: "#123b6d",
                    color: "#ffffff",
                    borderRadius: "4px",
                  }}
                >
                  {t("schemes.applyButton")}
                </Link>

                <button
                  type="button"
                  onClick={handleDownloadBlank}
                  disabled={downloadingBlank}
                  style={{
                    width: "100%",
                    marginTop: "10px",
                    padding: "12px",
                    background: "#f1f5f9",
                    color: "#1e3a8a",
                    border: "1px solid #cbd5e1",
                    borderRadius: "4px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  {downloadingBlank ? t("schemes.downloadingBlank") : t("schemes.downloadBlankForm")}
                </button>
              </div>

              <div className="quick-info">
                <h3>{t("schemes.quickInfo")}</h3>
                <div>
                  <strong>{t("schemes.schemeId")}:</strong>
                  <span>{scheme.id.toUpperCase()}</span>
                </div>
                <div>
                  <strong>Category:</strong>
                  <span>{scheme.category}</span>
                </div>
                <div>
                  <strong>{t("schemes.mandatoryDocuments")}:</strong>
                  <span>{scheme.documents ? scheme.documents.length : 0} {t("schemes.itemsCount")}</span>
                </div>
                <div>
                  <strong>Mode:</strong>
                  <span>{t("schemes.applicationMode")}</span>
                </div>
              </div>

              <div
                style={{
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  padding: "16px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  color: "#1e40af",
                  lineHeight: "1.6",
                }}
              >
                <strong>ℹ {t("schemes.demoNotice")}</strong>
              </div>
            </aside>

          </div>
        </div>
      </div>
    </div>
  );
}

export default SchemeDetails;