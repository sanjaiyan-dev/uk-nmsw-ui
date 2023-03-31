import { Link, useLocation } from 'react-router-dom';
import { SIGN_IN_URL } from '../../constants/AppUrlConstants';

const RegisterConfirmation = () => {
  const { state } = useLocation();
  document.title = 'Account created';

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-three-quarters">
        <div className="govuk-panel govuk-panel--confirmation">
          <h1 className="govuk-panel__title">
            Account created
          </h1>
          {state?.companyName && state?.fullName
            && (
              <div className="govuk-panel__body">
                {state?.fullName && state?.companyName
                  && (
                  <>
                    <div className="govuk-!-margin-bottom-4">{`For ${state?.fullName}`}</div>
                    <div>{`Now a team member at ${state.companyName}`}</div>
                  </>
                  )}
              </div>
            )}
        </div>
        {state?.email && <p className="govuk-body">We have sent a confirmation email to <strong>{state?.email}</strong>.</p>}

        <p className="govuk-body">
          <Link className="govuk-link" to={SIGN_IN_URL}>Sign in</Link> to start using this service.
        </p>
      </div>
    </div>
  );
};

export default RegisterConfirmation;
