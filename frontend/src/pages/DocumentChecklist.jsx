import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./DocumentChecklist.css";
import { getSchemes } from "../api";
const documentMap = {
  "Identity Proof": "identity-proof",
  "Residence Proof": "residence-certificate",
  "Residence Certificate": "residence-certificate",
  "Income Certificate": "income-certificate",
  "Bank Account Details": "bank-proof",
  "Bank Account Proof": "bank-proof",
  "Bank Proof": "bank-proof",
  "Age Proof": "other-documents",
  "Family Details": "other-documents",
  "Medical Documents, where applicable": "other-documents",
  "Age Proof, where applicable": "other-documents",
};

function DocumentChecklist() {
  const [schemes, setSchemes] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

useEffect(() => {
  getSchemes()
    .then((data) => {
      setSchemes(data);
      setLoading(false);
    })
    .catch((err) => {
      console.error(err);
      setError("Unable to load schemes from the server.");
      setLoading(false);
    });
}, []);

  const scheme = schemes.find(
    (item) => item.id === selectedScheme
  );

  if (loading) {
    return (
      <section className="page-section">
        <div className="container">
          <div className="page-heading">
            <span className="section-label">Citizen Services</span>
            <h1>Document Checklist</h1>
            <p>Loading schemes...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page-section">
        <div className="container">
          <div className="page-heading">
            <span className="section-label">Citizen Services</span>
            <h1>Document Checklist</h1>
            <p className="error-message">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page-section">
      <div className="container">

        <div className="page-heading">
          <span className="section-label">Citizen Services</span>

          <h1>Document Checklist</h1>

          <p>
            Select a scheme to view the documents required
            for the demonstration application process.
          </p>
        </div>

        <div className="checklist-selector">

          <label htmlFor="scheme">
            Select Scheme
          </label>

          <select
            id="scheme"
            value={selectedScheme}
            onChange={(event) =>
              setSelectedScheme(event.target.value)
            }
          >
            <option value="">
              Select a scheme
            </option>

            {schemes.map((item) => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.title}
              </option>
            ))}
          </select>

        </div>

        {scheme && (
          <div className="checklist-result">

            <div className="checklist-header">
              <span className="scheme-category">
                {scheme.category}
              </span>

              <h2>{scheme.title}</h2>

              <p>{scheme.short_description}</p>
            </div>

            <div className="document-list">

              {scheme.documents.map((documentName, index) => {
                const documentId =
                  documentMap[documentName];

                return (
                  <div
                    className="document-item"
                    key={`${documentName}-${index}`}
                  >

                    <div className="document-number">
                      {index + 1}
                    </div>

                    <div className="document-info">
                      <h3>{documentName}</h3>

                      {documentId ? (
                        <Link
                          to={`/documents/${documentId}`}
                          className="document-link"
                        >
                          View Document Information →
                        </Link>
                      ) : (
                        <span className="document-note">
                          Supporting document
                        </span>
                      )}
                    </div>

                  </div>
                );
              })}

            </div>

            <div className="checklist-note">
              <strong>Demo Information:</strong>

              <p>
                This checklist contains demonstration data.
                Actual document requirements may vary depending
                on the applicable scheme and authority.
              </p>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}

export default DocumentChecklist;