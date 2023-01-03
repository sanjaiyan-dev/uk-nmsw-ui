import { Link, useLocation } from 'react-router-dom';
import { SIGN_IN_URL } from '../../constants/AppUrlConstants';

const AccountAlreadyActive = () => {
  const { state } = useLocation();
  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h1 className="govuk-heading-xl">You already have an account</h1>
          <div className="govuk-inset-text">
            <p className='govuk-body' data-testid='insetText'>Your email address {state?.dataToSubmit?.emailAddress && <strong>{state.dataToSubmit.emailAddress}</strong>} is already registered with this service.</p>
          </div>
          <Link
            to={SIGN_IN_URL}
            role="button"
            draggable="false"
            className="govuk-button govuk-button--primary"
            data-module="govuk-button"
          >
            Sign in
          </Link>
        </div>
      </div>
    </>
  );
};

export default AccountAlreadyActive;
