# Form Creator

This app has an in built form creator with reusable components for if you wish to add more forms.


- [Form action options](#FormActionOptions)
- [Field type options](#FieldTypeOptions)
- <a href="https://github.com/UKHomeOffice/nmsw-ui/blob/main/docs/form_creator_example.md">Create a new form - step by step example</a>
- <a href="https://github.com/UKHomeOffice/nmsw-ui/blob/main/docs/form_creator_new_input_type.md">Creating a new input type</a>
- [Structure diagram for reference](#StructureDiagram) (updated November 2022)
----

## Form Action Options

TODO:
- dataModule: remove from the parameters and code into the DisplayForm button section as it is always govuk-button
- dataTestid: remove from the parameters and code, it shouldn't be needed as we can use type for finding button
- type: remove from the parameters and code, it should always be button
- replace using govuk-button className with buttonPrimary constant
- replace using govuk-button govuk-button--secondary with buttonSecondary constant

Requirements:

Your `Page` must contain 
- a `handleSubmit` function for submit actions
- a `handleCancel` function for cancel actions (optional)

Object structure:

```
[action]: {
  className: [required],
  label: [required],
}
```

Parameters:

### action
- submit : triggers the `handleSubmit` function from your parent `Page`
- cancel: triggers the `handleCancel` function from your parent `Page`

### className
- `govuk-button`: applies the style for the visually primary button of the page - mainly used for submit
- `govuk-button govuk-button--secondary` : applies the style for teh visually secondary button(s) of the page - mainly used for cancel

### label
The words you wish to show on your button

----

<<<<<<< HEAD

_TODO: refactor Add formActions in DisplayForm to map the form actions rather than specify directly. And then update these docs_

### 1. <a id="AddFormActions"></a>Add formActions

Go to the page or component file you want to add your form to (or create your page if it's for a new page).

Determine which form actions you need
 - submit
 - cancel
 - save and come back later **NOT YET ADDED TO CODE**

Determine which styling each requires
 - primary button (usually for main submit)
 - secondary button (usually for cancel)
 - text button (usually for save and come back later type submits)

Create an object of formActions for your form

```javascript
  const formActions = {
    submit: {
      className: 'govuk-button',
      dataModule: 'govuk-button',
      dataTestid: 'submit-button',
      label: 'Save',
      type: 'button',
    },
    cancel: {
      className: 'govuk-button govuk-button--secondary',
      dataModule: 'govuk-button',
      dataTestid: 'submit-button',
      label: 'Cancel',
      type: 'button',
    }
  };
```

### 2. <a id="AddFormFields"></a>Add formFields

Create an object of formFields for your form

_For this example we'll add a text input of type text, a set of 3 radio buttons, and our new date input_

```javascript
const formFields = [
    {
      type: FIELD_TEXT,
      label: 'First name',
      hint: 'Enter your first name',
      fieldName: 'firstName',
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
    },
    {
      type: FIELD_DATE,
      label: 'Sample date field',
      hint: 'Enter a date',
      fieldName: 'myDate',
      grouped: true,
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
    },
    {
      type: FIELD_DATE,
      label: 'Sample date field',
      hint: 'Enter a date',
      fieldName: 'myDate',
      grouped: true,
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
- calling the Validator and setting any errors it returns
- scrolling to the form element (so user is taken to where the errors display) if there are errors
- where to navigate to if there are not errors
- what to do with the data from the form (PATCH, POST, etc.)

If you use a confirmation page
- you must include the form name
- you must include the next page link and the name it relates to
- you *may* include a reference number if you have one available

```javascript
 const handleSubmit = async (e, formData) => {
    e.preventDefault();
    const formErrors = await Validator({ formData: formData.formData, formFields: formFields });
    setErrors(formErrors);

    if (formErrors.length < 1) {
      navigate(
        FORM_CONFIRMATION_URL,
        {
          state: {
            formName: 'Example form',
            nextPageLink: DASHBOARD_URL,
            nextPageName: DASHBOARD_PAGE_NAME,
            // referenceNumber: referenceNumber // only include referenceNumber if you will receive one from your API POST/PATCH call, otherwise leave this out
          }
        }
      );
    } else {
      scrollToTop();
    }
  };
```

### 5. <a id="AddHandleCancel"></a>Add handleCancel

_TODO: Add a handleCancel example_

### 6. <a id="AddDisplayForm"></a>Add <DisplayForm> to your return

Add the DisplayForm component to your return

```javascript
  return (
    <div className="govuk-grid-row">
      <h1>Second page</h1>
      <DisplayForm
        formId='formSecondPage'
        errors={errors}
        fields={formFields}
        formActions={formActions}
        handleSubmit={handleSubmit}
        setErrors={setErrors}
      />
    </div >
  );
```

### Your final page component will then look something like this:

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FIELD_DATE,
  FIELD_RADIO,
  FIELD_TEXT,
  CHECKED_FALSE,
  VALIDATE_MIN_LENGTH,
  VALIDATE_REQUIRED,
} from '../../constants/AppConstants';
import { DASHBOARD_PAGE_NAME, DASHBOARD_URL, FORM_CONFIRMATION_URL } from '../../constants/AppUrlConstants';
import DisplayForm from '../../components/DisplayForm';
import { scrollToTop } from '../../utils/scrollToElement';
import Validator from '../../utils/Validator';

const SecondPage = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState();
  const referenceNumber = '123';

  const formActions = {
    submit: {
      className: 'govuk-button',
      dataModule: 'govuk-button',
      dataTestid: 'submit-button',
      label: 'Save',
      type: 'button',
    },
    cancel: {
      className: 'govuk-button--secondary',
      dataModule: 'govuk-button',
      dataTestid: 'submit-button',
      label: 'Cancel',
      type: 'button',
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
    },
    {
      type: FIELD_DATE,
      label: 'Sample date field',
      hint: 'Enter a date',
      fieldName: 'myDate',
      grouped: true,
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter your date',
        },
      ],
    },
  ];

  const handleSubmit = async (e, formData) => {
    e.preventDefault();
    const formErrors = await Validator({ formData: formData.formData, formFields: formFields });
    setErrors(formErrors);

    if (formErrors.length < 1) {
      navigate(
        FORM_CONFIRMATION_URL,
        {
          state: {
            formName: 'Example form',
            nextPageLink: DASHBOARD_URL,
            nextPageName: DASHBOARD_PAGE_NAME,
            referenceNumber: referenceNumber
          }
        }
      );
    } else {
      scrollToTop();
    }
  };

  return (
    <div className="govuk-grid-row">
      <h1>Second page</h1>
      <DisplayForm
        formId='formSecondPage'
        errors={errors}
        fields={formFields}
        formActions={formActions}
        handleSubmit={handleSubmit}
        setErrors={setErrors}
      />
    </div >
  );
};

export default SecondPage;
```
=======
## Field Type Options
>>>>>>> fd8db67 (Add form action options)

Standard inputs
- [Autocomplete](#Autocomplete)
- [Radio buttons](#RadioButtons)
- [Radio buttons with conditional text field(s)](#Conditionals)
- [Text input](#TextInput)

Specific inputs
- TODO: [Date](#Date)
- [Email](#Email)
- [Password](#Password)

### Autocomplete

Requirements

- The API endpoint that allows GETting the data for this field. It must be an endpoint that allows for search/filter based on a string passed to it

Object structure

```
{
  type: FIELD_AUTOCOMPLETE,
  dataAPIEndpoint: [required],
  fieldName: [required],
  hint: [optional]
  label: [required],
  responseKey: [required],
  additionalKey: [OPTIONAL: additional data key],
  validation: [
    {
      type: [rule],
      message: [error message],
    },
  ],
}
```

Parameters

### type
Import and use `FIELD_AUTOCOMPLETE` from `src/constants/AppConstants`

### dataAPIEndpoint
The url for the API where we can get the list of options to display within the autocomplete field.
It must be an endpoint setup to allow for search/filter based on what the user has typed into the autocomplete field.

### fieldName
A string that will be used for `name` and to create `id` and other field references.

### hint (optional)
An optional string

### label
A string that will be shown as the question/label text for the field

### responseKey
The key from the API data set returned that lets us find the value to display in the input (e.g. `name` )

### additionalResponseKey (optional)
An additional key if two fields are required to create a name (e.g. key: `name` and additionalKey: `unlocode` for ports)

----

## Structure Diagram

_Last updated November 2022_

<a href="https://raw.githubusercontent.com/UKHomeOffice/nmsw-ui/main/docs/formComposerDiagram.png"><img src="https://raw.githubusercontent.com/UKHomeOffice/nmsw-ui/main/docs/formComposerDiagram.png" alt="Form constructor diagram" title="Form constructor diagram" height="150" /></a>
