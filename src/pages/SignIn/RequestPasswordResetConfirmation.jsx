import { Link, useLocation } from 'react-router-dom';
import { REQUEST_PASSWORD_RESET_RESEND_URL } from '../../constants/AppUrlConstants';

const RequestPasswordResetConfirmation = () => {
  const { state } = useLocation();
  document.title = 'Check your email';

  return (
    <>
      <h1 className="govuk-heading-xl">Check your email</h1>
      <p className="govuk-body">If <strong className="govuk-label--s">{state?.dataToSubmit.emailAddress}</strong> is registered on this service, we have sent a password reset link.</p>
      <p>
        <Link
          className="govuk-body govuk-link"
          to={REQUEST_PASSWORD_RESET_RESEND_URL}
          state={{ dataToSubmit: { emailAddress: state?.dataToSubmit.emailAddress } }}
        >
          Not received an email?
        </Link>
      </p>
    </>
  );
};

export default RequestPasswordResetConfirmation;
