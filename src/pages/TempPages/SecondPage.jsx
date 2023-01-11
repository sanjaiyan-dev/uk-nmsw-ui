import { useNavigate } from 'react-router-dom';
import {
  FIELD_AUTOCOMPLETE,
  FIELD_CONDITIONAL,
  FIELD_TEXT,
  FIELD_RADIO,
  CHECKED_FALSE,
  SINGLE_PAGE_FORM,
  VALIDATE_CONDITIONAL,
  VALIDATE_REQUIRED,
} from '../../constants/AppConstants';
import {
  YOUR_VOYAGES_PAGE_NAME,
  YOUR_VOYAGES_URL,
  FORM_CONFIRMATION_URL,
  SECOND_PAGE_URL,
  SIGN_IN_URL
} from '../../constants/AppUrlConstants';
import DisplayForm from '../../components/DisplayForm';
import { countries } from './TempMockList-countries';
import { portList } from './TempMockList-portList';

const SecondPage = () => {
  const navigate = useNavigate();

  const formActions = {
    submit: {
      label: 'Save',
    },
    cancel: {
      label: 'Cancel',
      redirectURL: YOUR_VOYAGES_URL
    }
  };
  const formFields = [
    {
      type: FIELD_TEXT,
      label: 'First name',
      hint: 'Enter your first name',
      fieldName: 'firstName',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter your first name',
        },
      ],
    },
    {
      type: FIELD_RADIO,
      label: 'What is your favourite colour',
      fieldName: 'favouriteColour',
      className: 'govuk-radios',
      grouped: true,
      radioOptions: [
        {
          label: 'Red',
          name: 'favouriteColour',
          id: 'red',
          value: 'red',
          checked: CHECKED_FALSE
        },
        {
          label: 'Blue',
          name: 'favouriteColour',
          id: 'blue',
          value: 'blue',
          checked: CHECKED_FALSE
        },
        {
          label: 'Green',
          name: 'favouriteColour',
          id: 'green',
          value: 'green',
          checked: CHECKED_FALSE
        },
        {
          label: 'Other',
          name: 'favouriteColour',
          id: 'other',
          value: 'other',
          checked: CHECKED_FALSE
        },
      ],
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Select your favourite colour',
        },
      ],
    },
    {
      type: FIELD_CONDITIONAL,
      label: 'What is your favourite animal',
      fieldName: 'favAnimal',
      className: 'govuk-radios',
      grouped: true,
      radioOptions: [
        {
          radioField: true,
          label: 'Cat',
          name: 'favAnimal',
          value: 'cat',
        },
        {
          radioField: false,
          parentFieldValue: 'cat',
          label: 'Breed of cat',
          name: 'breedOfCat',
        },
        {
          radioField: true,
          label: 'Dog',
          name: 'favAnimal',
          value: 'dog',
        },
        {
          radioField: false,
          parentFieldValue: 'dog',
          hint: 'What sort of dogs do you like?',
          label: 'Breed of dog',
          name: 'breedOfDog',
        },
        {
          radioField: true,
          label: 'Rabbit',
          name: 'favAnimal',
          value: 'rabbit',
        },
        {
          radioField: true,
          label: 'Other',
          name: 'favAnimal',
          value: 'other',
        },
      ],
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Select your favourite animal',
        },
        {
          type: VALIDATE_CONDITIONAL,
          condition: {
            parentValue: 'dog',
            fieldName: 'breedOfDog',
            ruleToTest: VALIDATE_REQUIRED,
            message: 'Enter a breed of dog'
          },
        },
        {
          type: VALIDATE_CONDITIONAL,
          condition: {
            parentValue: 'cat',
            fieldName: 'breedOfCat',
            ruleToTest: VALIDATE_REQUIRED,
            message: 'Enter a breed of cat'
          },
        }
      ],
    },
    {
      type: FIELD_AUTOCOMPLETE,
      label: 'Select your country',
      fieldName: 'country',
      dataAPIEndpoint: countries,
      responseKey: 'name',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Select your country from the list',
        },
      ],
    },
    {
      type: FIELD_AUTOCOMPLETE,
      label: 'Select your port',
      fieldName: 'port',
      dataAPIEndpoint: portList,
      responseKey: 'name',
      additionalKey: 'unlocode',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Select your port from the list',
        },
      ],
    },
  ];

  const handleSubmit = ({ formData }) => {
    let referenceNumber;
    if (formData.countryExpandedDetails?.country && formData.portExpandedDetails?.port) {
      referenceNumber = `CountryCode: ${formData.countryExpandedDetails.country.code}, Port: ${formData.portExpandedDetails.port.unlocode}`;
    } else {
      referenceNumber = `Country: ${formData.country}, Port: ${formData.port}`;
    }

    navigate(
      FORM_CONFIRMATION_URL,
      {
        state: {
          formName: 'Second page',
          nextPageLink: YOUR_VOYAGES_URL,
          nextPageName: YOUR_VOYAGES_PAGE_NAME,
          referenceNumber: referenceNumber
        }
      }
    );
  };

  const forceSignIn = () => {
    navigate(SIGN_IN_URL, { state: { redirectURL: SECOND_PAGE_URL }});
  };

  return (
    <>
      <h1>Second page</h1>
      <p>Click this button to test going to sign in page with navigation state</p>
      <button onClick={forceSignIn}>Force sign in</button>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-three-quarters">
          <DisplayForm
            formId='formSecondPage'
            fields={formFields}
            formActions={formActions}
            formType={SINGLE_PAGE_FORM}
            handleSubmit={handleSubmit}
          />
        </div >
      </div>
    </>
  );
};

export default SecondPage;
