import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FIELD_EMAIL,
  FIELD_PASSWORD,
  SIGN_IN_FORM,
  VALIDATE_EMAIL_ADDRESS,
  VALIDATE_REQUIRED,
} from '../../constants/AppConstants';
import {
  MESSAGE_URL,
  REGISTER_ACCOUNT_URL,
  SIGN_IN_URL,
  YOUR_VOYAGES_URL,
  REGISTER_EMAIL_RESEND_URL,
} from '../../constants/AppUrlConstants';
import DisplayForm from '../../components/DisplayForm';
import { SIGN_IN, USER_NOT_VERIFIED, USER_SIGN_IN_DETAILS_INVALID } from '../../constants/AppAPIConstants';
import Auth from '../../utils/Auth';

const SupportingText = () => (
  <div className="govuk-inset-text">
    <p className="govuk-body">
      If you do not have an account, you can <Link to={REGISTER_ACCOUNT_URL}>create one now</Link>.
    </p>
  </div>
);

const SignIn = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [errors, setErrors] = useState();
  document.title = 'Sign in';

  // Form fields
  const formActions = {
    submit: {
      label: 'Sign in',
    },
  };
  const formFields = [
    {
      type: FIELD_EMAIL,
      label: 'Email address',
      fieldName: 'email',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter your email address',
        },
        {
          type: VALIDATE_EMAIL_ADDRESS,
          message: 'Enter your email address in the correct format, like name@example.com',
        },
      ],
    },
    {
      type: FIELD_PASSWORD,
      label: 'Password',
      fieldName: FIELD_PASSWORD, // fieldname must be password as when fieldname is password we do not store value to session storage
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter your password',
        },
      ],
    },
  ];

  const removeApiErrors = () => {
    if (errors) setErrors();
  };

  const handleSubmit = async ({ formData }) => {
    try {
      const response = await axios.post(SIGN_IN, formData);
      if (response.data.token) { Auth.storeToken(response.data.token); }
      if (state?.redirectURL) {
        navigate(state.redirectURL);
      } else {
        navigate(YOUR_VOYAGES_URL);
      }
    } catch (err) {
      if (err?.response?.data?.message === USER_SIGN_IN_DETAILS_INVALID) {
        setErrors('Email and password combination is invalid');
      } else if (err?.response?.data?.message === USER_NOT_VERIFIED) {
        navigate(REGISTER_EMAIL_RESEND_URL, { state: { dataToSubmit: { emailAddress: formData?.email } } });
      } else {
        navigate(MESSAGE_URL, { state: { title: 'Something has gone wrong', message: err.response?.data?.message, redirectURL: SIGN_IN_URL } });
      }
    }
  };

  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          {errors
            && (
              <div className="govuk-error-summary" data-module="govuk-error-summary">
                <div role="alert">
                  <h2 className="govuk-error-summary__title">
                    There is a problem
                  </h2>
                  <div className="govuk-error-summary__body">
                    <ul className="govuk-list govuk-error-summary__list">
                      <li className="errorText govuk-!-font-weight-bold">
                        {errors}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
      <DisplayForm
        pageHeading="Sign in"
        formId="formSignIn"
        fields={formFields}
        formActions={formActions}
        formType={SIGN_IN_FORM}
        keepSessionOnSubmit={state?.redirectURL}
        handleSubmit={handleSubmit}
        removeApiErrors={removeApiErrors}
      >
        <SupportingText />
      </DisplayForm>
    </>
  );
};

export default SignIn;
