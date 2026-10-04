import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { documents } from "../data/documents";
import "./Search.css";

import { getSchemes } from "../api";

const services = [
  {
    id: "scheme-finder",
    title: "Scheme Finder",
    description:
      "Search and explore government schemes based on category and keywords.",
    path: "/citizen-services/scheme-finder",
    type: "service",
  },
  {
    id: "eligibility-checker",
    title: "Eligibility Checker",
    description:
      "Check potential scheme matches using basic applicant information.",
    path: "/citizen-services/eligibility",
    type: "service",
  },
  {
    id: "document-checklist",
    title: "Document Checklist",
    description:
      "View the documents associated with a selected scheme.",
    path: "/citizen-services/documents",
    type: "service",
  },
];

function Search() {
  const [schemes, setSchemes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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
      setError("Unable to load search data from the server.");
      setLoading(false);
    });
}, []);

  const query = searchTerm.trim().toLowerCase();

  const schemeResults = schemes.filter((scheme) => {
    if (!query) return false;

    const searchableText = [
      scheme.title,
      scheme.category,
      scheme.short_description,
      scheme.description,
      ...(scheme.eligibility || []),
      ...(scheme.benefits || []),
      ...(scheme.documents || []),
      ...(scheme.application_process || []),
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(query);
  });

  const documentResults = documents.filter((document) => {
    if (!query) return false;

    const searchableText = [
      document.title,
      document.category,
      document.shortDescription,
      ...(document.examples || []),
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(query);
  });

  const serviceResults = services.filter((service) => {
    if (!query) return false;

    const searchableText = [
      service.title,
      service.description,
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(query);
  });

  const totalResults =
    schemeResults.length +
    documentResults.length +
    serviceResults.length;

  return (
    <section className="page-section">
      <div className="container">

        <div className="page-heading">
          <span className="section-label">
            Portal Search
          </span>

          <h1>Search</h1>

          <p>
            Search schemes, documents and citizen services
            available on this demonstration portal.
          </p>
        </div>

        <div className="search-box-wrapper">

          <input
            type="text"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder="Search schemes, documents or services..."
            className="search-input"
          />

        </div>

        {loading && (
          <div className="search-message">
            Loading search data...
          </div>
        )}

        {error && (
          <div className="search-message error-message">
            {error}
          </div>
        )}

        {!loading && !error && query === "" && (
          <div className="search-message">
            Enter a keyword to search the portal.
          </div>
        )}

        {!loading &&
          !error &&
          query !== "" &&
          totalResults === 0 && (
            <div className="search-message">
              <h2>No results found</h2>

              <p>
                Try another keyword such as
                "health", "pension", "income", or
                "documents".
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          query !== "" &&
          totalResults > 0 && (
            <div className="search-results">

              <p className="result-count">
                {totalResults} result
                {totalResults !== 1 ? "s" : ""} found
              </p>

              {schemeResults.length > 0 && (
                <section className="search-result-section">

                  <h2>Schemes</h2>

                  <div className="search-result-grid">

                    {schemeResults.map((scheme) => (
                      <article
                        className="search-result-card"
                        key={scheme.id}
                      >

                        <span className="scheme-category">
                          {scheme.category}
                        </span>

                        <h3>{scheme.title}</h3>

                        <p>
                          {scheme.short_description}
                        </p>

                        <Link
                          to={`/schemes/${scheme.id}`}
                          className="search-result-link"
                        >
                          View Scheme →
                        </Link>

                      </article>
                    ))}

                  </div>

                </section>
              )}

              {documentResults.length > 0 && (
                <section className="search-result-section">

                  <h2>Documents</h2>

                  <div className="search-result-grid">

                    {documentResults.map((document) => (
                      <article
                        className="search-result-card"
                        key={document.id}
                      >

                        <span className="scheme-category">
                          {document.category}
                        </span>

                        <h3>{document.title}</h3>

                        <p>
                          {document.shortDescription}
                        </p>

                        <Link
                          to={`/documents/${document.id}`}
                          className="search-result-link"
                        >
                          View Document →
                        </Link>

                      </article>
                    ))}

                  </div>

                </section>
              )}

              {serviceResults.length > 0 && (
                <section className="search-result-section">

                  <h2>Citizen Services</h2>

                  <div className="search-result-grid">

                    {serviceResults.map((service) => (
                      <article
                        className="search-result-card"
                        key={service.id}
                      >

                        <h3>{service.title}</h3>

                        <p>
                          {service.description}
                        </p>

                        <Link
                          to={service.path}
                          className="search-result-link"
                        >
                          Open Service →
                        </Link>

                      </article>
                    ))}

                  </div>

                </section>
              )}

            </div>
          )}

      </div>
    </section>
  );
}

export default Search;