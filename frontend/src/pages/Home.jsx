import { Link } from "react-router-dom";
import { useTranslation } from "../i18n";
import "./Home.css";

function Home() {
  const { t } = useTranslation();

  return (
    <div className="home-page">

      {/* Hero */}

      <section className="hero">

        <div className="container hero-content">

          <div className="hero-text">

            <span className="hero-label">
              {t("home.heroTag")}
            </span>

            <h1>
              {t("home.heroTitle")}
            </h1>

            <p>
              {t("home.heroSubtitle")}
            </p>

            <div className="hero-actions">

              <Link to="/schemes" className="primary-button">
                {t("home.viewAllSchemes")}
              </Link>

              <Link to="/citizen-services/scheme-finder" className="secondary-button">
                {t("services.schemeFinderTitle")}
              </Link>

            </div>

          </div>

          <div className="hero-panel">

            <h3>{t("home.quickAccess")}</h3>

            <Link to="/schemes">
              {t("home.quickHealth")}
            </Link>

            <Link to="/schemes">
              {t("home.quickPension")}
            </Link>

            <Link to="/documents">
              {t("home.quickDocuments")}
            </Link>

            <Link to="/services">
              {t("nav.services")}
            </Link>

          </div>

        </div>

      </section>


      {/* Quick Services */}

      <section className="section">

        <div className="container">

          <div className="section-heading">
            <span>{t("home.quickAccess")}</span>

            <h2>
              {t("nav.services")}
            </h2>

            <p>
              {t("services.subtitle")}
            </p>
          </div>


          <div className="service-grid">

            <Link to="/schemes" className="service-card" style={{ textDecoration: "none", color: "inherit" }}>
              <div className="service-icon">⌕</div>

              <h3>{t("schemes.title")}</h3>

              <p>
                {t("schemes.subtitle")}
              </p>
            </Link>


            <Link to="/citizen-services/scheme-finder" className="service-card" style={{ textDecoration: "none", color: "inherit" }}>
              <div className="service-icon">✓</div>

              <h3>{t("services.schemeFinderTitle")}</h3>

              <p>
                {t("services.schemeFinderDesc")}
              </p>
            </Link>


            <Link to="/documents" className="service-card" style={{ textDecoration: "none", color: "inherit" }}>
              <div className="service-icon">▣</div>

              <h3>{t("documents.title")}</h3>

              <p>
                {t("documents.subtitle")}
              </p>
            </Link>


            <Link to="/help" className="service-card" style={{ textDecoration: "none", color: "inherit" }}>
              <div className="service-icon">?</div>

              <h3>{t("help.title")}</h3>

              <p>
                {t("help.subtitle")}
              </p>
            </Link>

          </div>

        </div>

      </section>


      {/* Scheme Categories */}

      <section className="category-section">

        <div className="container">

          <div className="section-heading">
            <span>{t("home.categoriesTitle")}</span>

            <h2>
              {t("home.featuredTitle")}
            </h2>
          </div>


          <div className="category-grid">

            <div className="category-card">
              <span>01</span>
              <h3>{t("home.categoryHealth")}</h3>
              <p>
                {t("home.categoryHealthDesc")}
              </p>
            </div>


            <div className="category-card">
              <span>02</span>
              <h3>{t("home.categoryPension")}</h3>
              <p>
                {t("home.categoryPensionDesc")}
              </p>
            </div>


            <div className="category-card">
              <span>03</span>
              <h3>{t("home.categoryServices")}</h3>
              <p>
                {t("home.categoryServicesDesc")}
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
              {t("home.infoBoxLabel")}
            </span>

            <h2>
              {t("home.infoBoxTitle")}
            </h2>
          </div>

          <div className="information-list">

            <p>
              {t("home.infoBoxDesc")}
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;