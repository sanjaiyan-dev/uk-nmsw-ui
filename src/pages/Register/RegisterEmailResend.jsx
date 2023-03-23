import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  REGISTER_ACCOUNT_ENDPOINT,
  REGISTER_RESEND_VERIFICATION_EMAIL_ENDPOINT,
  USER_ALREADY_REGISTERED,
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
  <p className="govuk-body">Emails sometimes take a few minutes to arrive. If you did not receive the link, you can request a new one.</p>
);

const RegisterEmailResend = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  document.title = 'Resend verification email';

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
      linkText: 'Change the contact email address you want to use',
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

  const registerNewEmail = async (newEmailAddress) => {
    try {
      await axios.post(REGISTER_ACCOUNT_ENDPOINT, {
        email: newEmailAddress,
      });
      navigate(REGISTER_EMAIL_CHECK_URL, { state: { dataToSubmit: { emailAddress: newEmailAddress } } });
    } catch (err) {
      if (err.response?.data?.message === USER_ALREADY_REGISTERED) {
        navigate(ERROR_ACCOUNT_ALREADY_ACTIVE_URL, { state: { dataToSubmit: { emailAddress: newEmailAddress } } });
      } else {
        // 500 errors will fall into this bucket
        navigate(MESSAGE_URL, { state: { title: 'Something has gone wrong', message: err.response?.data?.message, redirectURL: REGISTER_EMAIL_URL } });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const controller = new AbortController();
      const response = await axios.post(REGISTER_RESEND_VERIFICATION_EMAIL_ENDPOINT, {
        email: formData.formData.emailAddress,
      }, {
        signal: controller.signal,
      });

      if (response.status === 204) {
        navigate(REGISTER_EMAIL_CHECK_URL, { state: { dataToSubmit: { emailAddress: formData.formData.emailAddress } } });
        setIsLoading(false);
      }
    } catch (err) {
      if (err?.response?.data?.message === USER_ALREADY_VERIFIED) {
        navigate(ERROR_ACCOUNT_ALREADY_ACTIVE_URL, { state: { dataToSubmit: { emailAddress: formData.formData.emailAddress } } });
        setIsLoading(false);
      } else if (err?.response?.data?.message === USER_NOT_REGISTERED) {
        registerNewEmail(formData.formData.emailAddress);
      } else {
        // 500 errors will fall into this bucket
        navigate(MESSAGE_URL, { state: { title: 'Something has gone wrong', message: err.response?.data?.message, redirectURL: REGISTER_EMAIL_URL } });
        setIsLoading(false);
      }
    }
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

export default RegisterEmailResend;
