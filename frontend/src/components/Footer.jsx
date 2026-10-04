import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="container">

        <div className="footer-grid">

          {/* ABOUT */}

          <div className="footer-column">

            <h3>Sarkar Yojana Seva</h3>

            <p>
              A demonstration portal for exploring government
              schemes, citizen services and related information.
            </p>

          </div>


          {/* QUICK LINKS */}

          <div className="footer-column">

            <h3>Quick Links</h3>

            <Link to="/">Home</Link>

            <Link to="/schemes">Schemes</Link>

            <Link to="/sir">SIR</Link>

            <Link to="/documents">Documents</Link>

            <Link to="/services">Citizen Services</Link>

            <Link to="/search">Search</Link>

          </div>


          {/* HELP & SUPPORT */}

          <div className="footer-column">

            <h3>Help & Support</h3>

            <Link to="/help">FAQ</Link>

            <Link to="/accessibility">
              Accessibility
            </Link>

            <Link to="/contact">
              Contact
            </Link>

            <Link to="/privacy">
              Privacy
            </Link>

            <Link to="/disclaimer">
              Disclaimer
            </Link>

          </div>


          {/* IMPORTANT */}

          <div className="footer-column">

            <h3>Important</h3>

            <p>
              This website is a demonstration project and is not
              an official government website.
            </p>

            <p>
              Information displayed on this portal may contain
              sample or mock data.
            </p>

          </div>

        </div>


        <div className="footer-bottom">

          <p>
            © 2026 Sarkar Yojana Seva. Demonstration Portal.
          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;