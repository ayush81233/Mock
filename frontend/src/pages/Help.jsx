import { useState } from "react";
import { Link } from "react-router-dom";
import "./Help.css";

const faqs = [
  {
    question: "What can I do on this portal?",
    answer:
      "This demonstration portal allows users to explore sample government schemes, check sample eligibility conditions, view document information and use citizen service tools."
  },
  {
    question: "How do I find a scheme?",
    answer:
      "Open Scheme Finder from Citizen Services. You can filter schemes by category or search using keywords."
  },
  {
    question: "Does the Eligibility Checker provide an official decision?",
    answer:
      "No. The Eligibility Checker uses demonstration rules and sample data. It does not provide an official government eligibility decision."
  },
  {
    question: "Where can I see required documents?",
    answer:
      "You can use the Document Checklist under Citizen Services or open the Document Centre to view information about commonly used document types."
  },
  {
    question: "Are the documents shown on this portal real?",
    answer:
      "No. Any documents shown in the demonstration are fictional mock documents and are clearly marked as samples."
  },
  {
    question: "Can I submit an application through this portal?",
    answer:
      "No. This version of the portal is a demonstration and does not submit applications to government systems."
  },
  {
    question: "Which languages are supported?",
    answer:
      "The portal interface is designed with support for English, Hindi and Kannada. Language switching can be expanded as the project develops."
  },
];

function Help() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="help-page">

      <section className="help-header">
        <div className="container">

          <span className="page-kicker">
            Help & Support
          </span>

          <h1>Help & Support</h1>

          <p>
            Find answers to common questions about using this
            demonstration portal.
          </p>

        </div>
      </section>


      <section className="help-section">
        <div className="container">

          <div className="help-grid">

            <div className="help-main">

              <div className="section-heading">
                <h2>Frequently Asked Questions</h2>

                <p>
                  Common questions about schemes, documents and
                  citizen services.
                </p>
              </div>


              <div className="faq-list">

                {faqs.map((faq, index) => (

                  <div
                    className={`faq-item ${
                      openIndex === index ? "open" : ""
                    }`}
                    key={index}
                  >

                    <button
                      type="button"
                      className="faq-question"
                      onClick={() => toggleFaq(index)}
                      aria-expanded={openIndex === index}
                    >

                      <span>{faq.question}</span>

                      <span className="faq-icon">
                        {openIndex === index ? "−" : "+"}
                      </span>

                    </button>


                    {openIndex === index && (
                      <div className="faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    )}

                  </div>

                ))}

              </div>

            </div>


            <aside className="help-sidebar">

              <div className="help-card">

                <h2>Quick Help</h2>

                <Link to="/schemes">
                  Explore Schemes
                </Link>

                <Link to="/documents">
                  Document Centre
                </Link>

                <Link to="/citizen-services/scheme-finder">
                  Scheme Finder
                </Link>

                <Link to="/citizen-services/eligibility">
                  Eligibility Checker
                </Link>

                <Link to="/citizen-services/documents">
                  Document Checklist
                </Link>

              </div>


              <div className="help-card">

                <h2>Need Assistance?</h2>

                <p>
                  For this demonstration, use the Contact page to
                  view the sample support information.
                </p>

                <Link to="/contact" className="help-button">
                  Contact
                </Link>

              </div>

            </aside>

          </div>

        </div>
      </section>

    </div>
  );
}

export default Help;