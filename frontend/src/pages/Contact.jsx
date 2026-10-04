import "./Contact.css";

function Contact() {
  return (
    <div className="contact-page">

      <section className="contact-header">
        <div className="container">

          <span className="page-kicker">
            Help & Support
          </span>

          <h1>Contact</h1>

          <p>
            Sample contact information for the demonstration portal.
          </p>

        </div>
      </section>


      <section className="contact-section">
        <div className="container">

          <div className="contact-grid">

            <div className="contact-card">

              <h2>Citizen Support</h2>

              <p>
                For demonstration purposes, the following contact
                details are displayed as sample information.
              </p>

              <div className="contact-detail">
                <strong>Email</strong>
                <span>support@example.gov.in</span>
              </div>

              <div className="contact-detail">
                <strong>Helpline</strong>
                <span>1800-000-0000</span>
              </div>

              <div className="contact-detail">
                <strong>Working Hours</strong>
                <span>Monday – Friday, 9:00 AM – 5:00 PM</span>
              </div>

            </div>


            <div className="contact-card">

              <h2>Portal Feedback</h2>

              <p>
                Feedback about this demonstration interface can be
                recorded here during development.
              </p>

              <div className="contact-detail">
                <strong>Purpose</strong>
                <span>
                  UI testing, accessibility feedback and feature
                  suggestions.
                </span>
              </div>

              <div className="contact-detail">
                <strong>Response</strong>
                <span>
                  This demonstration does not currently process
                  real support requests.
                </span>
              </div>

            </div>

          </div>


          <div className="contact-notice">

            <strong>Demo Notice</strong>

            <p>
              The contact information displayed on this page is
              fictional demonstration data and should not be used
              to contact an actual government department.
            </p>

          </div>

        </div>
      </section>

    </div>
  );
}

export default Contact;