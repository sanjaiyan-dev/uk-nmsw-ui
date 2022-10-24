import DisplayForm from '../../components/DisplayForm';
import { FIELD_RADIO, RADIO_TRUE, RADIO_FALSE } from '../../constants/AppConstants';
import cookieToFind from '../../utils/cookieToFind';
import setAnalyticCookie from '../../utils/setAnalyticCookie';

const CookiePolicy = ({ setIsBannerShown }) => {

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
    // Triggers reload if user has no cookiePreference when submitting the form to remove cookieBanner.
    // if (!cookiePreference) {
    //   window.location.reload();
    // }


    if (formData.formData.cookieSettings === RADIO_TRUE) {
      setAnalyticCookie(true);
      setIsBannerShown(false);
    } else {
      setAnalyticCookie(false);
      setIsBannerShown(false);
    }
  };

  return (
    <>
      <h1 className="govuk-heading-l">Cookies</h1>
      <h2 className="govuk-heading-l">Change your cookie settings</h2>
      <DisplayForm
        fields={formFields}
        formActions={formActions}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default CookiePolicy;
