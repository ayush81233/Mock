import { Link } from "react-router-dom";
import { documents } from "../data/documents";
import { useTranslation } from "../i18n";
import "./Documents.css";

function Documents() {
  const { t, language } = useTranslation();

  const categories = [
    {
      id: "Identity",
      name: language === "kn" ? "ಗುರುತಿನ ದಾಖಲೆಗಳು" : language === "hi" ? "पहचान दस्तावेज़" : "Identity",
      desc: language === "kn" ? "ಆಧಾರ್, ವೋಟರ್ ಐಡಿ ಮುಂತಾದ ಗುರುತಿನ ಪುರಾವೆಗಳು." : language === "hi" ? "आधार, मतदाता पहचान पत्र जैसे पहचान प्रमाण।" : "Aadhaar, Voter ID and government photo credentials."
    },
    {
      id: "Income",
      name: language === "kn" ? "ಆದಾಯ ದಾಖಲೆಗಳು" : language === "hi" ? "आय दस्तावेज़" : "Income",
      desc: language === "kn" ? "ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ ಮತ್ತು ಸಂಬಳದ ಪುರಾವೆಗಳು." : language === "hi" ? "आय प्रमाण पत्र और वेतन प्रमाण।" : "Income certificates and financial eligibility credentials."
    },
    {
      id: "Residence",
      name: language === "kn" ? "ವಾಸಸ್ಥಳ ದಾಖಲೆಗಳು" : language === "hi" ? "निवास दस्तावेज़" : "Residence",
      desc: language === "kn" ? "ವಾಸಸ್ಥಳ ಪ್ರಮಾಣಪತ್ರ ಮತ್ತು ವಿಳಾಸದ ಪುರಾವೆಗಳು." : language === "hi" ? "निवास प्रमाण पत्र और पते के प्रमाण।" : "Domicile and address verification credentials."
    },
    {
      id: "Bank",
      name: language === "kn" ? "ಬ್ಯಾಂಕ್ ದಾಖಲೆಗಳು" : language === "hi" ? "बैंक दस्तावेज़" : "Bank",
      desc: language === "kn" ? "ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್ ಮತ್ತು ಖಾತೆಯ ವಿವರಗಳು." : language === "hi" ? "बैंक पासबुक और खाता विवरण।" : "Bank passbook and direct benefit transfer details."
    },
    {
      id: "Other",
      name: language === "kn" ? "ಇತರ ದಾಖಲೆಗಳು" : language === "hi" ? "अन्य दस्तावेज़" : "Other",
      desc: language === "kn" ? "ಜಾತಿ ಪ್ರಮಾಣಪತ್ರ, ಅಂಗವೈಕಲ್ಯ ಪ್ರಮಾಣಪತ್ರ ಇತ್ಯಾದಿ." : language === "hi" ? "जाति प्रमाण पत्र, दिव्यांगता प्रमाण पत्र आदि।" : "Caste, disability, or specialized welfare certificates."
    }
  ];

  return (
    <div className="documents-page">

      {/* Header */}
      <section className="documents-header">
        <div className="container">
          <span className="documents-label">
            {t("home.quickDocuments")}
          </span>

          <h1>{t("documents.title")}</h1>

          <p>{t("documents.subtitle")}</p>
        </div>
      </section>

      {/* Notice */}
      <section className="documents-notice-section">
        <div className="container">
          <div className="documents-notice">
            <div className="notice-symbol">!</div>
            <div>
              <strong>{t("footer.importantTitle")}</strong>
              <p>{t("footer.disclaimerText")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="document-categories">
        <div className="container">
          <div className="section-heading">
            <span>{t("home.categoriesTitle")}</span>
            <h2>{t("documents.title")}</h2>
            <p>{t("documents.subtitle")}</p>
          </div>

          <div className="document-category-grid">
            {categories.map((cat, idx) => {
              const docItem = documents.find((item) => item.category === cat.id) || documents[0];

              return (
                <Link
                  key={cat.id}
                  to={`/documents/${docItem.id}`}
                  className="document-category-card"
                >
                  <div className="document-card-number">
                    {String(idx + 1).padStart(2, "0")}
                  </div>

                  <h3>{cat.name}</h3>

                  <p>{cat.desc}</p>

                  <span>{t("documents.viewDetails")} →</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mock Documents */}
      <section className="mock-documents-section">
        <div className="container">
          <div className="section-heading">
            <span>DEMONSTRATION</span>
            <h2>Sample Documents</h2>
            <p>
              {language === "kn"
                ? "ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ನಾಗರಿಕ ದಾಖಲೆಗಳನ್ನು ಹೇಗೆ ತೋರಿಸಲಾಗುತ್ತದೆ ಎಂಬುದನ್ನು ವಿವರಿಸುವ ಮಾದರಿ ದಾಖಲೆಗಳು."
                : language === "hi"
                ? "पोर्टल पर नागरिक दस्तावेज़ कैसे दर्शाए जाते हैं, यह दिखाने वाले नमूना दस्तावेज़।"
                : "Sample documents showing how citizen documents may be represented inside this demonstration portal."}
            </p>
          </div>

          <div className="mock-document-grid">
            <Link to="/documents/mock/identity" className="mock-document-card">
              <div className="mock-preview identity-preview">ID</div>
              <div>
                <span>SAMPLE</span>
                <h3>{language === "kn" ? "ಗುರುತಿನ ದಾಖಲೆ" : language === "hi" ? "पहचान दस्तावेज़" : "Identity Document"}</h3>
                <p>{language === "kn" ? "ಪ್ರಾತ್ಯಕ್ಷಿಕೆಗಾಗಿ ಕಾಲ್ಪನಿಕ ಗುರುತಿನ ದಾಖಲೆ." : language === "hi" ? "प्रदर्शन के लिए काल्पनिक पहचान दस्तावेज़।" : "Fictional identity document for demonstration."}</p>
              </div>
            </Link>

            <Link to="/documents/mock/income" className="mock-document-card">
              <div className="mock-preview income-preview">₹</div>
              <div>
                <span>SAMPLE</span>
                <h3>{language === "kn" ? "ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ" : language === "hi" ? "आय प्रमाण पत्र" : "Income Certificate"}</h3>
                <p>{language === "kn" ? "ಪ್ರಾತ್ಯಕ್ಷಿಕೆಗಾಗಿ ಕಾಲ್ಪನಿಕ ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ." : language === "hi" ? "प्रदर्शन के लिए काल्पनिक आय प्रमाण पत्र।" : "Fictional income certificate for demonstration."}</p>
              </div>
            </Link>

            <Link to="/documents/mock/residence" className="mock-document-card">
              <div className="mock-preview residence-preview">R</div>
              <div>
                <span>SAMPLE</span>
                <h3>{language === "kn" ? "ವಾಸಸ್ಥಳ ಪ್ರಮಾಣಪತ್ರ" : language === "hi" ? "निवास प्रमाण पत्र" : "Residence Certificate"}</h3>
                <p>{language === "kn" ? "ಪ್ರಾತ್ಯಕ್ಷಿಕೆಗಾಗಿ ಕಾಲ್ಪನಿಕ ವಾಸಸ್ಥಳ ಪ್ರಮಾಣಪತ್ರ." : language === "hi" ? "प्रदर्शन के लिए काल्पनिक निवास प्रमाण पत्र।" : "Fictional residence certificate for demonstration."}</p>
              </div>
            </Link>

            <Link to="/documents/mock/bank" className="mock-document-card">
              <div className="mock-preview bank-preview">B</div>
              <div>
                <span>SAMPLE</span>
                <h3>{language === "kn" ? "ಬ್ಯಾಂಕ್ ದಾಖಲೆ" : language === "hi" ? "बैंक दस्तावेज़" : "Bank Document"}</h3>
                <p>{language === "kn" ? "ಪ್ರಾತ್ಯಕ್ಷಿಕೆಗಾಗಿ ಕಾಲ್ಪನಿಕ ಬ್ಯಾಂಕ್ ದಾಖಲೆ." : language === "hi" ? "प्रदर्शन के लिए काल्पनिक बैंक दस्तावेज़।" : "Fictional bank document for demonstration."}</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Documents;