import { Link } from "react-router-dom";
import "./CitizenServices.css";

function CitizenServices() {
  return (
    <div className="citizen-services-page">

      <section className="page-header">
        <div className="container">
          <span className="page-kicker">Citizen Services</span>

          <h1>Citizen Services</h1>

          <p>
            Use these services to explore government schemes, understand
            eligibility requirements and identify the documents commonly
            required for applications.
          </p>
        </div>
      </section>

      <section className="services-section">
        <div className="container">

          <div className="services-grid">

            <div className="service-card">
              <div className="service-icon">🔎</div>

              <h2>Scheme Finder</h2>

              <p>
                Find schemes based on basic information such as category,
                age group and other eligibility details.
              </p>

              <Link to="/citizen-services/scheme-finder" className="service-button">
                Find Schemes
              </Link>
            </div>


            <div className="service-card">
              <div className="service-icon">✓</div>

              <h2>Eligibility Checker</h2>

              <p>
                Check whether your basic information matches the eligibility
                conditions of available demo schemes.
              </p>

              <Link to="/citizen-services/eligibility" className="service-button">
                Check Eligibility
              </Link>
            </div>


            <div className="service-card">
              <div className="service-icon">📄</div>

              <h2>Document Checklist</h2>

              <p>
                View the documents that may commonly be required when
                applying for a selected scheme.
              </p>

              <Link to="/citizen-services/documents" className="service-button">
                View Checklist
              </Link>
            </div>

          </div>


          <div className="services-notice">

            <strong>Demo Information</strong>

            <p>
              These citizen services are part of a demonstration portal.
              Eligibility results and document requirements shown here are
              sample data and should not be treated as official government
              decisions.
            </p>

          </div>

        </div>
      </section>

    </div>
  );
}

export default CitizenServices;