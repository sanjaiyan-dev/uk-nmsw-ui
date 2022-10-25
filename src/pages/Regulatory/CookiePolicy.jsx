import { useState } from 'react';
import PropTypes from 'prop-types';
import CookieConfirmation from '../../components/CookieConfirmation';
import DisplayForm from '../../components/DisplayForm';
import { FIELD_RADIO, RADIO_TRUE, RADIO_FALSE } from '../../constants/AppConstants';
import cookieToFind from '../../utils/cookieToFind';
import setAnalyticCookie from '../../utils/setAnalyticCookie';

const CookiePolicy = ({ setIsCookieBannerShown }) => {

  const [isConfirmationShown, setIsConfirmationShown] = useState(false);
  const cookiePreference = cookieToFind('cookiePreference');

  let selected = cookiePreference === true ? RADIO_TRUE : RADIO_FALSE;

  const formActions = {
    submit: {
      className: 'govuk-button',
      dataModule: 'govuk-button',
      dataTestid: 'save-button',
      label: 'Save cookie settings',
      type: 'button',
    }
  };
  const formFields = [
    {
      type: FIELD_RADIO,
      label: 'Do you want to accept analytics cookies?',
      fieldName: 'cookieSettings',
      className: 'govuk-radios',
      grouped: true,
      radioOptions: [
        {
          label: 'Yes',
          name: 'cookieSettings',
          id: 'yes',
          value: RADIO_TRUE,
          checked: selected === RADIO_TRUE
        },
        {
          label: 'No',
          name: 'cookieSettings',
          id: 'no',
          value: RADIO_FALSE,
          checked: selected === RADIO_FALSE
        },
      ]
    },
  ];

  const handleSubmit = (e, formData) => {
    e.preventDefault();
    if (formData.formData.cookieSettings === RADIO_TRUE) {
      setAnalyticCookie(true);
      setIsCookieBannerShown(false);
      setIsConfirmationShown(true);
    } else {
      setAnalyticCookie(false);
      setIsCookieBannerShown(false);
      setIsConfirmationShown(true);
    }
  };

  return (
    <>
      {isConfirmationShown && <CookieConfirmation />}
      <h1 className="govuk-heading-l">Cookies</h1>
      <h2 className="govuk-heading-l">Change your cookie settings</h2>
      <DisplayForm
        formId='changeYourCookieSettings'
        fields={formFields}
        formActions={formActions}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default CookiePolicy;

CookiePolicy.propTypes = {
  setIsCookieBannerShown: PropTypes.func.isRequired,
};
