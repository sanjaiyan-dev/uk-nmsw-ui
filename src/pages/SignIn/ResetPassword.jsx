import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import {
  PASSSWORD_RESET_ENDPOINT,
} from '../../constants/AppAPIConstants';
import {
  FIELD_PASSWORD,
  MULTI_PAGE_FORM,
  VALIDATE_FIELD_MATCH_CASE_SENSITIVE,
  VALIDATE_MIN_LENGTH,
  VALIDATE_NO_SPACES,
  VALIDATE_REQUIRED,
} from '../../constants/AppConstants';
import {
  MESSAGE_URL,
  PASSWORD_GUIDENCE_URL,
  REQUEST_PASSWORD_RESET_URL,
  SIGN_IN_URL,
} from '../../constants/AppUrlConstants';
import DisplayForm from '../../components/Forms/DisplayForm';
import ConfirmationMessage from '../../components/ConfirmationMessage';

const SupportingText = () => (
  <div className="govuk-inset-text">
    <p className="govuk-body">Your new password needs to be 10 or more characters. There is no restriction on the characters you use.</p>
    <p className="govuk-body">
      To create a long and strong password, the National Cyber Security Centre recommends using <a href={PASSWORD_GUIDENCE_URL} target="_blank" rel="noreferrer">3 random words (opens in new tab)</a>.
    </p>
  </div>
);

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmationPanel, setShowConfirmationPanel] = useState(false);
  document.title = 'Create a password';

  const formActions = {
    submit: {
      label: 'Reset password',
    },
  };
  const formFields = [
    {
      type: FIELD_PASSWORD,
      fieldName: 'requirePassword',
      label: 'New password',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter a password',
        },
        {
          type: VALIDATE_MIN_LENGTH,
          message: 'Password must be at least 10 characters long',
          condition: 10,
        },
        {
          type: VALIDATE_NO_SPACES,
          message: 'Password must not contain spaces',
        },
      ],
    },
    {
      type: FIELD_PASSWORD,
      fieldName: 'repeatPassword',
      label: 'Confirm new password',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Confirm new password',
        },
        {
          type: VALIDATE_FIELD_MATCH_CASE_SENSITIVE,
          message: 'Passwords must match',
          condition: 'requirePassword',
        },
      ],
    },
  ];

  const sendPasswordReset = async ({ password }) => {
    try {
      const controller = new AbortController();
      const response = await axios.patch(PASSSWORD_RESET_ENDPOINT, {
        token,
        password,
      }, {
        signal: controller.signal,
      });

      if (response.status === 204) {
        setShowConfirmationPanel(true);
      }
    } catch (err) {
      // treat invalid links as though link expired as chances are it's the token not being copied over properly and we should
      // prompt user to get a new link
      if (err.response.status === 401 || err.response.status === 400) {
        navigate(MESSAGE_URL, {
          state: {
            title: 'Password reset link has expired',
            button: {
              buttonLabel: 'Request a new link',
              buttonNavigateTo: REQUEST_PASSWORD_RESET_URL,
            },
          },
        });
      } else {
        navigate(MESSAGE_URL, { state: { title: 'Something has gone wrong', message: err.response?.data?.message, redirectURL: REQUEST_PASSWORD_RESET_URL } });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    sendPasswordReset({ password: formData.formData.requirePassword });
  };

  if (showConfirmationPanel) {
    return (
      <ConfirmationMessage
        pageTitle="Password reset"
        confirmationMessage="Your password has been reset"
        nextPageLink={SIGN_IN_URL}
        nextPageLinkText="Sign in to start using the service"
      />
    );
  }
  return (
    <DisplayForm
      formId="formRegisterYourPassword"
      fields={formFields}
      formActions={formActions}
      formType={MULTI_PAGE_FORM}
      isLoading={isLoading}
      pageHeading="Change your password"
      handleSubmit={handleSubmit}
    >
      <SupportingText />
    </DisplayForm>
  );
};

export default ResetPassword;
