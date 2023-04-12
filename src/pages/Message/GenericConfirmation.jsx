import { Link, useLocation } from 'react-router-dom';
import { SERVICE_NAME } from '../../constants/AppConstants';

const GenericConfirmation = () => {
  const { state } = useLocation();
  document.title = `${state.pageTitle}` || SERVICE_NAME;

  if (!state || Object.entries(state).length < 1) {
    return (
      <div className="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" data-module="govuk-error-summary">
        <h2 className="govuk-error-summary__title" id="error-summary-title">
          There is a problem
        </h2>
        <div className="govuk-error-summary__body">
          <p>Something went wrong, please try again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <div className="govuk-panel govuk-panel--confirmation">
          <h1 className="govuk-panel__title govuk-!-margin-bottom-6">
            {`${state.confirmationMessage}`}
          </h1>

        </div>
        <Link
          className="govuk-link"
          to={state.nextPageLink}
        >
          Return to {state.nextPageName}
        </Link>
      </div>
    </div>
  );
};

export default GenericConfirmation;
