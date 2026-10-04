import { Link } from "react-router-dom";
import { documents } from "../data/documents";
import "./Documents.css";

function Documents() {
  const categories = [
    "Identity",
    "Income",
    "Residence",
    "Bank",
    "Other"
  ];

  return (
    <div className="documents-page">

      {/* Header */}

      <section className="documents-header">

        <div className="container">

          <span className="documents-label">
            CITIZEN DOCUMENT CENTRE
          </span>

          <h1>
            Documents
          </h1>

          <p>
            Understand commonly required documents and explore
            sample documents for demonstration purposes.
          </p>

        </div>

      </section>


      {/* Notice */}

      <section className="documents-notice-section">

        <div className="container">

          <div className="documents-notice">

            <div className="notice-symbol">
              !
            </div>

            <div>

              <strong>
                Demonstration Documents
              </strong>

              <p>
                The documents shown in this portal are fictional
                samples created for demonstration. They are not
                valid government documents and must not be used
                for identification, verification or applications.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* Categories */}

      <section className="document-categories">

        <div className="container">

          <div className="section-heading">

            <span>
              DOCUMENT CATEGORIES
            </span>

            <h2>
              Browse Documents
            </h2>

            <p>
              Explore documents by category.
            </p>

          </div>


          <div className="document-category-grid">

            {categories.map((category) => {

              const document = documents.find(
                (item) => item.category === category
              );

              return (
                <Link
                  key={category}
                  to={`/documents/${document.id}`}
                  className="document-category-card"
                >

                  <div className="document-card-number">
                    {String(
                      categories.indexOf(category) + 1
                    ).padStart(2, "0")}
                  </div>

                  <h3>
                    {category}
                  </h3>

                  <p>
                    {document.shortDescription}
                  </p>

                  <span>
                    View Documents →
                  </span>

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

            <span>
              DEMONSTRATION
            </span>

            <h2>
              Mock Documents
            </h2>

            <p>
              Sample documents showing how citizen documents
              may be represented inside this demonstration portal.
            </p>

          </div>


          <div className="mock-document-grid">

            <Link
              to="/documents/mock/identity"
              className="mock-document-card"
            >
              <div className="mock-preview identity-preview">
                ID
              </div>

              <div>
                <span>
                  SAMPLE
                </span>

                <h3>
                  Identity Document
                </h3>

                <p>
                  Fictional identity document for demonstration.
                </p>
              </div>
            </Link>


            <Link
              to="/documents/mock/income"
              className="mock-document-card"
            >
              <div className="mock-preview income-preview">
                ₹
              </div>

              <div>
                <span>
                  SAMPLE
                </span>

                <h3>
                  Income Certificate
                </h3>

                <p>
                  Fictional income certificate for demonstration.
                </p>
              </div>
            </Link>


            <Link
              to="/documents/mock/residence"
              className="mock-document-card"
            >
              <div className="mock-preview residence-preview">
                R
              </div>

              <div>
                <span>
                  SAMPLE
                </span>

                <h3>
                  Residence Certificate
                </h3>

                <p>
                  Fictional residence certificate for demonstration.
                </p>
              </div>
            </Link>


            <Link
              to="/documents/mock/bank"
              className="mock-document-card"
            >
              <div className="mock-preview bank-preview">
                B
              </div>

              <div>
                <span>
                  SAMPLE
                </span>

                <h3>
                  Bank Document
                </h3>

                <p>
                  Fictional bank document for demonstration.
                </p>
              </div>
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Documents;