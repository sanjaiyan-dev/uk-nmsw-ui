import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  PASSSWORD_RESET_ENDPOINT,
} from '../../constants/AppAPIConstants';
import {
  DISPLAY_DETAILS,
  FIELD_EMAIL,
  SINGLE_PAGE_FORM,
  VALIDATE_EMAIL_ADDRESS,
  VALIDATE_REQUIRED,
} from '../../constants/AppConstants';
import {
  MESSAGE_URL,
  REQUEST_PASSWORD_RESET_CONFIRMATION_URL,
  REQUEST_PASSWORD_RESET_URL,
} from '../../constants/AppUrlConstants';
import DisplayForm from '../../components/Forms/DisplayForm';

const SupportingText = () => (
  <p className="govuk-body">Emails sometimes take a few minutes to arrive. If you did not receive the link, you can request a new one.</p>
);

const ResendRequestPasswordReset = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  document.title = 'Resend password reset email';

  const formActions = {
    submit: {
      label: 'Request a new link',
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
      if (err.response.status === 401) {
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
      formId="formSecondPage"
      fields={formFields}
      formActions={formActions}
      formType={SINGLE_PAGE_FORM}
      isLoading={isLoading}
      pageHeading="Request a new verification link"
      handleSubmit={handleSubmit}
    >
      <SupportingText />
    </DisplayForm>
  );
};

export default ResendRequestPasswordReset;
