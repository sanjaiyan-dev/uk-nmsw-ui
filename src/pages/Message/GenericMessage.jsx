import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SERVICE_NAME } from '../../constants/AppConstants';
import { LANDING_URL } from '../../constants/AppUrlConstants';

const GenericMessage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  document.title = state?.title || SERVICE_NAME;
  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <h1 className="govuk-heading-xl">{state?.title}</h1>
        {state?.message && <p className="govuk-body">{state?.message}</p>}
        {state?.button && (
          <button
            className="govuk-button"
            data-module="govuk-button"
            type="button"
            onClick={() => { navigate(state?.button.buttonNavigateTo, state?.button.buttonState); }}
          >
            {state?.button.buttonLabel}
          </button>
        )}
        {!state.button && (
          <Link to={state?.redirectURL || LANDING_URL} state={state}>
            {state?.linkText || 'Click here to continue'}
          </Link>
        )}
      </div>
    </div>
  );
};

export default GenericMessage;
