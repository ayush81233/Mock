import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Schemes.css";
import { getSchemes } from "../api";

function Schemes() {
  const [schemes, setSchemes] = useState([]);
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

  if (loading) {
    return (
      <section className="page-section">
        <div className="container">
          <div className="page-heading">
            <span className="section-label">Government Schemes</span>
            <h1>Available Schemes</h1>
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
            <span className="section-label">Government Schemes</span>
            <h1>Available Schemes</h1>
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
          <span className="section-label">Government Schemes</span>
          <h1>Available Schemes</h1>
          <p>
            Explore healthcare and pension-related schemes available
            through this demonstration portal.
          </p>
        </div>

        <div className="scheme-grid">
          {schemes.map((scheme) => (
            <article className="scheme-card" key={scheme.id}>

              <span className="scheme-category">
                {scheme.category}
              </span>

              <h2>{scheme.title}</h2>

              <p>{scheme.short_description}</p>

              <Link
                to={`/schemes/${scheme.id}`}
                className="scheme-button"
              >
                View Details
              </Link>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Schemes;