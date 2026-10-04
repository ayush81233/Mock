import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./EligibilityChecker.css";
import { getSchemes } from "../api";

function EligibilityChecker() {
  const [schemes, setSchemes] = useState([]);

  const [age, setAge] = useState("");
  const [income, setIncome] = useState("");
  const [category, setCategory] = useState("");

  const [results, setResults] = useState([]);
  const [checked, setChecked] = useState(false);

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

  const checkEligibility = (scheme) => {
    const rules = scheme.eligibility_rules || {};

    const applicantAge = Number(age);
    const applicantIncome = Number(income);

    if (
      rules.min_age !== undefined &&
      applicantAge < rules.min_age
    ) {
      return false;
    }

    if (
      rules.max_age !== undefined &&
      applicantAge > rules.max_age
    ) {
      return false;
    }

    if (
      rules.min_income !== undefined &&
      applicantIncome < rules.min_income
    ) {
      return false;
    }

    if (
      rules.max_income !== undefined &&
      applicantIncome > rules.max_income
    ) {
      return false;
    }

    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const eligibleSchemes = schemes.filter((scheme) =>
      checkEligibility(scheme)
    );

    setResults(eligibleSchemes);
    setChecked(true);
  };

  if (loading) {
    return (
      <section className="page-section">
        <div className="container">
          <div className="page-heading">
            <span className="section-label">
              Citizen Services
            </span>

            <h1>Eligibility Checker</h1>

            <p>Loading scheme information...</p>
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
            <span className="section-label">
              Citizen Services
            </span>

            <h1>Eligibility Checker</h1>

            <p className="error-message">
              {error}
            </p>
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

          <h1>Eligibility Checker</h1>

          <p>
            Enter basic information to find schemes that
            may match the demonstration eligibility rules.
          </p>
        </div>

        <div className="eligibility-layout">

          <form
            className="eligibility-form"
            onSubmit={handleSubmit}
          >

            <div className="form-group">
              <label htmlFor="age">
                Age
              </label>

              <input
                id="age"
                type="number"
                min="0"
                value={age}
                onChange={(event) =>
                  setAge(event.target.value)
                }
                placeholder="Enter your age"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="income">
                Annual Household Income
              </label>

              <input
                id="income"
                type="number"
                min="0"
                value={income}
                onChange={(event) =>
                  setIncome(event.target.value)
                }
                placeholder="Enter annual income"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">
                Category
              </label>

              <select
                id="category"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                required
              >
                <option value="">
                  Select category
                </option>

                <option value="General">
                  General
                </option>

                <option value="OBC">
                  OBC
                </option>

                <option value="SC">
                  SC
                </option>

                <option value="ST">
                  ST
                </option>
              </select>
            </div>

            <button
              type="submit"
              className="primary-button"
            >
              Check Eligibility
            </button>

            <p className="demo-note">
              This is a demonstration eligibility checker.
              Results do not establish actual eligibility
              for any government scheme.
            </p>

          </form>

          <div className="eligibility-results">

            {!checked ? (
              <div className="results-placeholder">
                <h2>Check Your Eligibility</h2>

                <p>
                  Enter your details and select
                  "Check Eligibility" to see potential
                  scheme matches.
                </p>
              </div>
            ) : results.length === 0 ? (
              <div className="results-placeholder">
                <h2>No Potential Matches</h2>

                <p>
                  No schemes matched the demonstration
                  rules for the information provided.
                </p>
              </div>
            ) : (
              <>
                <h2>Potential Matches</h2>

                <p className="results-intro">
                  The following schemes matched the
                  demonstration rules:
                </p>

                <div className="eligibility-results-list">

                  {results.map((scheme) => (
                    <article
                      className="eligibility-result-card"
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
                        className="scheme-button"
                      >
                        View Scheme Details
                      </Link>

                    </article>
                  ))}

                </div>
              </>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}

export default EligibilityChecker;