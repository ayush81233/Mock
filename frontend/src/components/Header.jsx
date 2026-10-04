import { Link } from "react-router-dom";
import "./Header.css";


function Header() {
  return (
    <header>
      {/* Government Utility Bar */}
      <div className="gov-topbar">
        <div className="container gov-topbar-inner">
          <span>Government Citizen Services Portal</span>

          <div className="topbar-right">
            <button type="button">Skip to Main Content</button>
            <button type="button">A-</button>
            <button type="button">A</button>
            <button type="button">A+</button>
          </div>
        </div>
      </div>

      {/* Branding */}
      <div className="branding">
        <div className="container branding-inner">

          <Link to="/" className="brand">
            <div className="emblem-placeholder">
              🇮🇳
            </div>

            <div>
              <div className="brand-title">
                Sarkar Yojana Seva
              </div>

              <div className="brand-subtitle">
                Citizen Scheme & Service Information
              </div>
            </div>
          </Link>

          <div className="header-actions">

            <div className="language-control">
              <label htmlFor="language">
                Language
              </label>

              <select id="language" defaultValue="English">
                <option value="English">English</option>
                <option value="Hindi">हिंदी</option>
                <option value="Kannada">ಕನ್ನಡ</option>
              </select>
            </div>

            <button
              type="button"
              className="accessibility-button"
            >
              Accessibility
            </button>

          </div>

        </div>
      </div>

      {/* Main Navigation */}
      <nav className="main-nav">
        <div className="container nav-inner">

          <Link to="/">Home</Link>

          <Link to="/schemes">
            Schemes
          </Link>

          <Link to="/sir">
            SIR
          </Link>

          <Link to="/documents">
            Documents
          </Link>

          <Link to="/services">
            Citizen Services
          </Link>

          <Link to="/search">
            Search
          </Link>

          <Link to="/help">
            Help & Support
          </Link>

        </div>
      </nav>
    </header>
  );
}

export default Header;