import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  REGISTER_RESEND_VERIFICATION_EMAIL_ENDPOINT,
  USER_ALREADY_VERIFIED,
  USER_NOT_REGISTERED,
} from '../../constants/AppAPIConstants';
import {
  DISPLAY_DETAILS,
  FIELD_EMAIL,
  SINGLE_PAGE_FORM,
  VALIDATE_EMAIL_ADDRESS,
  VALIDATE_REQUIRED,
} from '../../constants/AppConstants';
import {
  ERROR_ACCOUNT_ALREADY_ACTIVE_URL,
  MESSAGE_URL,
  REGISTER_EMAIL_URL,
  REGISTER_EMAIL_CHECK_URL,
} from '../../constants/AppUrlConstants';
import DisplayForm from '../../components/DisplayForm';

const SupportingText = () => (
  <p className="govuk-body">Emails sometimes take a few minutes to arrive. If you didn&apos;t receive the link, you can request a new one.</p>
);

const RegisterEmailResend = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  document.title = 'Resend verification email';

  const formActions = {
    submit: {
      className: 'govuk-button',
      dataModule: 'govuk-button',
      dataTestid: 'submit-button',
      label: 'Send confirmation email',
      type: 'button',
    },
  };
  const formFields = [
    {
      type: FIELD_EMAIL,
      displayType: DISPLAY_DETAILS,
      fieldName: 'emailAddress',
      label: 'Email address',
      value: state?.dataToSubmit?.emailAddress,
      linkText: 'Change where the email was sent',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter your email address',
        },
        {
          type: VALIDATE_EMAIL_ADDRESS,
          message: 'Enter an email address in the correct format, like name@example.com',
        },
      ],
    },
  ];

  const handleSubmit = async (formData) => {
    try {
      const controller = new AbortController();
      const response = await axios.post(REGISTER_RESEND_VERIFICATION_EMAIL_ENDPOINT, {
        email: formData.formData.emailAddress,
      }, {
        signal: controller.signal,
      });

      if (response.status === 204) {
        navigate(REGISTER_EMAIL_CHECK_URL, { state: { dataToSubmit: { emailAddress: formData.formData.emailAddress } } });
      }
    } catch (err) {
      if (err?.response?.data?.message === USER_ALREADY_VERIFIED) {
        navigate(ERROR_ACCOUNT_ALREADY_ACTIVE_URL, { state: { dataToSubmit: { emailAddress: formData.formData.emailAddress } } });
      } else if (err?.response?.data?.message === USER_NOT_REGISTERED) {
        console.log('not registered we need to POST to register user');
      } else {
        // 500 errors will fall into this bucket
        navigate(MESSAGE_URL, { state: { title: 'Something has gone wrong', message: err.response?.data?.message, redirectURL: REGISTER_EMAIL_URL } });
      }
    }
  };

  return (
    <DisplayForm
      formId="formSecondPage"
      fields={formFields}
      formActions={formActions}
      formType={SINGLE_PAGE_FORM}
      pageHeading="Request a new verification link"
      handleSubmit={handleSubmit}
    >
      <SupportingText />
    </DisplayForm>
  );
};

export default RegisterEmailResend;
