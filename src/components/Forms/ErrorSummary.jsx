import PropTypes from 'prop-types';

const ErrorSummary = ({ errors, errorSummaryRef, scrollToErrorField }) => (
  <div className="govuk-grid-row">
    <div className="govuk-grid-column-two-thirds">
      {errors?.length > 0 && (
        <div
          className="govuk-error-summary"
          aria-labelledby="error-summary-title"
          role="alert"
          data-module="govuk-error-summary"
          ref={errorSummaryRef}
          tabIndex={-1}
        >
          <h2 className="govuk-error-summary__title" id="error-summary-title">
            There is a problem
          </h2>
          <div className="govuk-error-summary__body">
            <ul className="govuk-list govuk-error-summary__list">
              {errors.map((error) => (
                <li key={error.name}>
                  <button
                    className="govuk-button--text"
                    type="button"
                    onClick={(e) => {
                      scrollToErrorField(e, error);
                    }}
                  >
                    {error.message}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default ErrorSummary;

ErrorSummary.propTypes = {
  errors: PropTypes.array.isRequired,
  errorSummaryRef: PropTypes.object.isRequired,
  scrollToErrorField: PropTypes.func.isRequired,
};
