import DisplayForm from '../../components/DisplayForm';
import { FIELD_RADIO } from '../../constants/AppConstants';

const CookiePolicy = () => {

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
          value: 'yes'
        },
        {
          label: 'No',
          name: 'cookieSettings',
          id: 'no',
          value: 'no'
        },
      ]
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submit');
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
