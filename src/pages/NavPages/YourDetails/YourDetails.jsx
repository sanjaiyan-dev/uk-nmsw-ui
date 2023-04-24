import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { USER_ENDPOINT } from '../../../constants/AppAPIConstants';
import {
  // CHANGE_YOUR_DETAILS_PAGE_URL,
  MESSAGE_URL,
  // CHANGE_YOUR_PASSWORD_PAGE_URL,
  REQUEST_PASSWORD_RESET_URL,
  SIGN_IN_URL,
  YOUR_DETAILS_PAGE_NAME,
  YOUR_DETAILS_PAGE_URL,
} from '../../../constants/AppUrlConstants';
import Auth from '../../../utils/Auth';

const YourDetails = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({});

  document.title = YOUR_DETAILS_PAGE_NAME;

  const getUserData = async () => {
    try {
      const response = await axios.get(USER_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${Auth.retrieveToken()}`,
        },
      });
      setUserData(response.data);
    } catch (err) {
      if (err?.response?.status === 401 || err?.response?.status === 422) {
        Auth.removeToken();
        navigate(SIGN_IN_URL, { state: { redirectURL: YOUR_DETAILS_PAGE_URL } });
      } else {
        navigate(MESSAGE_URL, { state: { title: 'Something has gone wrong', message: err.response?.data?.message, redirectURL: YOUR_DETAILS_PAGE_URL } });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getUserData();
  }, [setUserData]);

  if (isLoading) { return (<LoadingSpinner />); }

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <h1 className="govuk-heading-xl">Your details</h1>
        <dl className="govuk-summary-list">
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">
              Email address
            </dt>
            <dd className="govuk-summary-list__value">
              {userData.email}
            </dd>
          </div>

          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">
              Full name
            </dt>
            <dd className="govuk-summary-list__value">
              {userData.fullName}
            </dd>
          </div>

          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">
              Your company name
            </dt>
            <dd className="govuk-summary-list__value">
              {/* {userData.company} */}
            </dd>
          </div>

          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">
              Phone number
            </dt>
            <dd className="govuk-summary-list__value">
              {userData.phoneNumber}
            </dd>
          </div>

          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">
              Country
            </dt>
            <dd className="govuk-summary-list__value">
              {userData.countryCode}
            </dd>
          </div>
        </dl>
        {/* Not available in MVP */}
        {/* <Link className="govuk-link" to={CHANGE_YOUR_DETAILS_PAGE_URL}>Change your details</Link> */}

        <h2 className="govuk-heading-m govuk-!-margin-top-6">Account details</h2>
        <dl className="govuk-summary-list">
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">
              Type of account
            </dt>
            <dd className="govuk-summary-list__value">
              {userData?.userType?.name}
            </dd>
          </div>

          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">
              Company type
            </dt>
            <dd className="govuk-summary-list__value">
              {/* {userData.companyType} */}
            </dd>
          </div>

          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">
              Password
              <br />
              <p className="govuk-body">
                {/* This version not used for MVP: <Link className="govuk-link" to={CHANGE_YOUR_PASSWORD_PAGE_URL}>Change your password</Link> */}
                <Link to={REQUEST_PASSWORD_RESET_URL} state={{ title: 'Change your password' }}>Change your password</Link>
              </p>
            </dt>
            {/* Not available for MVP */}
            {/* <dd className="govuk-summary-list__value govuk-hint">
              {`Last changed ${userData.passwordChanged}`}
            </dd> */}
          </div>
        </dl>
        {/* Not available for MVP */}
        {/* <button type="button" className="govuk-button govuk-button--warning" data-module="govuk-button" onClick={() => { }}>
          Delete your account
        </button> */}
      </div>
    </div>
  );
};

export default YourDetails;
