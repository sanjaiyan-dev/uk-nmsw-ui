import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DisplayForm from '../../components/Forms/DisplayForm';
import {
  FIELD_EMAIL,
  FIELD_PASSWORD,
  INTERNAL_TEAMS,
  SIGN_IN_FORM,
  USER_TYPE_ADMIN,
  USER_TYPE_STANDARD,
  VALIDATE_EMAIL_ADDRESS,
  VALIDATE_REQUIRED,
} from '../../constants/AppConstants';
import {
  SIGN_IN_ENDPOINT,
  USER_ENDPOINT,
  USER_MUST_UPDATE_PASSWORD,
  USER_NOT_VERIFIED,
  USER_SIGN_IN_DETAILS_INVALID,
} from '../../constants/AppAPIConstants';
import {
  LOGGED_IN_LANDING,
  MESSAGE_URL,
  REGISTER_ACCOUNT_URL,
  REQUEST_PASSWORD_RESET_URL,
  SIGN_IN_URL,
  HELP_URL,
  RESEND_EMAIL_USER_NOT_VERIFIED,
  ETA_URL,
} from '../../constants/AppUrlConstants';
import Auth from '../../utils/Auth';
import cookieToFind from '../../utils/cookieToFind';
import ParseJwtForUserType from '../../utils/ParseJwtForUserType';
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
  const etaCookie = cookieToFind('etaCookie');
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

  const removePageErrors = () => {
    if (errors) setErrors();
    setIsLoading(false);
  };

  const getUserData = async ({ authData, tokenData }) => {
    const controller = new AbortController();
    const { signal } = controller;

    try {
      const response = await axios.get(USER_ENDPOINT, {
        signal,
        headers: { Authorization: `Bearer ${authData.access_token}` },
      });
      const userData = await response.data;
      // for added security we check both the team is NOT in the internal user list and the token has an external group
      const isExternal = !INTERNAL_TEAMS.includes(userData.group.groupType.name) && tokenData.external;

      /**
       * and that the user has an approved type:
       * All admins are also users
       * If there's a conflict between token showing Admin & User
       * and database showing only User
       * we default back to User only access as a precaution
       * HOWEVER: currently all external users are admins, keeping this check here for future use (it mimics what we do on nmsw-internal-ui)
      */
      const isUserTypeValid = (
        (tokenData.admin && userData.userType.name === USER_TYPE_ADMIN)
        || (tokenData.user && (userData.userType.name === USER_TYPE_ADMIN || userData.userType.name === USER_TYPE_STANDARD))
      );

      if (isExternal && isUserTypeValid) {
        Auth.storeUserType({ userData, tokenData });
        Auth.storeToken(authData.access_token);
        Auth.storeRefreshToken(authData.refresh_token);

        if (!etaCookie) {
          navigate(ETA_URL, { state });
        } else if (state?.redirectURL) {
          navigate(state.redirectURL, { state });
        } else {
          navigate(LOGGED_IN_LANDING);
        }
      } else {
        // if it's an internal user we error the standard invalid user error
        setErrors('Email and password combination is invalid');
      }
    } catch (err) {
      if (err?.code === 'ERR_CANCELED') {
        return;
      }
      setErrors(err?.response?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async ({ formData }) => {
    setIsLoading(true);
    try {
      const response = await axios.post(SIGN_IN_ENDPOINT, formData);
      if (response.data.access_token) {
        const userRoles = await ParseJwtForUserType(response.data.access_token);
        getUserData({ authData: response.data, tokenData: userRoles });
      }
    } catch (err) {
      if (err?.response?.data?.message === USER_SIGN_IN_DETAILS_INVALID) {
        setErrors('Email and password combination is invalid');
        scrollToTop();
      } else if (err?.response?.data?.message === USER_NOT_VERIFIED) {
        navigate(RESEND_EMAIL_USER_NOT_VERIFIED, {
          state: {
            emailAddress: formData.email,
            redirectURL: SIGN_IN_URL,
          },
        });
        scrollToTop();
      } else if (err?.response?.data?.message === USER_MUST_UPDATE_PASSWORD) {
        navigate(MESSAGE_URL, {
          state:
          {
            title: 'Service update',
            message: "To continue to use the service, please reset your password. Any voyage reports you've saved will not be affected.",
            linkText: 'Reset password',
            redirectURL: REQUEST_PASSWORD_RESET_URL,
            resetPasswordTitle: 'Reset password',
          },
        });
      } else {
        navigate(MESSAGE_URL, { state: { title: 'Something has gone wrong', message: err.response?.data?.message, redirectURL: SIGN_IN_URL } });
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
        removePageErrors={removePageErrors}
      >
        <SupportingText />
      </DisplayForm>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-m">Problems signing in</h2>
          <Link to={REQUEST_PASSWORD_RESET_URL}>Forgotten your password?</Link>
          <p className="govuk-body govuk-!-margin-top-5">
            {'If you cannot use this service to send your forms, you can still '}
            <Link className="govuk-link" to={HELP_URL}>submit the required forms using email</Link>
            .
          </p>
        </div>
      </div>
    </>
  );
};

export default SignIn;
