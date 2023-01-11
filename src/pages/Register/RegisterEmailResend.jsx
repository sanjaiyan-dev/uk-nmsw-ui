import { useLocation } from 'react-router-dom';

export const RegisterEmailResend = () => {
  const { state } = useLocation();
  document.title = 'Resend verification email';

  return (
    <>
      <h1 className="govuk-heading-xl">Resend page</h1>
      <strong className="govuk-label--s">{state?.dataToSubmit.emailAddress}</strong>
    </>
  );
};

export default RegisterEmailResend;
