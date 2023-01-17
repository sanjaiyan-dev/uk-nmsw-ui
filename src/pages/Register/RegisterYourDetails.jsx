import { useEffect } from 'react';
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
} from '../../constants/AppConstants';
import { ERROR_VERIFICATION_FAILED_URL, REGISTER_PASSWORD_URL } from '../../constants/AppUrlConstants';
import DisplayForm from '../../components/DisplayForm';

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
      type: FIELD_PHONE,
      fieldName: 'phoneNumber',
      label: 'Phone number',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter your phone number',
        },
        {
          type: VALIDATE_PHONE_NUMBER,
          message: 'Enter your country code and phone number',
        },
      ],
    },
    {
      type: FIELD_TEXT,
      fieldName: 'country',
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
    const dataToSubmit = { ...state?.dataToSubmit, ...formData.formData };
    navigate(REGISTER_PASSWORD_URL, { state: { dataToSubmit } });
  };

  /*
   * Without an email address & token we can't submit the PATCH to update the user account
   * So if a user arrives to this page and we do not have an email address in state
   * we need to direct them to a place where they can deal with that
   * TODO: once we have email verification flow journey replace REGISTER_EMAIL_URL_VERIFIED
   * with a more appropriate page
   */
  useEffect(() => {
    if (!state || !state.dataToSubmit || !state.dataToSubmit.emailAddress || !state.dataToSubmit.token) {
      navigate(ERROR_VERIFICATION_FAILED_URL);
    }
  }, [state]);

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
