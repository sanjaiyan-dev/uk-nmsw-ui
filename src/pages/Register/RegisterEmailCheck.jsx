import { Link, useLocation } from 'react-router-dom';

const RegisterEmailCheck = () => {
  const { state } = useLocation();

  return (
    <>
      <h1 className="govuk-heading-xl">Check your email</h1>
      <p className="govuk-body">We have sent an email to  <strong className="govuk-label--s">{state?.emailAddress}</strong></p>
      <p className="govuk-body">Click the link in the email to continue your registration.</p>
      <p><Link className="govuk-body govuk-link" to="resend-email">Not received an email?</Link></p>

      {/* below is to make testing easier until other elements built */}
      <hr />
      <p>FOR TESTING <Link
        to={'/create-account/your-details'}
        state={
          {
            dataToSubmit: { emailAddress: state?.emailAddress }
          }
        }>SKIP TO YOUR DETAILS</Link></p>
    </>
  );
};

export default RegisterEmailCheck;
