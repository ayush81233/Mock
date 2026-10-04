import "./Accessibility.css";

function Accessibility() {
  return (
    <div className="accessibility-page">

      <section className="accessibility-header">
        <div className="container">

          <span className="page-kicker">
            Accessibility
          </span>

          <h1>Accessibility</h1>

          <p>
            Information about accessibility features available in
            this demonstration portal.
          </p>

        </div>
      </section>


      <section className="accessibility-section">
        <div className="container">

          <div className="accessibility-card">

            <h2>Our Accessibility Approach</h2>

            <p>
              This portal is designed with accessibility in mind so
              that information and services can be easier to access
              for different users and devices.
            </p>

          </div>


          <div className="accessibility-grid">

            <div className="accessibility-item">
              <h2>Keyboard Navigation</h2>
              <p>
                Interactive controls are designed to support keyboard
                navigation.
              </p>
            </div>

            <div className="accessibility-item">
              <h2>Readable Content</h2>
              <p>
                Clear typography, spacing and colour contrast are used
                throughout the interface.
              </p>
            </div>

            <div className="accessibility-item">
              <h2>Responsive Design</h2>
              <p>
                Pages are designed to adapt to desktops, tablets and
                smaller screens.
              </p>
            </div>

            <div className="accessibility-item">
              <h2>Language Support</h2>
              <p>
                The portal is designed to support English, Hindi and
                Kannada interfaces.
              </p>
            </div>

          </div>


          <div className="accessibility-card">

            <h2>Accessibility Feedback</h2>

            <p>
              If a user experiences difficulty accessing information
              or navigating the demonstration portal, feedback can
              be provided through the Contact page.
            </p>

          </div>

        </div>
      </section>

    </div>
  );
}

export default Accessibility;