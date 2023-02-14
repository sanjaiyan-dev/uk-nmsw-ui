import { useLocation, useNavigate } from 'react-router-dom';
import {
  FIELD_RADIO,
  FIELD_TEXT,
  FIELD_PHONE,
  MULTI_PAGE_FORM,
  VALIDATE_MAX_LENGTH,
  VALIDATE_PHONE_NUMBER,
  VALIDATE_REQUIRED,
  DISPLAY_GROUPED,
  FIELD_AUTOCOMPLETE,
} from '../../constants/AppConstants';
import { REGISTER_EMAIL_RESEND_URL, REGISTER_PASSWORD_URL } from '../../constants/AppUrlConstants';
import { countries } from '../../constants/CountryData';
import { MergePhoneNumberFields } from '../../utils/FormatPhoneNumber';
import DisplayForm from '../../components/DisplayForm';
import Message from '../../components/Message';

const RegisterYourDetails = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  document.title = 'Your details';

  const formActions = {
    submit: {
      label: 'Continue',
    },
  };
  const formFields = [
    {
      type: FIELD_TEXT,
      fieldName: 'fullName',
      label: 'Full name',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter your full name',
        },
      ],
    },
    {
      type: FIELD_TEXT,
      fieldName: 'companyName',
      label: 'Your company name',
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
      responseKey: 'dialCode',
      label: 'International dialling code',
      fieldName: 'dialCode',
      hint: 'For example, 44 for UK',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter an international dialling code',
        },
        {
          type: VALIDATE_PHONE_NUMBER,
          message: 'Enter an international dialling code in the correct format',
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
          message: 'Enter a telephone number in the correct format',
        },
      ],
    },
    {
      type: FIELD_AUTOCOMPLETE,
      fieldName: 'country',
      dataSet: countries,
      responseKey: 'countryName',
      additionalKey: 'alphaCode',
      label: 'Country',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter country',
        },
        {
          type: VALIDATE_MAX_LENGTH,
          message: 'Enter 3 digit country code',
          condition: 3,
        },
      ],
    },
    {
      type: FIELD_RADIO,
      className: 'govuk-radios govuk-radios--inline',
      displayType: DISPLAY_GROUPED,
      fieldName: 'shippingAgent',
      label: 'Is your company a shipping agent?',
      radioOptions: [
        {
          label: 'Yes',
          name: 'shippingAgent',
          value: 'yes',
        },
        {
          label: 'No',
          name: 'shippingAgent',
          value: 'no',
        },
      ],
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Select is your company a shipping agent',
        },
      ],
    },
  ];

  const handleSubmit = async (formData) => {
    const dataToSubmit = {
      ...state?.dataToSubmit,
      ...formData.formData,
      phoneNumber: MergePhoneNumberFields({ diallingCode: formData.formData.diallingCode, telephoneNumber: formData.formData.telephoneNumber }),
    };

    navigate(REGISTER_PASSWORD_URL, { state: { dataToSubmit } });
  };

  /*
   * Without an email address & token we can't submit the PATCH to update the user account
   * So if a user arrives to this page and we do not have an email address in state
   * we need to direct them to a place where they can deal with that
   */
  if (!state?.dataToSubmit?.emailAddress || !state?.dataToSubmit?.token) {
    const buttonProps = {
      buttonLabel: 'Resend confirmation email',
      buttonNavigateTo: REGISTER_EMAIL_RESEND_URL,
    };
    return (
      <Message
        button={buttonProps}
        title="Try again"
        message="The verification link did not work. Resend the email to try again."
      />
    );
  }

  return (
    <DisplayForm
      formId="formRegisterYourDetails"
      fields={formFields}
      formActions={formActions}
      formType={MULTI_PAGE_FORM}
      pageHeading="Your details"
      handleSubmit={handleSubmit}
    />
  );
};

export default RegisterYourDetails;
