import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PASSSWORD_RESET_ENDPOINT, USER_HAS_NOT_BEEN_VERIFIED } from '../../constants/AppAPIConstants';
import {
  FIELD_EMAIL,
  SINGLE_PAGE_FORM,
  VALIDATE_EMAIL_ADDRESS,
  VALIDATE_REQUIRED,
} from '../../constants/AppConstants';
import {
  MESSAGE_URL,
  REQUEST_PASSWORD_RESET_CONFIRMATION_URL,
  REQUEST_PASSWORD_RESET_URL,
  RESEND_EMAIL_USER_NOT_VERIFIED,
} from '../../constants/AppUrlConstants';
import DisplayForm from '../../components/Forms/DisplayForm';

const SupportingText = () => (
  <div>
    <p className="govuk-body">We&apos;ll email you a link to reset your password.</p>
  </div>
);

const RequestPasswordReset = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  document.title = 'Forgot password';

  const formActions = {
    submit: {
      label: 'Send the link',
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
          message: 'Enter a real email address',
        },
        {
          type: VALIDATE_EMAIL_ADDRESS,
          message: 'Enter a real email address',
        },
      ],
    },
  ];

  const requestPasswordResetEmail = async ({ emailToSendTo }) => {
    try {
      const controller = new AbortController();
      const response = await axios.post(PASSSWORD_RESET_ENDPOINT, {
        email: emailToSendTo,
      }, {
        signal: controller.signal,
      });
      if (response.status === 204) {
        navigate(REQUEST_PASSWORD_RESET_CONFIRMATION_URL, { state: { dataToSubmit: { emailAddress: emailToSendTo } } });
      }
    } catch (err) {
      // This error indicates user registered email address but didn't activate account yet
      if (err.response?.data?.message === USER_HAS_NOT_BEEN_VERIFIED) {
        navigate(RESEND_EMAIL_USER_NOT_VERIFIED, {
          state: {
            emailAddress: emailToSendTo,
            redirectURL: REQUEST_PASSWORD_RESET_URL,
          },
        });
      } else if (err.response.status === 401) {
        // 401 is invalid email address but we don't message that to the user so we show them the same confirmation page
        navigate(REQUEST_PASSWORD_RESET_CONFIRMATION_URL, { state: { dataToSubmit: { emailAddress: emailToSendTo } } });
      } else {
        navigate(MESSAGE_URL, { state: { title: 'Something has gone wrong', message: err.response?.data?.message, redirectURL: REQUEST_PASSWORD_RESET_URL } });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    requestPasswordResetEmail({ emailToSendTo: formData.formData.emailAddress });
  };

  return (
    <DisplayForm
      formId="requestPasswordResetEmail"
      fields={formFields}
      formActions={formActions}
      formType={SINGLE_PAGE_FORM}
      isLoading={isLoading}
      pageHeading={state?.resetPasswordTitle || 'Forgot password'}
      handleSubmit={handleSubmit}
    >
      <SupportingText />
    </DisplayForm>
  );
};

export default RequestPasswordReset;
