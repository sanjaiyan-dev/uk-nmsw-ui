// import { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
// import axios from 'axios';
// import {
//   PASSSWORD_RESET_ENDPOINT,
// } from '../../constants/AppAPIConstants';
import {
  FIELD_PASSWORD,
  MULTI_PAGE_FORM,
  VALIDATE_FIELD_MATCH_CASE_SENSITIVE,
  VALIDATE_MIN_LENGTH,
  VALIDATE_NO_SPACES,
  VALIDATE_REQUIRED,
} from '../../constants/AppConstants';
import {
  PASSWORD_GUIDENCE_URL,
} from '../../constants/AppUrlConstants';
import DisplayForm from '../../components/DisplayForm';

const SupportingText = () => (
  <div className="govuk-inset-text">
    <p className="govuk-body">Your new password needs to be 10 or more characters. There is no restriction on the characters you use.</p>
    <p className="govuk-body">
      To create a long and strong password, the National Cyber Security Centre recommends using <a href={PASSWORD_GUIDENCE_URL} target="_blank" rel="noreferrer">3 random words (opens in new tab)</a>.
    </p>
  </div>
);

const ResetPassword = () => {
  // const navigate = useNavigate();
  // const { state } = useLocation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  // const [isLoading, setIsLoading] = useState(false);
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
    // user reaches this url by clicking the link in their password reset email /new-password?token=123.
    // get the token from the link
    // get the password the user entered
    // PATCH to
    // with:
    // {
    //   "token": "string",
    //   "password": "string"
    // }
    console.log('submit token', token, formData.formData.requirePassword);
  };

  return (
    <DisplayForm
      formId="formRegisterYourPassword"
      fields={formFields}
      formActions={formActions}
      formType={MULTI_PAGE_FORM}
      // isLoading={isLoading}
      pageHeading="Change your password"
      handleSubmit={handleSubmit}
    >
      <SupportingText />
    </DisplayForm>
  );
};

export default ResetPassword;
