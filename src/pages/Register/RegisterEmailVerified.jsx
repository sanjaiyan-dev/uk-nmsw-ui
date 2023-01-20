import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { REGISTER_CHECK_TOKEN_ENDPOINT, TOKEN_INVALID, TOKEN_USED_TO_REGISTER } from '../../constants/AppAPIConstants';
import {
  ERROR_ACCOUNT_ALREADY_ACTIVE_URL,
  MESSAGE_URL,
  REGISTER_DETAILS_URL,
  REGISTER_EMAIL_RESEND_URL,
} from '../../constants/AppUrlConstants';

const RegisterEmailVerified = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailAddress = searchParams.get('email');
  const tokenToCheck = searchParams.get('token');
  const [pageContent, setPageContent] = useState({});
  document.title = 'Your email address has been verified';

  const fetchData = async () => {
    try {
      const controller = new AbortController();
      const response = await axios.post(REGISTER_CHECK_TOKEN_ENDPOINT, {
        token: tokenToCheck,
      }, {
        signal: controller.signal,
      });

      if (response.status === 204) {
        setPageContent({
          title: 'Your email address has been verified',
          blurb: 'You can continue creating your account',
          buttonLabel: 'Continue',
          buttonNavigateTo: REGISTER_DETAILS_URL,
          buttonState: { state: { dataToSubmit: { emailAddress, token: tokenToCheck } } },
        });
      }
    } catch (err) {
      if (err.response?.data?.message === TOKEN_USED_TO_REGISTER) {
        navigate(ERROR_ACCOUNT_ALREADY_ACTIVE_URL, { state: { dataToSubmit: { emailAddress } } });
      } else if (err.response?.data?.message === TOKEN_INVALID) {
        // TODO: once /registration endpoint updated to return user status
        // we extend this to check user status once TOKEN_INVALID received
        // and then if user status is user activated direct them to ERROR_ACCOUNT_ALREADY_ACTIVE_URL
        // otherwise direct to REGISTER_EMAIL_RESEND_URL
        navigate(MESSAGE_URL, {
          state: {
            title: 'Verification link has expired',
            button: {
              buttonLabel: 'Request a new link',
              buttonNavigateTo: REGISTER_EMAIL_RESEND_URL,
              buttonState: { state: { dataToSubmit: { emailAddress } } },
            },
          },
        });
      } else {
        // 500 errors will fall into this bucket
        navigate(MESSAGE_URL, { state: { title: 'Something has gone wrong', message: err.response?.data?.message } });
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [tokenToCheck, emailAddress]);

  if (Object.entries(pageContent).length === 0) { setPageContent({ blurb: '...Loading' }); }
  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <h1 className="govuk-heading-xl">{pageContent.title}</h1>
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <p className="govuk-body">{pageContent.blurb}</p>
          {pageContent.buttonLabel && (
            <button
              className="govuk-button"
              data-module="govuk-button"
              type="button"
              onClick={() => { navigate(pageContent.buttonNavigateTo, pageContent.buttonState); }}
            >
              {pageContent.buttonLabel}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default RegisterEmailVerified;
