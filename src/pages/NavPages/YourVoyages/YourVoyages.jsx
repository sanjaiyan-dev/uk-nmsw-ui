import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { SERVICE_NAME } from '../../../constants/AppConstants';
import { CREATE_VOYAGE_ENDPOINT, TOKEN_EXPIRED } from '../../../constants/AppAPIConstants';
import {
  SIGN_IN_URL,
  VOYAGE_GENERAL_DECLARATION_UPLOAD_URL,
  YOUR_VOYAGES_URL,
} from '../../../constants/AppUrlConstants';
import LoadingSpinner from '../../../components/LoadingSpinner';
import Message from '../../../components/Message';
import Auth from '../../../utils/Auth';
import useGetAllDeclarations from '../../../utils/API/useGetAllDeclarations';
import YourVoyagesDisplay from './YourVoyagesDisplay';

// NOTES:
// - The filter buttons do nothing
// - There is commented out code for when/if we need to display in cancelled/failed voyages in the future
// - There is commented out code for when the filter is working but there are no voyages relating to the filter

const YourVoyages = () => {
  dayjs.extend(customParseFormat);
  const { state } = useLocation();
  const navigate = useNavigate();
  const [notification, setNotification] = useState({});
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [voyageData, setVoyageData] = useState();
  const apiResponse = useGetAllDeclarations();

  document.title = SERVICE_NAME;

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(CREATE_VOYAGE_ENDPOINT, {}, {
        headers: { Authorization: `Bearer ${Auth.retrieveToken()}` },
      });
      if (response.status === 200) {
        navigate(`${VOYAGE_GENERAL_DECLARATION_UPLOAD_URL}?report=${response.data.id}`);
      }
    } catch (err) {
      // 422 missing segments = missing bearer token for this endpoint
      if (err?.response?.status === 422) {
        Auth.removeToken();
        navigate(SIGN_IN_URL, { state: { redirectURL: YOUR_VOYAGES_URL } });
      } else if (err?.response?.data?.msg === TOKEN_EXPIRED) {
        Auth.removeToken();
        navigate(SIGN_IN_URL, { state: { redirectURL: YOUR_VOYAGES_URL } });
      } else {
        setIsError(true);
      }
    }
  };

  useEffect(() => {
    if (state?.confirmationBanner?.message) {
      setNotification({
        show: true,
        message: state?.confirmationBanner?.message,
      });
      // eslint-disable-next-line no-restricted-globals
      navigate(location.pathname, { replace: true });
    }
  }, [state]);

  useEffect(() => {
    setIsLoading(true);
    if (apiResponse?.apiData) {
      setVoyageData(apiResponse.apiData);
      setIsLoading(apiResponse.isLoading);
    } else if (apiResponse?.error) {
      setIsError(true);
      setIsLoading(apiResponse.isLoading);
    }
  }, [apiResponse]);

  if (isError) {
    return (
      <Message title="Something has gone wrong" redirectURL={YOUR_VOYAGES_URL} />
    );
  }

  if (isLoading) { return (<LoadingSpinner />); }

  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          {notification.show && (
            <div
              className="govuk-notification-banner govuk-notification-banner--success"
              role="alert"
              aria-labelledby="govuk-notification-banner-title"
              data-module="govuk-notification-banner"
            >
              <div className="govuk-notification-banner__header">
                <h2 className="govuk-notification-banner__title" id="govuk-notification-banner-title">
                  Success
                </h2>
              </div>
              <div className="govuk-notification-banner__content">
                <h3 className="govuk-notification-banner__heading">
                  {notification.message}
                </h3>
              </div>
            </div>
          )}
          <h1 className="govuk-heading-xl govuk-!-margin-bottom-4">Your voyages</h1>
          {voyageData?.length === 0 && (
            <div className="govuk-inset-text">
              <p className="govuk-body">You have not reported any voyages yet</p>
            </div>
          )}
          <button
            className="govuk-button"
            data-module="govuk-button"
            disabled={isLoading}
            type="button"
            onClick={() => { handleClick(); }}
          >
            Report a voyage
          </button>
        </div>
      </div>

      {voyageData?.length > 0 && (
        <YourVoyagesDisplay
          voyageData={voyageData}
        />
      )}
    </>
  );
};

export default YourVoyages;
