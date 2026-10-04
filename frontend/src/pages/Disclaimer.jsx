import "./Privacy.css";

function Disclaimer() {
  return (
    <div className="info-page">

      <section className="info-header">
        <div className="container">
          <span className="page-kicker">Legal Information</span>

          <h1>Disclaimer</h1>

          <p>
            Important information about the purpose and limitations
            of this demonstration portal.
          </p>
        </div>
      </section>


      <section className="info-section">
        <div className="container">

          <div className="info-card">

            <h2>Demonstration Only</h2>

            <p>
              This portal has been developed as a software
              demonstration and educational project. It is not an
              official government website.
            </p>

          </div>


          <div className="info-card">

            <h2>Scheme Information</h2>

            <p>
              Scheme names, descriptions, benefits, eligibility
              conditions and application information displayed in
              this version may be fictional or simplified for
              demonstration purposes.
            </p>

          </div>


          <div className="info-card">

            <h2>Eligibility Results</h2>

            <p>
              Results produced by the Eligibility Checker are based
              on sample rules and must not be considered an official
              determination of eligibility.
            </p>

          </div>


          <div className="info-card">

            <h2>Official Sources</h2>

            <p>
              Before taking action based on government scheme
              information, users should verify current requirements,
              eligibility conditions, documents and application
              procedures through the relevant official government
              source.
            </p>

          </div>

        </div>
      </section>

    </div>
  );
}

export default Disclaimer;