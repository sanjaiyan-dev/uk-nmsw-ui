# Form Creator

Below is a step by step example of creating a new form using the creator components.

## <a id="CreateForm"></a>Create a form

1. [Add formActions](#AddFormActions)
2. [Add formFields](#AddFormFields)
3. [Add validation rules (if required)](#AddValidationRunes)
4. [Add handleSubmit ](#AddHandleSubmit)
6. [Add <DisplayForm> to your return](#AddDisplayForm)

### 1. <a id="AddFormActions"></a>Add formActions

Go to the page or component file you want to add your form to (or create your page if it's for a new page).

Determine which form actions you need
 - submit
 - cancel

Create an object of formActions for your form

```javascript
  const formActions = {
    submit: {
      label: 'Save',
    },
    cancel: {
      label: 'Cancel',
      redirect_URL: YOUR_VOYAGES_URL
    }
  };
```

### 2. <a id="AddFormFields"></a>Add formFields

Create an object of formFields for your form

_For this example we'll add a text input of type text and a set of 3 radio buttons_

```javascript
const formFields = [
    {
      type: FIELD_TEXT,
      displayType: DISPLAY_SINGLE,
      fieldName: 'firstName',
      hint: 'Enter your first name',
      label: 'First name',
    },
    {
      type: FIELD_RADIO,
      className: 'govuk-radios',
      displayType: DISPLAY_GROUPED,
      fieldName: 'favouriteColour',
      label: 'What is your favourite colour',
      radioOptions: [
        {
          checked: CHECKED_FALSE,
          id: 'red',
          label: 'Red',
          name: 'favouriteColour',
          value: 'red',
        },
        {
          checked: CHECKED_FALSE,
          id: 'blue',
          label: 'Blue',
          name: 'favouriteColour',
          value: 'blue',
        },
        {
          checked: CHECKED_FALSE,
          id: 'green',
          label: 'Green',
          name: 'favouriteColour',
          value: 'green',
        },
        {
          checked: CHECKED_FALSE,
          id: 'other',
          label: 'Other',
          name: 'favouriteColour',
          value: 'other',
        },
      ],
    },
  ];

  ```

### 3. <a id="AddValidationRules"></a>Add validation rules (if required)

Into your formField object, add any validation rules for each field.

Each field can take multiple rules, they're tested in the order you provide them and the first rule to fail is the one displayed to the user.

_NOTE: If you have a new type of validation, you can add it's rule to the `src/utils/Validator.jsx` file._

Example rule types
- VALIDATE_REQUIRED : field must not be empty
- VALIDATE_MIN_LENGTH : if field is not empty then it must have at least the specified number of characters in it
- VALIDATE_EMAIL_ADDRESS : if field is not empty, then it must match a regex test for including `@` and `.xx` where x is any letter

Validation objects must have a type and a message, and if there are additional conditions (such as min length) a condition.

_For this example we will require the text field to have a min length of 2 characters and the date field to be completed._

```javascript
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
        {
          type: VALIDATE_MIN_LENGTH,
          message: 'First name must be a minimum of 2 characters',
          condition: 2,
        },
      ],
    },
    {
      type: FIELD_RADIO,
      label: 'What is your favourite colour',
      fieldName: 'favouriteColour',
      className: 'govuk-radios',
      displayType: DISPLAY_GROUPED,
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
    },
    {
      type: FIELD_DATE,
      label: 'Sample date field',
      hint: 'Enter a date',
      fieldName: 'myDate',
      displayType: DISPLAY_GROUPED,
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter your date',
        },
      ],
    },
  ];
```

### 4. <a id="AddHandleSubmit"></a>Add handleSubmit 

_TODO: Add an example API call once those are built_

Add your handleSubmit function. You need to include:
- what to do with the data from the form (PATCH, POST, etc.)
- where to navigate to if the action completes successfully
- what to do if the action fails

If you use a confirmation page
- you must include the form name
- you must include the next page link and the name it relates to
- you *may* include a reference number if you have one available

```javascript
 const handleSubmit = async (formData) => {
    setIsLoading(true);
    const dataToSubmit = {
      email: formData.formData.emailAddress,
    };

    try {
      const response = await axios.post('/to-my-endpoint', dataToSubmit);
      // TODO: FORM_CONFIRMATION_URL is not used anymmore - remove when we update docs 
      navigate(FORM_CONFIRMATION_URL, { state: { 
        formName: 'Email form', 
        nextPageLink: HOME_PAGE_URL,
        nextPageName: HOME_PAGE_NAME, 
        referenceNumber: response?.data?.referenceNumber
      } } );
      setIsLoading(false);
    } catch (err) {
      navigate(GENERIC_MESSAGE_URL, { state: { 
        title: 'Something went wrong', 
        message: err?.data?.message,
        redirectURL: THIS_PAGE,
      } } );
    }
  };
```

### 6. <a id="AddDisplayForm"></a>Add <DisplayForm> to your return

Add the DisplayForm component to your return

```javascript
  return (
    <DisplayForm
      formId='myForm'
      fields={formFields}
      formActions={formActions}
      formType={SINGLE_PAGE_FORM}
      isLoading={isLoading}
      keepSessionOnSubmit={state?.redirectURL ? true : false}
      pageHeading='My form'
      handleSubmit={handleSubmit}
    />
  );
```

### Your final page component will then look something like this:

```javascript
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  CHECKED_FALSE,
  DISPLAY_GROUPED,
  DISPLAY_SINGLE,
  FIELD_RADIO,
  FIELD_TEXT,
  SINGLE_PAGE_FORM,
  VALIDATE_MIN_LENGTH,
  VALIDATE_REQUIRED,
} from '../../constants/AppConstants';
import {
  FORM_CONFIRMATION_URL,
  LOGGED_IN_LANDING,
  MESSAGE_URL,
  YOUR_VOYAGES_URL,
} from '../../constants/AppUrlConstants';
import DisplayForm from '../../components/Forms/DisplayForm';

const MyForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const formActions = {
    submit: {
      label: 'Save',
    },
    cancel: {
      label: 'Cancel',
      redirect_URL: YOUR_VOYAGES_URL,
    },
  };

  const formFields = [
    {
      type: FIELD_TEXT,
      displayType: DISPLAY_SINGLE,
      fieldName: 'firstName',
      hint: 'Enter your first name',
      label: 'First name',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter your first name',
        },
        {
          type: VALIDATE_MIN_LENGTH,
          message: 'First name must be a minimum of 2 characters',
          condition: 2,
        },
      ],
    },
    {
      type: FIELD_RADIO,
      className: 'govuk-radios',
      displayType: DISPLAY_GROUPED,
      fieldName: 'favouriteColour',
      label: 'What is your favourite colour',
      radioOptions: [
        {
          checked: CHECKED_FALSE,
          id: 'red',
          label: 'Red',
          name: 'favouriteColour',
          value: 'red',
        },
        {
          checked: CHECKED_FALSE,
          id: 'blue',
          label: 'Blue',
          name: 'favouriteColour',
          value: 'blue',
        },
        {
          checked: CHECKED_FALSE,
          id: 'green',
          label: 'Green',
          name: 'favouriteColour',
          value: 'green',
        },
        {
          checked: CHECKED_FALSE,
          id: 'other',
          label: 'Other',
          name: 'favouriteColour',
          value: 'other',
        },
      ],
    },
  ];

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    const dataToSubmit = {
      email: formData.formData.emailAddress,
    };

    try {
      const response = await axios.post('/to-my-endpoint', dataToSubmit);
      navigate(FORM_CONFIRMATION_URL, {
        state: {
          formName: 'Email form',
          nextPageLink: LOGGED_IN_LANDING,
          nextPageName: LOGGED_IN_LANDING,
          referenceNumber: response?.data?.referenceNumber,
        },
      });
      setIsLoading(false);
    } catch (err) {
      navigate(MESSAGE_URL, {
        state: {
          title: 'Something went wrong',
          message: err?.data?.message,
          redirectURL: YOUR_VOYAGES_URL,
        },
      });
    }
  };

  return (
    <DisplayForm
      formId="myForm"
      fields={formFields}
      formActions={formActions}
      formType={SINGLE_PAGE_FORM}
      isLoading={isLoading}
      keepSessionOnSubmit={state?.redirectURL}
      pageHeading="My form"
      handleSubmit={handleSubmit}
    />
  );
};

export default MyForm;

```