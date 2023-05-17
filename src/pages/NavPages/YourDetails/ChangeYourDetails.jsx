import { useNavigate } from 'react-router-dom';
import DisplayForm from '../../../components/DisplayForm';
import {
  AUTOCOMPLETE_DIALCODE,
  FIELD_AUTOCOMPLETE,
  FIELD_PHONE,
  FIELD_TEXT,
  SINGLE_PAGE_FORM,
  VALIDATE_PHONE_NUMBER,
  VALIDATE_REQUIRED,
} from '../../../constants/AppConstants';
import {
  CHANGE_YOUR_DETAILS_PAGE_NAME,
  GENERIC_CONFIRMATION_URL,
  YOUR_DETAILS_PAGE_URL,
} from '../../../constants/AppUrlConstants';
import { countries } from '../../../constants/CountryData';
import { MergePhoneNumberFields } from '../../../utils/FormatPhoneNumber';
import '../../../assets/css/autocomplete.scss';

const ChangeYourDetails = () => {
  const navigate = useNavigate();

  const formActions = {
    submit: {
      label: 'Continue',
    },
  };
  const formFields = [
    {
      type: FIELD_TEXT,
      label: 'Full name',
      fieldName: 'fullName',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter your full name',
        },
      ],
    },
    {
      type: FIELD_TEXT,
      label: 'Your company name',
      fieldName: 'companyName',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter your company name',
        },
      ],
    },
    {
      type: FIELD_AUTOCOMPLETE,
      dataSet: countries,
      responseKey: AUTOCOMPLETE_DIALCODE,
      label: 'International dialling code',
      fieldName: 'diallingCode',
      additionalKey: 'countryName',
      displayAdditionalKey: true,
      responseKeyPrefix: '+',
      additionalKeyPrefix: '(',
      additionalKeySuffix: ')',
      hint: 'For example, 44 for UK',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Select an international dialling code',
        },
      ],
    },
    {
      type: FIELD_PHONE,
      fieldName: 'telephoneNumber',
      hint: 'For example, 7123123123',
      label: 'Telephone number',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter a telephone number',
        },
        {
          type: VALIDATE_PHONE_NUMBER,
          message: 'Telephone number must be in the correct format',
        },
      ],
    },
    {
      type: FIELD_AUTOCOMPLETE,
      fieldName: 'country',
      dataSet: countries,
      responseKey: 'countryName',
      additionalKey: 'alphaCode',
      displayAdditionalKey: false,
      label: 'Country',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Select a country',
        },
      ],
    },
  ];

  const handleSubmit = async (formData) => {
    // Format data in preparation for when we add the PATCH
    const dataToSubmit = {
      ...formData.formData,
      countryCode: formData.formData.countryExpandedDetails.country.alphaCode,
      phoneNumber: MergePhoneNumberFields({ diallingCode: formData.formData.diallingCode, telephoneNumber: formData.formData.telephoneNumber }),
    };
    console.log(dataToSubmit);

    navigate(
      GENERIC_CONFIRMATION_URL,
      {
        state: {
          pageTitle: 'Change your details confirmation',
          nextPageLink: YOUR_DETAILS_PAGE_URL,
          nextPageName: 'your details',
          confirmationMessage: 'Your details have been saved',
        },
      },
    );
  };

  return (
    <DisplayForm
      formId="changeYourDetails"
      fields={formFields}
      formActions={formActions}
      formType={SINGLE_PAGE_FORM}
      pageHeading={CHANGE_YOUR_DETAILS_PAGE_NAME}
      handleSubmit={handleSubmit}
    />
  );
};

export default ChangeYourDetails;
