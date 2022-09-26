import { SERVICE_NAME } from '../constants/AppConstants';
import setAnalyticCookie from '../utils/setAnalyticCookie';

const CookieBanner = () => {

  return (
    <div className="govuk-cookie-banner " data-nosnippet role="region" aria-label={`Cookies on ${SERVICE_NAME}`}>
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
          <button type="button" className="govuk-button" data-module="govuk-button" onClick={() => setAnalyticCookie(true)}>
            Accept analytics cookies
          </button>
          <button type="button" className="govuk-button" data-module="govuk-button" onClick={() => setAnalyticCookie(false)}>
            Reject analytics cookies
          </button>
          {/* <a className="govuk-link" href="#">View cookies</a> */}
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
