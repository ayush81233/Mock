import "./Privacy.css";

function Privacy() {
  return (
    <div className="info-page">

      <section className="info-header">
        <div className="container">
          <span className="page-kicker">Legal Information</span>
          <h1>Privacy</h1>
          <p>
            Information about privacy within this demonstration portal.
          </p>
        </div>
      </section>


      <section className="info-section">
        <div className="container">

          <div className="info-card">
            <h2>Demonstration Environment</h2>

            <p>
              This portal is a software demonstration. It does not
              connect to live government databases or process real
              citizen applications.
            </p>
          </div>


          <div className="info-card">
            <h2>Mock Documents</h2>

            <p>
              Documents displayed in the Document Centre are fictional
              examples created for demonstration purposes. Users
              should not upload real identity, financial or other
              sensitive documents into this demonstration environment.
            </p>
          </div>


          <div className="info-card">
            <h2>Sample Information</h2>

            <p>
              Scheme information, eligibility conditions and contact
              information used by this version of the portal are
              demonstration data.
            </p>
          </div>


          <div className="info-card">
            <h2>Future Production Version</h2>

            <p>
              A production system would require appropriate security,
              authentication, authorization, encryption, data retention
              controls and applicable privacy safeguards before handling
              real citizen information.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}

export default Privacy;