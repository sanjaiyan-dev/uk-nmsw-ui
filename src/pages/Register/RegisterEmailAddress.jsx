import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  REGISTER_ACCOUNT_ENDPOINT,
  REGISTER_RESEND_VERIFICATION_EMAIL_ENDPOINT,
  USER_ALREADY_REGISTERED,
  USER_ALREADY_VERIFIED,
  USER_AWAITING_VERIFICATION,
} from '../../constants/AppAPIConstants';
import {
  FIELD_EMAIL,
  SINGLE_PAGE_FORM,
  VALIDATE_EMAIL_ADDRESS,
  VALIDATE_FIELD_MATCH,
  VALIDATE_REQUIRED,
} from '../../constants/AppConstants';
import {
  MESSAGE_URL,
  ERROR_ACCOUNT_ALREADY_ACTIVE_URL,
  REGISTER_EMAIL_URL,
  REGISTER_EMAIL_CHECK_URL,
} from '../../constants/AppUrlConstants';
import DisplayForm from '../../components/DisplayForm';
import Auth from '../../utils/Auth';

const SupportingText = () => (
  <div className="govuk-inset-text">
    <p className="govuk-body">This will only be used if you need to recover your sign in details.</p>
    <p className="govuk-body">To confirm it is your email address we will send you a verification link.</p>
  </div>
);

const RegisterEmailAddress = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  document.title = 'What is your email address';

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
      fieldName: 'emailAddress',
      label: 'Email address',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter an email address in the correct format, like name@example.com',
        },
        {
          type: VALIDATE_EMAIL_ADDRESS,
          message: 'Enter an email address in the correct format, like name@example.com',
        },
      ],
    },
    {
      type: FIELD_EMAIL,
      fieldName: 'repeatEmailAddress',
      label: 'Confirm email address',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Confirm your email address',
        },
        {
          type: VALIDATE_FIELD_MATCH,
          message: 'Your email addresses must match',
          condition: 'emailAddress',
        },
      ],
    },
  ];

  const resendVerificationEmail = async (emailToSendTo) => {
    try {
      const controller = new AbortController();
      const response = await axios.post(REGISTER_RESEND_VERIFICATION_EMAIL_ENDPOINT, {
        email: emailToSendTo,
      }, {
        signal: controller.signal,
      });

      if (response.status === 204) {
        navigate(REGISTER_EMAIL_CHECK_URL, { state: { dataToSubmit: { emailAddress: emailToSendTo } } });
      }
    } catch (err) {
      if (err?.response?.data?.message === USER_ALREADY_VERIFIED) {
        // Edgecase where somehow user activates their account while we're processing a resend verification email
        navigate(ERROR_ACCOUNT_ALREADY_ACTIVE_URL, { state: { dataToSubmit: { emailAddress: emailToSendTo } } });
      } else {
        // USER_NOT_REGISTERED & 500 errors will fall into this bucket (error out on USER_NOT_REGISTERED as it shouldn't occur here and we don't want to cause a loop of register/resend running)
        navigate(MESSAGE_URL, { state: { title: 'Something has gone wrong', message: err.response?.data?.message, redirectURL: REGISTER_EMAIL_URL } });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    const dataToSubmit = {
      email: formData.formData.emailAddress,
    };

    try {
      const response = await axios.post(REGISTER_ACCOUNT_ENDPOINT, dataToSubmit, {
        headers: { Authorization: `Bearer ${Auth.retrieveToken()}` },
      });
      navigate(REGISTER_EMAIL_CHECK_URL, { state: { dataToSubmit: { emailAddress: response.data.email } } });
      setIsLoading(false);
    } catch (err) {
      if (err.response?.data?.message === USER_ALREADY_REGISTERED) {
        navigate(ERROR_ACCOUNT_ALREADY_ACTIVE_URL, { state: { dataToSubmit: { emailAddress: formData.formData.emailAddress } } });
        setIsLoading(false);
      } else if (err.response?.data?.message === USER_AWAITING_VERIFICATION) {
        resendVerificationEmail(formData.formData.emailAddress);
      } else {
        // 500 errors will fall into this bucket
        navigate(MESSAGE_URL, { state: { title: 'Something has gone wrong', message: err.response?.data?.message, redirectURL: REGISTER_EMAIL_URL } });
        setIsLoading(false);
      }
    }
  };

  return (
    <DisplayForm
      formId="formRegisterEmailAddress"
      fields={formFields}
      formActions={formActions}
      formType={SINGLE_PAGE_FORM}
      pageHeading="What is your email address"
      handleSubmit={handleSubmit}
      isLoading={isLoading}
    >
      <SupportingText />
    </DisplayForm>
  );
};

export default RegisterEmailAddress;
