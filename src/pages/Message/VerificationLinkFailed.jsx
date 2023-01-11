import { useNavigate } from 'react-router-dom';
import { REGISTER_EMAIL_RESEND_URL } from '../../constants/AppUrlConstants';

const VerificationLinkFailed = () => {
  const navigate = useNavigate();
  document.title = 'Try again';

  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h1 className="govuk-heading-xl">Try again</h1>
          <p className='govuk-body'>The verification link did not work. Resend the email to try again.</p>
          <button
            className="govuk-button"
            data-module="govuk-button"
            type="button"
            onClick={() => {
              navigate(REGISTER_EMAIL_RESEND_URL);
            }}
          >
            Resend confirmation email
          </button>
        </div>
      </div>
    </>
  );
};

export default VerificationLinkFailed;
