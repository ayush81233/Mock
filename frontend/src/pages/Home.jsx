import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-page">

      {/* Hero */}

      <section className="hero">

        <div className="container hero-content">

          <div className="hero-text">

            <span className="hero-label">
              CITIZEN INFORMATION PORTAL
            </span>

            <h1>
              Find Government Schemes
              & Services
            </h1>

            <p>
              Discover schemes, understand eligibility,
              check required documents and learn how to apply.
            </p>

            <div className="hero-actions">

              <Link to="/schemes" className="primary-button">
  Find a Scheme
</Link>

<Link to="/services" className="secondary-button">
  Check Eligibility
</Link>

            </div>

          </div>

          <div className="hero-panel">

            <h3>What are you looking for?</h3>

            <Link to="/schemes">
  Health Schemes
</Link>

<Link to="/schemes">
  Pension Schemes
</Link>

<Link to="/documents">
  Documents
</Link>

<Link to="/services">
  Citizen Services
</Link>

          </div>

        </div>

      </section>


      {/* Quick Services */}

      <section className="section">

        <div className="container">

          <div className="section-heading">
            <span>QUICK ACCESS</span>

            <h2>
              Citizen Services
            </h2>

            <p>
              Access commonly used services and information.
            </p>
          </div>


          <div className="service-grid">

            <div className="service-card">
              <div className="service-icon">⌕</div>

              <h3>Find a Scheme</h3>

              <p>
                Browse government schemes based on your needs.
              </p>
            </div>


            <div className="service-card">
              <div className="service-icon">✓</div>

              <h3>Eligibility Checker</h3>

              <p>
                Understand whether you may meet scheme requirements.
              </p>
            </div>


            <div className="service-card">
              <div className="service-icon">▣</div>

              <h3>Document Centre</h3>

              <p>
                Learn which documents may be required.
              </p>
            </div>


            <div className="service-card">
              <div className="service-icon">?</div>

              <h3>Get Help</h3>

              <p>
                Find answers to common citizen questions.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* Scheme Categories */}

      <section className="category-section">

        <div className="container">

          <div className="section-heading">
            <span>SCHEME CATEGORIES</span>

            <h2>
              Explore Schemes
            </h2>
          </div>


          <div className="category-grid">

            <div className="category-card">
              <span>01</span>
              <h3>Health</h3>
              <p>
                Healthcare and medical assistance schemes.
              </p>
            </div>


            <div className="category-card">
              <span>02</span>
              <h3>Pension</h3>
              <p>
                Pension and social security related schemes.
              </p>
            </div>


            <div className="category-card">
              <span>03</span>
              <h3>SIR</h3>
              <p>
                Information and guidance related to SIR.
              </p>
            </div>


            <div className="category-card">
              <span>04</span>
              <h3>Other Services</h3>
              <p>
                Explore additional citizen services.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* Important Information */}

      <section className="section">

        <div className="container information-box">

          <div>
            <span className="section-label">
              IMPORTANT INFORMATION
            </span>

            <h2>
              Before applying for a scheme
            </h2>
          </div>

          <div className="information-list">

            <p>
              ✓ Check the eligibility requirements.
            </p>

            <p>
              ✓ Keep the required documents ready.
            </p>

            <p>
              ✓ Read the application process carefully.
            </p>

            <p>
              ✓ Verify information before submitting an application.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;