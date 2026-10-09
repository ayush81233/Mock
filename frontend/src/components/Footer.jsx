import { Link } from "react-router-dom";
import { useTranslation } from "../i18n";
import "./Footer.css";

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">

      <div className="container">

        <div className="footer-grid">

          {/* ABOUT */}

          <div className="footer-column">

            <h3>{t("footer.brandTitle")}</h3>

            <p>
              {t("footer.aboutText")}
            </p>

          </div>


          {/* QUICK LINKS */}

          <div className="footer-column">

            <h3>{t("footer.quickLinksTitle")}</h3>

            <Link to="/">{t("nav.home")}</Link>

            <Link to="/schemes">{t("nav.schemes")}</Link>

            <Link to="/documents">{t("nav.documents")}</Link>

            <Link to="/services">{t("nav.services")}</Link>

            <Link to="/search">{t("nav.search")}</Link>

            <Link to="/applications">{t("nav.applications")}</Link>

            <Link to="/track-application">{t("nav.trackApplication")}</Link>

            <Link to="/about">{t("nav.about")}</Link>

          </div>


          {/* HELP & SUPPORT */}

          <div className="footer-column">

            <h3>{t("footer.helpTitle")}</h3>

            <Link to="/help">{t("footer.faq")}</Link>

            <Link to="/accessibility">
              {t("footer.accessibility")}
            </Link>

            <Link to="/contact">
              {t("footer.contact")}
            </Link>

            <Link to="/privacy">
              {t("footer.privacy")}
            </Link>

            <Link to="/disclaimer">
              {t("footer.disclaimer")}
            </Link>

          </div>


          {/* IMPORTANT */}

          <div className="footer-column">

            <h3>{t("footer.importantTitle")}</h3>

            <p>
              {t("footer.demoText")}
            </p>

            <p>
              {t("footer.disclaimerText")}
            </p>

          </div>

        </div>


        <div className="footer-bottom">

          <p>
            {t("footer.copyright")}
          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;