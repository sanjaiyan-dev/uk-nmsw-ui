import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DisplayForm from '../../components/DisplayForm';
import {
  FIELD_RADIO,
  CHECKED_TRUE,
  CHECKED_FALSE,
  SINGLE_PAGE_FORM,
  DISPLAY_GROUPED,
} from '../../constants/AppConstants';
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
      <h1 className="govuk-heading-l">Cookies</h1>
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
