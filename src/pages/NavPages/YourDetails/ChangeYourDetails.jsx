import { useNavigate } from 'react-router-dom';
import DisplayForm from '../../../components/DisplayForm';
import {
  FIELD_PHONE,
  FIELD_TEXT,
  SINGLE_PAGE_FORM,
  VALIDATE_MAX_LENGTH,
  VALIDATE_PHONE_NUMBER,
  VALIDATE_REQUIRED,
} from '../../../constants/AppConstants';
import {
  CHANGE_YOUR_DETAILS_PAGE_NAME,
  GENERIC_CONFIRMATION_URL,
  YOUR_DETAILS_PAGE_URL,
} from '../../../constants/AppUrlConstants';

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
      type: FIELD_TEXT,
      label: 'International dialling code',
      fieldName: 'diallingCode',
      hint: 'For example, 44 for UK',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter your international dialling code',
        },
      ],
    },
    {
      type: FIELD_PHONE,
      fieldName: 'phoneNumber',
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
  ];

  const handleSubmit = async () => {
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
