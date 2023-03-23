import { useNavigate } from 'react-router-dom';
import DisplayForm from '../../../components/DisplayForm';
import {
  DISPLAY_PASSWORD,
  FIELD_PASSWORD,
  PASSWORD_FORM,
  VALIDATE_FIELD_MATCH_CASE_SENSITIVE,
  VALIDATE_MIN_LENGTH,
  VALIDATE_NO_SPACES,
  VALIDATE_REQUIRED,
} from '../../../constants/AppConstants';
import {
  CHANGE_YOUR_PASSWORD_PAGE_NAME,
  GENERIC_CONFIRMATION_URL,
  PASSWORD_GUIDENCE_URL,
  YOUR_DETAILS_PAGE_URL,
} from '../../../constants/AppUrlConstants';

const PasswordSupportingText = () => (
  <div className="govuk-grid-column-two-thirds">
    <p className="govuk-body govuk-!-font-weight-bold">Enter a new password</p>
    <p className="govuk-body">Your password must be at least 10 characters long. There is no restriction on the characters you use.</p>
    <p className="govuk-body">
      To create a long and strong password, the National Cyber Security Centre recommends using <a href={PASSWORD_GUIDENCE_URL} target="_blank" rel="noreferrer">3 random words (opens in new tab)</a>.
    </p>
  </div>
);

const ChangeYourPassword = () => {
  const navigate = useNavigate();
  document.title = CHANGE_YOUR_PASSWORD_PAGE_NAME;

  const formActions = {
    submit: {
      label: 'Change password',
    },
  };

  const formFieldNewPassword = [
    {
      type: FIELD_PASSWORD,
      fieldName: 'currentPassword',
      label: 'Enter your current password',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter a password',
        },
      ],
    },
    {
      type: FIELD_PASSWORD,
      fieldName: 'requirePassword',
      label: 'New password',
      displayType: DISPLAY_PASSWORD,
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter a new password',
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
          message: 'Confirm your new password',
        },
        {
          type: VALIDATE_FIELD_MATCH_CASE_SENSITIVE,
          message: 'Passwords must match',
          condition: 'requirePassword',
        },
      ],
    },
  ];

  const handleSubmit = async () => {
    navigate(
      GENERIC_CONFIRMATION_URL,
      {
        state: {
          pageTitle: 'Change your details confirmation',
          nextPageLink: YOUR_DETAILS_PAGE_URL,
          nextPageName: 'your details',
          confirmationMessage: 'Your details have been saved',
        },
      },
    );
  };

  return (
    <DisplayForm
      formId="formRegisterYourPassword"
      fields={formFieldNewPassword}
      formActions={formActions}
      formType={PASSWORD_FORM}
      pageHeading={CHANGE_YOUR_PASSWORD_PAGE_NAME}
      handleSubmit={handleSubmit}
    >
      <PasswordSupportingText />
    </DisplayForm>
  );
};

export default ChangeYourPassword;
