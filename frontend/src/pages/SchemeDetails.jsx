import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./SchemeDetails.css";

import { getScheme } from "../api";

function SchemeDetails() {
  const { id } = useParams();

  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getScheme(id)
      .then((data) => {
        setScheme(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load the scheme details.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <section className="page-section">
        <div className="container">
          <p>Loading scheme details...</p>
        </div>
      </section>
    );
  }

  if (error || !scheme) {
    return (
      <section className="page-section">
        <div className="container">
          <h1>Scheme Not Found</h1>
          <p>{error}</p>

          <Link to="/schemes" className="back-link">
            ← Back to Schemes
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page-section">
      <div className="container">

        <Link to="/schemes" className="back-link">
          ← Back to Schemes
        </Link>

        <div className="scheme-detail-header">

          <span className="scheme-category">
            {scheme.category}
          </span>

          <h1>{scheme.title}</h1>

          <p>{scheme.short_description}</p>

        </div>

        <div className="scheme-detail-content">

          <section>
            <h2>About the Scheme</h2>
            <p>{scheme.description}</p>
          </section>

          <section>
            <h2>Eligibility</h2>

            <ul>
              {scheme.eligibility.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2>Benefits</h2>

            <ul>
              {scheme.benefits.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2>Required Documents</h2>

            <ul>
              {scheme.documents.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2>Application Process</h2>

            <ol>
              {scheme.application_process.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ol>
          </section>

        </div>

      </div>
    </section>
  );
}

export default SchemeDetails;