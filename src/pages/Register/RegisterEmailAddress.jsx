import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AXIOS_ERROR, REGISTER_ACCOUNT_ENDPOINT, USER_ALREADY_REGISTERED } from '../../constants/AppAPIConstants';
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

  const handleSubmit = async (formData) => {
    const dataToSubmit = {
      email: formData.formData.emailAddress,
    };

    try {
      const response = await axios.post(REGISTER_ACCOUNT_ENDPOINT, dataToSubmit, {
        headers: { Authorization: `Bearer ${Auth.retrieveToken()}` },
      });
      navigate(REGISTER_EMAIL_CHECK_URL, { state: { dataToSubmit: { emailAddress: response.data.email } } });
    } catch (err) {
      // scenarios we need updated response for : 400: User is awaiting verification

      // catch any axios errors and treat as a generic error
      if (err.message === AXIOS_ERROR) {
        navigate(MESSAGE_URL, { state: { title: 'Something has gone wrong', redirectURL: REGISTER_EMAIL_URL } });
      } else if (err.response?.data?.message === USER_ALREADY_REGISTERED) {
        navigate(ERROR_ACCOUNT_ALREADY_ACTIVE_URL, { state: { dataToSubmit: { emailAddress: formData.formData.emailAddress } } });
      } else {
        // 500 errors will fall into this bucket
        navigate(MESSAGE_URL, { state: { title: 'Something has gone wrong', message: err.response?.data?.message, redirectURL: REGISTER_EMAIL_URL } });
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
    >
      <SupportingText />
    </DisplayForm>
  );
};

export default RegisterEmailAddress;
