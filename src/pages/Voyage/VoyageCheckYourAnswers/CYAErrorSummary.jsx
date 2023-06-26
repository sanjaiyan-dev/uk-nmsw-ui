import PropTypes from 'prop-types';
import { scrollToElementId } from '../../../utils/ScrollToElement';

const CYAErrorSummary = ({ errors, errorSummaryRef, elementId }) => (
  <div className="govuk-grid-column-two-thirds">
    {errors?.length > 0 && (
    <div className="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" data-module="govuk-error-summary" ref={errorSummaryRef} tabIndex={-1}>
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
                onClick={(e) => { e.preventDefault(); scrollToElementId(elementId); }}
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
);

export default CYAErrorSummary;

CYAErrorSummary.propTypes = {
  errors: PropTypes.array,
  errorSummaryRef: PropTypes.object,
  elementId: PropTypes.string,
};
