import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import {
  FIELD_EMAIL,
  SINGLE_PAGE_FORM,
  VALIDATE_EMAIL_ADDRESS,
  VALIDATE_REQUIRED,
} from '../../constants/AppConstants';
import DisplayForm from '../../components/DisplayForm';
// import Auth from '../../utils/Auth';

const SupportingText = () => (
  <div>
    <p className="govuk-body">We&quot;ll email you a link to reset your password.</p>
  </div>
);

const RequestPasswordReset = () => {
  // const navigate = useNavigate();
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

  const requestPasswordResetEmail = async (emailToSendTo) => {
    try {
      console.log('send password reset email', emailToSendTo);
      // const controller = new AbortController();
      // const response = await axios.post(ENDPOINT_HERE, {
      //   email: emailToSendTo,
      // }, {
      //   signal: controller.signal,
      // });

      // if (response.status === 204 || 401) {
      //   navigate(CONFIRMATION_URL_OR_COMPONENT_HERE, { state: { dataToSubmit: { emailAddress: emailToSendTo } } });
      // }
    } catch (err) {
      // // 400 bad request, 500
      // navigate(MESSAGE_URL, { state: { title: 'Something has gone wrong', message: err.response?.data?.message, redirectURL: PASSWORD_RESET_EMAIL_HERE } });
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
      pageHeading="Forgot password"
      handleSubmit={handleSubmit}
    >
      <SupportingText />
    </DisplayForm>
  );
};

export default RequestPasswordReset;
