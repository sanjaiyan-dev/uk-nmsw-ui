import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { REGISTER_ACCOUNT_ENDPOINT, TOKEN_INVALID } from '../../constants/AppAPIConstants';
import {
  FIELD_PASSWORD,
  MULTI_PAGE_FORM,
  VALIDATE_FIELD_MATCH_CASE_SENSITIVE,
  VALIDATE_MIN_LENGTH,
  VALIDATE_NO_SPACES,
  VALIDATE_REQUIRED,
} from '../../constants/AppConstants';
import {
  MESSAGE_URL, PASSWORD_GUIDENCE_URL, REGISTER_CONFIRMATION_URL, REGISTER_EMAIL_RESEND_URL, REGISTER_PASSWORD_URL,
} from '../../constants/AppUrlConstants';
import DisplayForm from '../../components/DisplayForm';
import Auth from '../../utils/Auth';

const SupportingText = () => (
  <div className="govuk-inset-text">
    <p className="govuk-body">Your password must be at least 10 characters long. There is no restriction on the characters you use.</p>
    <p className="govuk-body">
      To create a long and strong password, the National Cyber Security Centre recommends using <a href={PASSWORD_GUIDENCE_URL} target="_blank" rel="noreferrer">3 random words</a>.
    </p>
  </div>
);

const RegisterYourPassword = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  document.title = 'Create a password';

  const formActions = {
    submit: {
      className: 'govuk-button',
      dataModule: 'govuk-button',
      dataTestid: 'submit-button',
      label: 'Continue',
      type: 'button',
    },
  };
  const formFields = [
    {
      type: FIELD_PASSWORD,
      fieldName: 'requirePassword',
      label: 'Password',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter a password',
        },
        {
          type: VALIDATE_MIN_LENGTH,
          message: 'Passwords must be at least 10 characters long',
          condition: 10,
        },
        {
          type: VALIDATE_NO_SPACES,
          message: 'Enter a password that does not contain spaces',
        },
      ],
    },
    {
      type: FIELD_PASSWORD,
      fieldName: 'repeatPassword',
      label: 'Confirm your password',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Confirm your password',
        },
        {
          type: VALIDATE_FIELD_MATCH_CASE_SENSITIVE,
          message: 'Passwords must match',
          condition: 'requirePassword',
        },
      ],
    },
  ];

  const handleSubmit = async (formData) => {
    // combine data from previous page of form
    const dataMerged = { ...state?.dataToSubmit, ...formData.formData };
    const dataToSubmit = {
      email: dataMerged.emailAddress,
      fullName: dataMerged.fullName,
      country: dataMerged.country, // max 3 characters (country code)
      phoneNumber: dataMerged.phoneNumber,
      password: dataMerged.requirePassword,
      groupName: dataMerged.companyName,
      groupTypeName: dataMerged.shippingAgent === 'yes' ? 'Shipping Agency' : 'Operator', // these are the only two valid public group types
      token: dataMerged.token,
    };

    try {
      const response = await axios.patch(REGISTER_ACCOUNT_ENDPOINT, dataToSubmit, {
        headers: { Authorization: `Bearer ${Auth.retrieveToken()}` },
      });
      navigate(REGISTER_CONFIRMATION_URL, { state: { companyName: response.data.groupName } });
      sessionStorage.removeItem('formData');
    } catch (err) {
      if (err.response?.data?.message === TOKEN_INVALID) {
        navigate(MESSAGE_URL, {
          state: {
            title: 'Verification link has expired',
            button: {
              buttonLabel: 'Request a new link',
              buttonNavigateTo: REGISTER_EMAIL_RESEND_URL,
            },
          },
        });
      } else {
        navigate(MESSAGE_URL, { state: { title: 'Something has gone wrong', message: err.response?.data?.message, redirectURL: REGISTER_PASSWORD_URL } });
      }
    }
  };

  return (
    <DisplayForm
      formId="formRegisterYourPassword"
      fields={formFields}
      formActions={formActions}
      formType={MULTI_PAGE_FORM}
      pageHeading="Create a password"
      handleSubmit={handleSubmit}
    >
      <SupportingText />
    </DisplayForm>
  );
};

export default RegisterYourPassword;
