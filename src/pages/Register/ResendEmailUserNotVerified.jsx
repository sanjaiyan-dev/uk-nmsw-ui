import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { REGISTER_RESEND_VERIFICATION_EMAIL_ENDPOINT } from '../../constants/AppAPIConstants';
import {
  MESSAGE_URL,
  REGISTER_EMAIL_CHECK_URL,
  REGISTER_EMAIL_RESEND_URL,
} from '../../constants/AppUrlConstants';
import LoadingSpinner from '../../components/LoadingSpinner';

const ResendEmailUserNotVerified = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const emailAddress = state?.emailAddress;
  document.title = 'Resend invitation';

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const controller = new AbortController();
      const response = await axios.post(REGISTER_RESEND_VERIFICATION_EMAIL_ENDPOINT, {
        email: emailAddress,
      }, {
        signal: controller.signal,
      });

      if (response.status === 204) {
        navigate(REGISTER_EMAIL_CHECK_URL, { state: { dataToSubmit: { emailAddress } } });
      }
    } catch (err) {
      if (err?.code === 'ERR_CANCELED') {
        return;
      }
      navigate(MESSAGE_URL, { state: { title: 'Something has gone wrong', message: err.response?.data?.message, redirectURL: state?.redirectURL } });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!emailAddress) {
      navigate(REGISTER_EMAIL_RESEND_URL);
    }
  }, [emailAddress, navigate]);

  if (isLoading) {
    return (<LoadingSpinner />);
  }

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-full">
        <h1 className="govuk-heading-xl">Email address not verified</h1>
        <p className="govuk-body">We can send you a verification link so you can continue creating your account.</p>
        <button
          className="govuk-button"
          type="button"
          onClick={handleSubmit}
        >
          Resend verification email
        </button>
      </div>
    </div>
  );
};

export default ResendEmailUserNotVerified;
