import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DisplayForm from '../../components/DisplayForm';
import {
  FIELD_EMAIL,
  FIELD_PASSWORD,
  SIGN_IN_FORM,
  VALIDATE_EMAIL_ADDRESS,
  VALIDATE_REQUIRED,
} from '../../constants/AppConstants';
import {
  REGISTER_RESEND_VERIFICATION_EMAIL_ENDPOINT,
  SIGN_IN_ENDPOINT,
  USER_ALREADY_VERIFIED,
  USER_NOT_VERIFIED,
  USER_SIGN_IN_DETAILS_INVALID,
} from '../../constants/AppAPIConstants';
import {
  MESSAGE_URL,
  REGISTER_ACCOUNT_URL,
  SIGN_IN_URL,
  LOGGED_IN_LANDING,
  REGISTER_EMAIL_RESEND_URL,
  REGISTER_EMAIL_CHECK_URL,
  ERROR_ACCOUNT_ALREADY_ACTIVE_URL,
} from '../../constants/AppUrlConstants';
import Auth from '../../utils/Auth';
import { scrollToTop } from '../../utils/ScrollToElement';

const SupportingText = () => (
  <div className="govuk-inset-text">
    <p className="govuk-body">
      If you do not have an account, you can <Link className="govuk-link" to={REGISTER_ACCOUNT_URL}>create one now</Link>.
    </p>
  </div>
);

const SignIn = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [errors, setErrors] = useState();
  const [isLoading, setIsLoading] = useState(false);
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
          message: 'Enter a real email address',
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
    setIsLoading(false);
  };

  const resendVerificationEmail = async (emailToSendTo) => {
    try {
      const controller = new AbortController();
      const response = await axios.post(REGISTER_RESEND_VERIFICATION_EMAIL_ENDPOINT, {
        email: emailToSendTo,
      }, {
        signal: controller.signal,
      });

      if (response.status === 204) {
        navigate(REGISTER_EMAIL_CHECK_URL, { state: { dataToSubmit: { emailAddress: emailToSendTo } } });
      }
    } catch (err) {
      if (err?.response?.data?.message === USER_ALREADY_VERIFIED) {
        // Edgecase where somehow user activates their account while we're processing a resend verification email
        navigate(ERROR_ACCOUNT_ALREADY_ACTIVE_URL, { state: { dataToSubmit: { emailAddress: emailToSendTo } } });
      } else {
        // USER_NOT_REGISTERED & 500 errors will fall into this bucket (error out on USER_NOT_REGISTERED as it shouldn't occur here and we don't want to cause a loop of register/resend running)
        navigate(MESSAGE_URL, { state: { title: 'Something has gone wrong', message: err.response?.data?.message, redirectURL: SIGN_IN_URL } });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async ({ formData }) => {
    setIsLoading(true);
    try {
      const response = await axios.post(SIGN_IN_ENDPOINT, formData);
      if (response.data.token) { Auth.storeToken(response.data.token); }
      if (state?.redirectURL) {
        navigate(state.redirectURL, { state });
      } else {
        navigate(LOGGED_IN_LANDING);
      }
    } catch (err) {
      if (err?.response?.data?.message === USER_SIGN_IN_DETAILS_INVALID) {
        setErrors('Email and password combination is invalid');
        scrollToTop();
      } else if (err?.response?.data?.message === USER_NOT_VERIFIED) {
        navigate(REGISTER_EMAIL_RESEND_URL, { state: { dataToSubmit: { emailAddress: formData?.email } } });
      } else {
        /* currently if a user is registered but not verified
         * (aka in database but not able to sign in yet) we get a 500 response
         * To handle that until API can be updated with a clear response
         * for this scenario, any other error we will attempt to re-send verification
         * email.
         * Once we have an error response we can use to identify this scenario then
         * we can go back to the navigate(MESSAGE ...) code below
         */
        resendVerificationEmail(formData.email);
        // navigate(MESSAGE_URL, { state: { title: 'Something has gone wrong', message: err.response?.data?.message, redirectURL: SIGN_IN_URL } });
      }
    } finally {
      setIsLoading(false);
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
        isLoading={isLoading}
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
