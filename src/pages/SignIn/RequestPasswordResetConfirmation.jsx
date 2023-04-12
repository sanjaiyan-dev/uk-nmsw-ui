import { useLocation } from 'react-router-dom';

const RequestPasswordResetConfirmation = () => {
  const { state } = useLocation();
  document.title = 'Check your email';

  return (
    <>
      <h1 className="govuk-heading-xl">Check your email</h1>
      <p className="govuk-body">We have sent an email to  <strong className="govuk-label--s">{state?.dataToSubmit.emailAddress}</strong></p>
      <p className="govuk-body">Click the link in the email to reset your password.</p>
      <p>
        {/* <Link
          className="govuk-body govuk-link"
          to={RESEND_URL}
          state={{ dataToSubmit: { emailAddress: state?.dataToSubmit.emailAddress } }}
        >
          Not received an email?
        </Link> */}
      </p>
    </>
  );
};

export default RequestPasswordResetConfirmation;
