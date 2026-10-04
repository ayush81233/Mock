import { Link, useParams } from "react-router-dom";
import { documents } from "../data/documents";
import "./DocumentDetails.css";

function DocumentDetails() {
  const { id } = useParams();

  const document = documents.find(
    (item) => item.id === id
  );

  if (!document) {
    return (
      <div className="container document-not-found">

        <h1>
          Document Not Found
        </h1>

        <p>
          The requested document information could not be found.
        </p>

        <Link to="/documents">
          ← Back to Document Centre
        </Link>

      </div>
    );
  }

  return (
    <div className="document-details-page">

      <section className="document-details-header">

        <div className="container">

          <Link
            to="/documents"
            className="back-link"
          >
            ← Back to Document Centre
          </Link>

          <span>
            {document.category}
          </span>

          <h1>
            {document.title}
          </h1>

          <p>
            {document.shortDescription}
          </p>

        </div>

      </section>


      <section className="document-details-content">

        <div className="container document-details-layout">

          <main>

            <section className="document-info-card">

              <h2>
                What is this document?
              </h2>

              <p>
                {document.shortDescription}
              </p>

            </section>


            <section className="document-info-card">

              <h2>
                Common Examples
              </h2>

              <ul>

                {document.examples.map(
                  (example, index) => (
                    <li key={index}>
                      {example}
                    </li>
                  )
                )}

              </ul>

            </section>


            <section className="document-info-card">

              <h2>
                Before submitting
              </h2>

              <ul>

                <li>
                  Ensure the information is accurate.
                </li>

                <li>
                  Check whether the document is currently valid.
                </li>

                <li>
                  Keep a copy for your records.
                </li>

                <li>
                  Follow the requirements of the specific scheme
                  or service.
                </li>

              </ul>

            </section>

          </main>


          <aside>

            <div className="document-side-card">

              <span>
                DOCUMENT CATEGORY
              </span>

              <h3>
                {document.category}
              </h3>

              <p>
                Requirements can vary depending on the scheme,
                service and applicable authority.
              </p>

            </div>


            <div className="document-side-warning">

              <strong>
                Demo Notice
              </strong>

              <p>
                This portal does not issue or validate real
                government documents.
              </p>

            </div>

          </aside>

        </div>

      </section>

    </div>
  );
}

export default DocumentDetails;