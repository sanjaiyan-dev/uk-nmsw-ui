import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DisplayForm from '../../components/Forms/DisplayForm';
import {
  FIELD_RADIO,
  CHECKED_TRUE,
  CHECKED_FALSE,
  SINGLE_PAGE_FORM,
  DISPLAY_GROUPED,
  SERVICE_NAME,
} from '../../constants/AppConstants';
// import { gaToken } from '../../constants/Config';
import cookieToFind from '../../utils/cookieToFind';
import { scrollToElementId } from '../../utils/ScrollToElement';
import setAnalyticCookie from '../../utils/setAnalyticCookie';

const CookiePolicy = ({ setIsCookieBannerShown }) => {
  document.title = 'Cookies';
  const COOKIE_PREFERENCE_YES = 'yes';
  const [isCookieConfirmationShown, setIsCookieConfirmationShown] = useState(false);
  const cookiePreference = cookieToFind('cookiePreference');

  const selected = cookiePreference === true ? CHECKED_TRUE : CHECKED_FALSE;
  // we do not want to persist form selection for this specific form due to the UX
  sessionStorage.removeItem('formData');

  const formActions = {
    submit: {
      label: 'Save cookie settings',
    },
  };
  const formFields = [
    {
      type: FIELD_RADIO,
      label: 'Do you want to accept analytics cookies?',
      fieldName: 'cookieSettings',
      className: 'govuk-radios',
      displayType: DISPLAY_GROUPED,
      radioOptions: [
        {
          label: 'Yes',
          name: 'cookieSettings',
          id: 'yes',
          value: COOKIE_PREFERENCE_YES,
          checked: selected === CHECKED_TRUE,
        },
        {
          label: 'No',
          name: 'cookieSettings',
          id: 'no',
          value: 'no',
          checked: selected === CHECKED_FALSE,
        },
      ],
    },
  ];

  const handleSubmit = (formData) => {
    if (formData.formData.cookieSettings === COOKIE_PREFERENCE_YES) {
      setAnalyticCookie(true);
    } else {
      setAnalyticCookie(false);
    }
    setIsCookieBannerShown(false);
    setIsCookieConfirmationShown(true);

    if (isCookieConfirmationShown) {
      scrollToElementId('cookie-confirmation');
    }
  };

  useEffect(() => {
    if (isCookieConfirmationShown) {
      scrollToElementId('cookie-confirmation');
    }
  }, [isCookieConfirmationShown]);

  return (
    <>
      {isCookieConfirmationShown
        && (
          <div
            className="govuk-notification-banner govuk-notification-banner--success"
            role="alert"
            aria-labelledby="govuk-notification-banner-title"
            data-module="govuk-notification-banner"
            id="cookie-confirmation"
          >
            <div className="govuk-notification-banner__header">
              <h2 className="govuk-notification-banner__title" id="govuk-notification-banner-title">
                Success
              </h2>
            </div>
            <div className="govuk-notification-banner__content">
              <p className="govuk-notification-banner__heading">
                You&apos;ve set your cookie preferences.
              </p>
            </div>
          </div>
        )}
      <h1 className="govuk-heading-xl">Cookies</h1>
      <p className="govuk-body">This service puts small files (known as &apos;cookies&apos;) onto your computer to collect information about how you browse the site.</p>
      <p className="govuk-body">
        Cookies are used to:
      </p>
      <ul className="govuk-list govuk-list--bullet">
        <li>Measure how you use the service so it can be updated and improved based on your needs</li>
        <li>Prevent malicious system usage</li>
        <li>Remember notifications you&apos;ve seen so we do not show them to you again</li>
      </ul>
      <h2 className="govuk-heading-m">How cookies are used</h2>
      <h3 className="govuk-heading-s">Measuring website usage  (Google Analytics)</h3>
      <p className="govuk-body">
        {`We use Google Analytics software (Universal Analytics) to collect information about how you use the ${SERVICE_NAME} service. `}
        We do this to help make sure the site is meeting the needs of its users and to help us make improvements.
      </p>
      <p className="govuk-body">Google Analytics stores information about:</p>
      <ul className="govuk-list govuk-list--bullet">
        <li>{`The pages you visit on ${SERVICE_NAME}`}</li>
        <li>{`How long you spend on each ${SERVICE_NAME} page`}</li>
        <li>How you got to the site</li>
        <li>What you click on while you&apos;re visiting the site</li>
      </ul>

      {/* <table className="govuk-table">
        <thead className="govuk-table__head">
          <tr className="govuk-table__row">
            <th scope="col" className="govuk-table__header govuk-!-width-one-quarter">Cookie Name</th>
            <th scope="col" className="govuk-table__header govuk-!-width-one-half">Cookie Purpose</th>
            <th scope="col" className="govuk-table__header govuk-!-width-one-quarter">Expires After</th>
          </tr>
        </thead>
        <tbody className="govuk-table__body">
          <tr className="govuk-table__row">
            <td className="govuk-table__cell">_ga</td>
            <td className="govuk-table__cell">This is a cookie which is set by Google Analytics to identify unique users of the NMSW service</td>
            <td className="govuk-table__cell">2 years</td>
          </tr>
          <tr className="govuk-table__row">
            <td className="govuk-table__cell">{`_ga-${gaToken}`}</td>
            <td className="govuk-table__cell">
              This is a cookie specific to tracking actions on the NMSW service, once a user has logged in, if the user as consented to cookies being used
            </td>
            <td className="govuk-table__cell">24 hours or until the user navigates to a different domain</td>
          </tr>
        </tbody>
      </table> */}

      <h3 className="govuk-heading-s">
        {`${SERVICE_NAME} Service Cookie Policy`}
      </h3>
      <p className="govuk-body">
        You will see a pop-up welcome message when you first visit the service.
        We&apos;ll ask whether or not you wish to consent to additional analytics cookies being stored on your device for the duration of the session.
        We store information about your consent choice in your browser session.
      </p>
      {/* <table className="govuk-table">
        <thead className="govuk-table__head">
          <tr className="govuk-table__row">
            <th scope="col" className="govuk-table__header govuk-!-width-one-quarter">Cookie Name</th>
            <th scope="col" className="govuk-table__header govuk-!-width-one-half">Cookie Purpose</th>
            <th scope="col" className="govuk-table__header govuk-!-width-one-quarter">Expires After</th>
          </tr>
        </thead>
        <tbody className="govuk-table__body">
          <tr className="govuk-table__row">
            <td className="govuk-table__cell">cookiePreference</td>
            <td className="govuk-table__cell">Tells the service whether you consented to the additional analytics cookies</td>
            <td className="govuk-table__cell">Expires (never??)</td>
          </tr>
        </tbody>
      </table> */}
      <h2 className="govuk-heading-m">Why we need this data</h2>
      <p className="govuk-body">
        {`We use cookie information to enable you to log into the service that we provide and to link information you add into ${SERVICE_NAME} to your account.`}
      </p>
      <p className="govuk-body">
        {'More information about the privacy of the system and the use of and how we store your data can be found on the '}
        <a className="govuk-link" href="https://www.gov.uk/government/publications/personal-information-use-in-borders-immigration-and-citizenship">
          {' Borders, immigration and citizenship: privacy information notice'}
        </a>
      </p>
      <p className="govuk-body">
        Under the Data Protection Act 2018 and General Data Protection Regulation you also have the right to object to and ask to restrict our use of your personal information, and to ask us to rectify or delete your personal information.
        However, there may be a number of legal or other official reasons why we need to continue to keep or use your data.
      </p>
      <p className="govuk-body">
        {'If you want to exercise these rights please email us at: '}
        <a className="govuk-link" href="mailto:subjectaccessrequest@homeoffice.gov.uk">subjectaccessrequest@homeoffice.gov.uk</a>
      </p>
      <h2 className="govuk-heading-l">Change your cookie settings</h2>
      <DisplayForm
        formId="changeYourCookieSettings"
        fields={formFields}
        formActions={formActions}
        formType={SINGLE_PAGE_FORM}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default CookiePolicy;

CookiePolicy.propTypes = {
  setIsCookieBannerShown: PropTypes.func.isRequired,
};
