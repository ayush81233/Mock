import { Link } from "react-router-dom";
import { useTranslation } from "../i18n";
import "./Header.css";

function Header() {
  const { language, setLanguage, t } = useTranslation();

  return (
    <header>
      {/* Government Utility Bar */}
      <div className="gov-topbar">
        <div className="container gov-topbar-inner">
          <span>{t("header.govPortal")}</span>

          <div className="topbar-right">
            <button type="button">{t("header.skipToContent")}</button>
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
                {t("header.brandTitle")}
              </div>

              <div className="brand-subtitle">
                {t("header.brandSubtitle")}
              </div>
            </div>
          </Link>

          <div className="header-actions">

            <div className="language-control">
              <label htmlFor="language">
                {t("header.language")}
              </label>

              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                aria-label={t("header.language")}
              >
                <option value="en">English</option>
                <option value="kn">ಕನ್ನಡ</option>
                <option value="hi">हिन्दी</option>
              </select>
            </div>

            <button
              type="button"
              className="accessibility-button"
            >
              {t("header.accessibility")}
            </button>

          </div>

        </div>
      </div>

      {/* Main Navigation */}
      <nav className="main-nav">
        <div className="container nav-inner">

          <Link to="/">{t("nav.home")}</Link>

          <Link to="/schemes">
            {t("nav.schemes")}
          </Link>

          <Link to="/documents">
            {t("nav.documents")}
          </Link>

          <Link to="/services">
            {t("nav.services")}
          </Link>

          <Link to="/my-services">
            {t("nav.applications")}
          </Link>

          <Link to="/my-applications">
            {t("nav.trackApplication")}
          </Link>

          <Link to="/help">
            {t("nav.help")}
          </Link>

          <Link to="/disclaimer">
            {t("nav.about")}
          </Link>

        </div>
      </nav>
    </header>
  );
}

export default Header;