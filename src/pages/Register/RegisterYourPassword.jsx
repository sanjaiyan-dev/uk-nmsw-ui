import { useNavigate } from 'react-router-dom';
import {
  FIELD_PASSWORD,
  VALIDATE_FIELD_MATCH,
  VALIDATE_MIN_LENGTH,
  VALIDATE_REQUIRED
} from '../../constants/AppConstants';
import { REGISTER_CONFIRMATION } from '../../constants/AppUrlConstants';
import DisplayForm from '../../components/DisplayForm';

const SupportingText = () => {
  return (
    <>
      <div className="govuk-inset-text">
        <p className="govuk-body">Your password must be at least 10 characters long. There is no restriction on the characters you use.</p>
        <p className="govuk-body">To create a long and strong password, the National Cyber Security Centre recommends using <a href="https://www.ncsc.gov.uk/collection/top-tips-for-staying-secure-online/three-random-words#:~:text=Why%20does%20the%20NCSC%20recommend,enough%20for%20you%20to%20remember" target="_blank" rel="noreferrer">3 random words</a>.</p>
      </div>
    </>
  );
};

const RegisterYourPassword = () => {
  const navigate = useNavigate();

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
          message: 'Enter a password'
        },
        {
          type: VALIDATE_MIN_LENGTH,
          message: 'Passwords must be at least 10 characters long',
          condition: 10
        },
      ]
    },
    {
      type: FIELD_PASSWORD,
      fieldName: 'repeatPassword',
      label: 'Confirm your password',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Confirm your password'
        },
        {
          type: VALIDATE_FIELD_MATCH,
          message: 'Passwords must match',
          condition: 'requirePassword',
        },
      ]
    }
  ];

  const handleSubmit = async (e, formData) => {
    console.log('submit', e, formData);
    navigate(
      REGISTER_CONFIRMATION,
      {
        state: {
          companyName: 'COMPANY NAME GOES HERE'
        }
      }
    );
  };

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-three-quarters">
        <DisplayForm
          formId='formRegisterYourPassword'
          fields={formFields}
          formActions={formActions}
          pageHeading='Create a password'
          handleSubmit={handleSubmit}
        >
          <SupportingText />
        </DisplayForm>
      </div>
    </div>
  );
};

export default RegisterYourPassword;
