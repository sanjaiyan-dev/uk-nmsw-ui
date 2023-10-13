import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  REGISTER_ACCOUNT_ENDPOINT,
  REGISTER_RESEND_VERIFICATION_EMAIL_ENDPOINT,
  USER_ALREADY_REGISTERED,
  USER_ALREADY_VERIFIED_LOGIN,
  USER_AWAITING_VERIFICATION,
} from '../../constants/AppAPIConstants';
import {
  FIELD_EMAIL,
  RESTRICTED_EMAIL_PATTERNS,
  SERVICE_CONTACT_EMAIL,
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
import DisplayForm from '../../components/Forms/DisplayForm';
import Auth from '../../utils/Auth';

const SupportingText = () => (
  <div className="govuk-inset-text">
    <p className="govuk-body">We may use these details to contact you if we have questions about reports that you submit.</p>
  </div>
);

const RegisterEmailAddress = () => {
  const navigate = useNavigate();
  const [emailAddress, setEmailAddress] = useState();
  const [isRestrictedError, setIsRestrictedError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  document.title = 'What is your email address?';

  const formActions = {
    submit: {
      label: 'Send confirmation email',
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
          message: 'Email addresses must match',
          condition: 'emailAddress',
        },
      ],
    },
  ];

  const removePageErrors = () => {
    if (isRestrictedError) setIsRestrictedError();
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
      if (err?.response?.data?.message === USER_ALREADY_VERIFIED_LOGIN) {
        // Edgecase where somehow user activates their account while we're processing a resend verification email
        navigate(ERROR_ACCOUNT_ALREADY_ACTIVE_URL, { state: { dataToSubmit: { emailAddress: emailToSendTo } } });
      } else {
        // USER_NOT_REGISTERED & 500 errors will fall into this bucket (error out on USER_NOT_REGISTERED as it shouldn't occur here and we don't want to cause a loop of register/resend running)
        navigate(MESSAGE_URL, { state: { title: 'Something has gone wrong', message: err.response?.data?.message, redirectURL: REGISTER_EMAIL_URL } });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    const dataToSubmit = {
      email: formData.formData.emailAddress,
    };

    const isRestrictedEmail = await RESTRICTED_EMAIL_PATTERNS.filter((word) => formData.formData.emailAddress.includes(word)).length > 0;

    if (isRestrictedEmail) {
      setEmailAddress(formData.formData.emailAddress);
      setIsRestrictedError(true);
      setIsLoading(false);
    } else {
      try {
        const response = await axios.post(REGISTER_ACCOUNT_ENDPOINT, dataToSubmit, {
          headers: { Authorization: `Bearer ${Auth.retrieveToken()}` },
        });
        navigate(REGISTER_EMAIL_CHECK_URL, { state: { dataToSubmit: { emailAddress: response.data.email } } });
        setIsLoading(false);
      } catch (err) {
        if (err.response?.data?.message === USER_ALREADY_REGISTERED) {
          navigate(ERROR_ACCOUNT_ALREADY_ACTIVE_URL, { state: { dataToSubmit: { emailAddress: formData.formData.emailAddress } } });
          setIsLoading(false);
        } else if (err.response?.data?.message === USER_AWAITING_VERIFICATION) {
          resendVerificationEmail(formData.formData.emailAddress);
        } else {
          // 500 errors will fall into this bucket
          navigate(MESSAGE_URL, { state: { title: 'Something has gone wrong', message: err.response?.data?.message, redirectURL: REGISTER_EMAIL_URL } });
          setIsLoading(false);
        }
      }
    }
  };

  return (
    <>
      {isRestrictedError
        && (
          <div className="govuk-error-summary" data-module="govuk-error-summary">
            <div role="alert">
              <h2 className="govuk-error-summary__title">
                There is a problem
              </h2>
              <div className="govuk-error-summary__body">
                <ul className="govuk-list govuk-error-summary__list">
                  <li className="errorText govuk-!-font-weight-bold govuk-!-padding-bottom-4" data-testid="restrictedEmailText">
                    {`You cannot register with ${emailAddress} to use this service.`}
                  </li>
                </ul>
                <p className="govuk-body govuk-!-font-weight-bold">If you need to view National Maritime Single Window reports</p>
                <p className="govuk-body">{'You can request access by contacting the support desk at '}
                  <a className="govuk-link" href={`mailto: ${SERVICE_CONTACT_EMAIL}`}>
                    {SERVICE_CONTACT_EMAIL}
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}
      <DisplayForm
        formId="formRegisterEmailAddress"
        fields={formFields}
        formActions={formActions}
        formType={SINGLE_PAGE_FORM}
        hasPageLevelErrors
        removePageErrors={removePageErrors}
        isLoading={isLoading}
        pageHeading="What is your email address?"
        handleSubmit={handleSubmit}
      >
        <SupportingText />
      </DisplayForm>
    </>
  );
};

export default RegisterEmailAddress;
