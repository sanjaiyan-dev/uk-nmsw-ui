import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { SERVICE_NAME } from '../constants/AppConstants';
import { COOKIE_URL } from '../constants/AppUrlConstants';
import setAnalyticCookie from '../utils/setAnalyticCookie';

const CookieBanner = ({ isBannerShown, setIsBannerShown }) => {

  const [isAnalyticsButtonClicked, setIsAnalyticsButtonClicked] = useState(false);
  // const [hideCookieBanner, setHideCookieBanner] = useState(false);
  const [isAnalyticsAcceptedOrRejected, setIsAnalyticsAcceptedOrRejected] = useState('');

  console.log('setIsBannerShown', isBannerShown)
  // const location = useLocation();

  // const reloadPage = () => {
  //   if (location.pathname === COOKIE_URL) {
  //     window.location.reload();
  //   }
  //   return;
  // };

  // if (hideCookieBanner) { return null; }

  return (
    <>
      {!isAnalyticsButtonClicked && <div className="govuk-cookie-banner " data-nosnippet role="region" aria-label={`Cookies on ${SERVICE_NAME}`}>
        <div className="govuk-cookie-banner__message govuk-width-container">

          <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">
              <h2 className="govuk-cookie-banner__heading govuk-heading-m">{`Cookies on ${SERVICE_NAME}`}</h2>

              <div className="govuk-cookie-banner__content">
                <p className="govuk-body">We use some essential cookies to make this service work.</p>
                <p className="govuk-body">We&apos;d also like to use analytics cookies so we can understand how you use the service and make improvements.</p>
              </div>
            </div>
          </div>

          <div className="govuk-button-group">
            <button type="button" className="govuk-button" data-module="govuk-button" onClick={() => { setAnalyticCookie(true); setIsAnalyticsButtonClicked(true); setIsAnalyticsAcceptedOrRejected('accepted'); }}>
              Accept analytics cookies
            </button>
            <button type="button" className="govuk-button" data-module="govuk-button" onClick={() => { setAnalyticCookie(false); setIsAnalyticsButtonClicked(true); setIsAnalyticsAcceptedOrRejected('rejected'); }}>
              Reject analytics cookies
            </button>
            {/* <a className="govuk-link" href="#">View cookies</a> */}
          </div>
        </div>
      </div>}

      {isAnalyticsButtonClicked && <div className="govuk-cookie-banner " data-nosnippet role="region" aria-label="Cookies on [name of service]">
        <div className="govuk-cookie-banner__message govuk-width-container">

          <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">

              <div className="govuk-cookie-banner__content">
                <p className="govuk-body" data-testid="cookieMessage">{`You've ${isAnalyticsAcceptedOrRejected} analytics cookies. You can `}
                  {/* No option to change cookies currently, this will be built later*/}
                  <Link className="govuk-link" to={COOKIE_URL}>change your cookie settings </Link>
                  at any time.
                </p>
              </div>
            </div>
          </div>

          <div className="govuk-button-group">
            <button className="govuk-button" data-module="govuk-button" type="button" onClick={() => { setIsBannerShown(false); }}>
              Hide cookie message
            </button>
          </div>
        </div>
      </div>}
    </>
  );
};

export default CookieBanner;
