import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./SchemeFinder.css";

import { getSchemes } from "../api";

function SchemeFinder() {
  const [schemes, setSchemes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    getSchemes({
      q: searchTerm,
      category: category,
    })
      .then((data) => {
        setSchemes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load schemes from the server.");
        setLoading(false);
      });
  }, [searchTerm, category]);

  if (loading) {
    return (
      <section className="page-section">
        <div className="container">
          <div className="page-heading">
            <span className="section-label">Citizen Services</span>

            <h1>Scheme Finder</h1>

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

            <h1>Scheme Finder</h1>

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
          <span className="section-label">
            Citizen Services
          </span>

          <h1>Scheme Finder</h1>

          <p>
            Search and explore schemes available in this
            demonstration portal.
          </p>
        </div>

        <div className="finder-controls">

          <input
            type="text"
            placeholder="Search schemes..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />

          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
          >
            <option value="All">
              All Categories
            </option>

            <option value="Health">
              Health
            </option>

            <option value="Pension">
              Pension
            </option>
          </select>

        </div>

        {schemes.length === 0 ? (
          <div className="empty-state">
            <h2>No schemes found</h2>

            <p>
              Try changing your search term or selecting
              another category.
            </p>
          </div>
        ) : (
          <div className="scheme-grid">

            {schemes.map((scheme) => (
              <article
                className="scheme-card"
                key={scheme.id}
              >

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
        )}

      </div>
    </section>
  );
}

export default SchemeFinder;