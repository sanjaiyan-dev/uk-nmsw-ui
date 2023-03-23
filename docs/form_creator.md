# Form Creator

This app has an in built form creator with reusable components for if you wish to add more forms.

## DisplayForm
- [Display Form](#display-form)
- [File Upload Form](#file-upload-form)

## Field actions
- [Form action options](#form-action-options)

## Field types
Every input can be displayed as a single field, set of grouped fields, or contained within a `<details>` component. By default, inputs are treated as single field unless otherwise specified.

- [Display types](#display-types)

[Standard inputs](#standard-inputs)
- [Autocomplete](#autocomplete)
- [Radio buttons](#radio-buttons)
- [Radio buttons with conditional text field(s)](#conditionals)
- [Text input](#text-input)

[Specific inputs](#specific-inputs)
- [Email](#email)
- [Password](#password)
- [Phone Number](#phone-number)

[Validating fields](#validating-fields)
- [required](#required)
- [Conditional](#conditional)
- [Email Format](#email-format)
- [Match](#match)
- [Maximum Length](#maximum-length)
- [Minimum Length](#minimum-length)
- [No Spaces](#no-spaces)
- [Phone Number Format](#phone-number-format)

## SinglePage Forms
- [Single Page Form](#single-page-forms)

## MultiPage Forms
- [Multi Page Form](#multi-page-forms)


## Other guides
- <a href="https://github.com/UKHomeOffice/nmsw-ui/blob/main/docs/form_creator_example.md">Create a new form - step by step example</a>
- <a href="https://github.com/UKHomeOffice/nmsw-ui/blob/main/docs/form_creator_new_input_type.md">Creating a new input type</a>
- [Structure diagram for reference](#StructureDiagram) (updated November 2022)
----

## Display Form

Structure:
```javascript
<DisplayForm
  formId=<required>
  fields={formFields}
  formActions={formActions}
  formType=<required>
  isLoading=<optional boolean>
  keepSessionOnSubmit={state?.redirectURL ? true : false}
  pageHeading=<required>
  removeApiErrors=<optional>
  handleSubmit={handleSubmit}
/>
```

You can also pass children to the component
e.g. if you have a SupportingText component you would pass as follows:
```javascript
<DisplayForm
  formId=<required>
  fields={formFields}
  formActions={formActions}
  formType=<required>
  isLoading=<optional boolean>
  pageHeading=<required>
  removeApiErrors=<optional>
  handleSubmit={handleSubmit}
>
  <SupportingText />
</DisplayForm>
```

Parameters

### formId
An identifier for your form element

### formFields
Must always be {formFields} which you must define within the component that is calling the DisplayForm component. (see [Field Types](#field-actions))

### formAction
Must always be {formAction} which you must define within the component that is calling the DisplayForm component. (see [Form Action Options](#form-action-options))

### formType
Can be `SINGLE_PAGE_FORM` - if the form has one page. This will clear any session data for the form when `submit` or `back` are clicked

Or `MULTI_PAGE_FORM` - if the form has multiple pages. This will persist session data as the user moves through the form and only clear it when they go to another section of the site.

When using MULTI_PAGE_FORM you should add a `sessionStorage.removeItem('formData')` within the handleSubmit of the last page of your form.

We also have `SIGN_IN_FORM` and `PASSWORD_FORM` for some specific use cases. These should not be used for other forms.

### isLoading

When passed to `DisplayForm` as `true`, the submit action button is `disabled`.

In your container page, set `isLoading` to `false` in your useState so that on page load it is false.

Then set it to `true` before TRYing your API call. This prevents the submit button starting multiple attempts if a user clicks more than once.

### keepSessionOnSubmit

Passed in as `state?.redirectURL ? true : false` this allows the DisplayForm renderer to check if there is a `redirectURL` present in state and persist the session data for use by the next page.

Usually used for when we redirect users to sign-in if their token becomes invalid, as we want them to be able to return to where they were without loss of data.

See more in [Single page forms](#single-page-forms) below.


### pageHeading
What will be the h1 of your page. We have to pass it to the form to display as any error summary is shown ABOVE the h1

### removeApiError

Currently only used by the /sign-in page where we set a page level error as a result of the API returning a 'username/password combination not valid' error.

This is only useful if you need a specific page level error, and allows us to callback to clear the error state.

### handleSubmit
Your handleSubmit action from the page

----

## File Upload Form

Structure:
```javascript
<FileUploadForm
  endpoint=<required>
  errorMessageMapFile=<optional>
  fileNameRequired=<required>
  fileTypesAllowed=<required>
  formId=<required>
  pageHeading=<required>
  submitButtonLabel=<required>
  urlSuccessPage=<required>
  urlThisPage=<required>
>
  <SupportingText />
</FileUploadForm>
```
Parameters
### endpoint
Created on the container page and passed to this page.

e.g.
```javascript
endpoint={`${API_URL}${ENDPOINT_DECLARATION_PATH}/${declarationId}${ENDPOINT_FILE_UPLOAD_GENERAL_DECLARATION_PATH}`}
```

### errorMessageMapFile
If you do not want to use the field level error messages that are returned from the POST to the file upload endpoint (for FAL forms), you can add a mapping file and pass it through here to the file upload component, which will then use that to determine what error wording to display.

### fileNameRequired
The name of the file we expect the user to upload here. This is used in the error message if the file is missing when they attempt to submit.

e.g. `General Declaration FAL 1` or `Supporting documents`

### fileTypesAllowed
A string that can be used in error messages to alert the user to which file types are allowed, should they attempt to upload an invalid one.

e.g. `csv or xlsx` or `png, jpg or jpeg`

### formId
An identifier for your form element

### pageHeading
What will be the h1 of your page. We have to pass it to the form to display as any error summary is shown ABOVE the h1

### submittButtonLabel
The words to display on the submit button

e.g. `Check for errors`

### urlSuccessPage
The page to load next if we receive a success response from the file upload endpoint.

## urlThisPage
The url for the current page, should a users auth token become in valid, or we receive a 500 error we can load the relevant page, and put `this` page's url into state so we can enable a link for the user to return to `this` file upload page (with state persisted).

----

## Form Action Options

TODO across codebase:
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

```javascript
<action>: {
  label: <required>,
}
```

If cancel button include the redirectUrl:

```javascript
<action>: {
  label: <required>,
  redirectURL: <required>,
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

### redirectURL
The page you want to redirect the user to if they click cancel

----

## Display Types

Sometimes an input needs to be contained with the GDS `<details>` tags to allow users control over whether to interact with it or not.

Some inputs must be grouped with a fieldset e.g. radio buttons and checkboxes, conditional fields.

_A `DISPLAY_PASSWORD` type exists but it covers a specific use case where we need to display supporting text within the form (see ChangeYourPassword.jsx)_

To create one, when you define your input (see input options below) you need to include the params:
- `displayType: <type>`
- `linkText: <required/optional>`

If you forget to specify a display type, it will default to `DISPLAY_SINGLE`.

Parameters

### displayType
Import and use
- `DISPLAY_DETAILS` for detail components
- `DISPLAY_GROUPED` for grouped inputs
- `DISPLAY_SINGLE` for everything else

### linkText
This is required for a `DISPLAY_DETAILS` type as this is the text that will show on the detail summary to be clicked on

It should NOT be used for the other types as it is redundant for them.

### examples

#### details

```javascript
{
  type: FIELD_EMAIL,
  displayType: DISPLAY_DETAILS,
  fieldName: 'emailAddress',
  label: 'Email address',
  value: state?.dataToSubmit?.emailAddress,
  linkText: 'Change where the email was sent',
  validation: [
    {
      type: VALIDATE_REQUIRED,
      message: 'Enter your email address',
    },
    {
      type: VALIDATE_EMAIL_ADDRESS,
      message: 'Enter a real email address',
    },
  ],
},
```

#### grouped

```javascript
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
      message: 'Select yes if your company is a shipping agent',
    },
  ],
},
```



----

## Standard Inputs

----

## Autocomplete

Requirements

- A dataset to search on

_Note the current InputAutocomplete works with a local dataset, in future we will have one that works with an API endpoint_

Object structure

```javascript
{
  type: FIELD_AUTOCOMPLETE,
  dataSet: <required>,
  fieldName: <required>
  hint: <optional>
  label: <required>
  responseKey: <required>
  additionalKey: <optional>
  displayAdditionalKey: <boolean required>
  responseKeyPrefix: <optional>
  additionalKeyPrefix: <optional>
  additionalKeySuffix: <optional>
}
```

Parameters

### type
Import and use `FIELD_AUTOCOMPLETE` from `src/constants/AppConstants`

### dataSet
Import your dataset and use it here

### fieldName
A string that will be used for `name` and to create `id` and other field references.

### hint (optional)
An optional string

### label
A string that will be shown as the question/label text for the field

### responseKey
The key from the API data set returned that lets us find the value to display in the input (e.g. `name` )

### additionalKey (optional)
An additional key if two fields are required to create a name (e.g. key: `name` and additionalKey: `unlocode` for ports)

### displayAdditionalKey
If no additionalKey always set this to `false`
Otherwise if you HAVE an additional key the options are:

- `true` : the additionalKey will be used for both searching and in the display
- `false` : the additionalKey will only be used for searching and will not be displayed to a user

### responseKeyPrefix (optional)
If defined, this string will appear before the responseKey's value that is returned from the dataset

_e.g. responseKeyPrefix = '-', responseKey.value = 'abc' then the display in the combobox/list will show '-abc'_

### responseKeySuffix (optional)
If defined, this string will appear after the responseKey's value that is returned from the dataset

_e.g. responseKeySuffix = '.', responseKey.value = 'abc' then the display in the combobox/list will show 'abc.'_

### additionalKeyPrefix (optional)
If defined, this string will appear before the additionalKey's value that is returned from the dataset

_e.g. additionalKeyPrefix = '+', additionalKey.value = '12' then the display in the combobox/list will show '+12'_

### additionalKeySuffix (optional)
If defined, this string will appear after the additionalKey's value that is returned from the dataset

_e.g. additionalKeySuffix = ' ', additionalKey.value = '12' then the display in the combobox/list will show '12 '_

If you combine all prefix/suffix options shown above your display will have '+12 -abc.'


----

## Radio Buttons

TODO in codebase:
- replace using the className of `govuk-radios` or `govuk-radios govuk-radios--inline` with constants for vertical/horizontal
- replace need for specifying grouped = true and build that into the DetermineFieldType switch statement for ease (radio buttons are always grouped)
- use `fieldName` to add the name to the option in InputRadio.jsx, removing the need to repeat it in each radioOption

Requirements

n/a

Object structure

```javascript
{
  type: FIELD_RADIO,
  className: <required>,
  displayType: DISPLAY_GROUPED,
  fieldName: <required>,
  hint: <optional>
  label: <required>,
  labelAsH1: <optional: true / false>,
  radioOptions: [
    {
      label: <required>,
      name: <required>,
      value: <required>,
      checked: <optional>
    },
  ],
},
```

Parameters

### type
Import and use `FIELD_RADIO` from `src/constants/AppConstants`

### className
Radio buttons can be aligned vertically (`govuk-radios`) or horizontally (`govuk-radios govuk-radios--inline`)

### fieldName
A string that will be used for `name` and to create `id` and other field references.

### grouped
Always specify this as `true` as radio buttons are grouped inputs and use a different fieldset/label html structure.
This is defined within `src/components/formFields/DetermineFieldType` and at some point we will refactor this so that `displayType: DISPLAY_GROUPED,` does not need to be specified within the field object

### hint (optional)
An optional string

### label
A string that will be shown as the question/label text for the field

### labelAsH1
When the label is also the h1, set this to true. This ensure the h1 tag and styling is applied

### radioOptions
- label: A string that will be shown as the associated label text for the field
- name: must be the same as `fieldName` as it is the name of the radio button set
- value: The value that will be stored and used if the radio button is checked
- checked: optional, if set to `true` then the radio button will default to checked on render

----

## Conditional

A list of radio buttons where one or more of the radio options can have an associated text input. The text input is only shown/validated/value stored if it's associated radio button is checked.

TODO in codebase:
- replace using the className of `govuk-radios` or `govuk-radios govuk-radios--inline` with constants for vertical/horizontal
- replace need for specifying grouped = true and build that into the DetermineFieldType switch statement for ease (radio buttons are always grouped)
- use `fieldName` to add the name to the option in InputRadio.jsx, removing the need to repeat it in each radioOption

Requirements

n/a

Object structure

```javascript
{
  type: FIELD_CONDITIONAL,
  className: <required>,
  displayType: DISPLAY_GROUPED,
  fieldName: <required>,
  hint: <optional>,
  label: <required>,
  radioOptions: [
    {
      radioField: <required>,
      label: <required>,
      name: <required>,
      value: <required>,
    },
    {
      radioField: <required>,
      parentFieldValue: <required>,
      hint: <optional>,
      label: <required>,
      name: <required>,
    },
  ],
},
```

Parameters

### type
Import and use `FIELD_CONDITIONAL` from `src/constants/AppConstants`

### className
Radio buttons can be aligned vertically (`govuk-radios`) or horizontally (`govuk-radios govuk-radios--inline`)

### fieldName
A string that will be used for `name` and to create `id` and other field references.

### grouped
Always specify this as `true` as radio buttons are grouped inputs and use a different fieldset/label html structure.
This is defined within `src/components/formFields/DetermineFieldType` and at some point we will refactor this so that `displayType: DISPLAY_GROUPED,` does not need to be specified within the field object

### hint (optional)
An optional string

### label
A string that will be shown as the question/label text for the field

### radioOptions : radio button
- radioField: set to `true` for this option to be a radio button
- label: A string that will be shown as the associated label text for the field
- name: must be the same as `fieldName` as it is the name of the radio button set
- value: The value that will be stored and used if the radio button is checked

### radioOptions : conditional text input
- radioField: set to `false` for this option to be a conditional text input
- parentFieldValue: the `value` from the associated parent field, this allows us to show/hide/store this field only when parent field is checked
- hint: (optional) An optional string
- label: a string that will be shown as the question/label text for the text input field
- name: a string that will be used for `name` and to create `id` and other field references for the text input


----

## Text Input

Requirements

n/a

Object structure

```javascript
{
  type: FIELD_TEXT,
  displayType: DISPLAY_SINGLE,
  fieldName: <required>,
  hint: <optional>,
  label: <required>
}
```

Parameters

### type
Import and use `FIELD_TEXT` from `src/constants/AppConstants`

### fieldName
A string that will be used for `name` and to create `id` and other field references.

### hint (optional)
An optional string

### label
A string that will be shown as the question/label text for the field

----

## Specific Inputs

----

## Email

Requirements

n/a

Object structure

```javascript
{
  type: FIELD_EMAIL,
  displayType: DISPLAY_SINGLE,
  fieldName: <required>,
  hint: <optional>,
  label: <required>
}
```

Parameters

### type
Import and use `FIELD_EMAIL` from `src/constants/AppConstants`. This ensures field type and autocomplete are set to email.

### fieldName
A string that will be used for `name` and to create `id` and other field references.

### hint (optional)
An optional string

### label
A string that will be shown as the question/label text for the field

----

## Password

Requirements

n/a

Object structure

```javascript
{
  type: FIELD_PASSWORD,
  displayType: DISPLAY_SINGLE,
  fieldName: <required>,
  hint: <optional>,
  label: <required>
}
```

Parameters

### type
Import and use `FIELD_PASSWORD` from `src/constants/AppConstants`. This ensures field type is set to password.

### fieldName
A string that will be used for `name` and to create `id` and other field references.

### hint (optional)
An optional string

### label
A string that will be shown as the question/label text for the field

----

## Phone Number

Requirements

n/a

Object structure

```javascript
{
  type: FIELD_PHONE,
  displayType: DISPLAY_SINGLE,
  fieldName: <required>,
  hint: <optional>,
  label: <required>
}
```

Parameters

### type
Import and use `FIELD_PHONE` from `src/constants/AppConstants`.  This ensures field type and autocomplete are set to tel.

You should always include phone number validation with a phone number field

### fieldName
A string that will be used for `name` and to create `id` and other field references.

### hint (optional)
An optional string

### label
A string that will be shown as the question/label text for the field

----


## Validating Fields
If a field requires validation you add a validation array to the field object.
A field can have no validation array (no rules), an array with one object (rule), or an array with multiple objects (rules)

1. [Rules](#rules)
- [Required](#required)
- [Conditional](#conditional)
- [Email Format](#email-format)
- [Match](#match)
- [Match Case Sensitive](#match-case-sensitive)
- [Maximum Length](#maximum-length)
- [Minimum Length](#minimum-length)
- [No Spaces](#no-spaces)
- [Phone Number Format](#phone-number-format)
2. [Examples](#examples)


### Rules

#### Required
Field is a mandatory field and cannot be null.

```javascript
{
  type: VALIDATE_REQUIRED,
  message: <error message to show in UI>
}
```

#### Conditional
Field is a conditional field and has one or more rules to be validated if that conditional field is visible (i.e. it's parent radio is checked).
The validation is run based on the rules entered in the nested `condition` object.

```javascript
{
  type: VALIDATE_CONDITIONAL,
  condition: {
    parentValue: <value of parent field>,
    fieldName: <this conditional field's name>,
    ruleToTest: <rule constant>,
    message: <error message to show in UI>
  },
}
```

#### Email Format
Specifically tests if the value entered matches an email pattern.
This test only runs if there is a value in the field and is ignored if field is null.

```javascript
{
  type: VALIDATE_EMAIL_ADDRESS,
  message: <error message to show in UI>
  },
}
```

#### Match
Specifically tests if the value entered matches the value of another field. This matches regardless of case. e.g `AbC` and `abc` return a match.

```javascript
{
  type: VALIDATE_FIELD_MATCH,
  message: <error message to show in UI>,
  condition: <field name to match>
  },
}
```

#### Match Case Sensitive
Specifically tests if the value entered matches the value of another field including the case. e.g. `AbC` and `abc` do not match.

```javascript
{
  type: VALIDATE_FIELD_MATCH_CASE_SENSITIVE,
  message: <error message to show in UI>,
  condition: <field name to match>
  },
}
```

#### Maximum Length
Specifically tests if the length of the value entered is > the number specified in the `condition` entry.
This test only runs if there is a value in the field and is ignored if field is null. 

```javascript
{
  type: VALIDATE_MAX_LENGTH,
  condition: <maximum length>
  message: <error message to show in UI>
  },
}
```

#### Minimum Length
Specifically tests if the length of the value entered is < the number specified in the `condition` entry.
This test only runs if there is a value in the field and is ignored if field is null.

```javascript
{
  type: VALIDATE_MIN_LENGTH,
  condition: <minimum length>
  message: <error message to show in UI>
  },
}
```


#### No Spaces
Used mainly for fields like passwords, it checks for a [space] and throws an error if any exist anywhere in the string

```javascript
{
  type: VALIDATE_NO_SPACES,
  message: <error message to show in UI>
  },
}
```

#### Phone Number Format
Specifically tests if the value entered matches the accepted phone number pattern (numbers and certain characters and spaces).
This test only runs if there is a value in the field and is ignored if field is null.

```javascript
{
  type: VALIDATE_PHONE_NUMBER,
  message: <error message to show in UI>
  },
}
```


### Examples

e.g. Single validator
```javascript
{
  type: FIELD_TEXT,
  displayType: DISPLAY_SINGLE,
  label: 'First name',
  fieldName: 'firstName',
  validation: [
    {
      type: VALIDATE_REQUIRED,
      message: 'Enter your first name',
    },
  ],
},
```

e.g. Multiple validators
```javascript
{
  type: FIELD_TEXT,
  displayType: DISPLAY_SINGLE,
  label: 'Phone number',
  fieldName: 'phoneNumber',
  validation: [
    {
      type: VALIDATE_REQUIRED,
      message: 'Enter your phone number',
    },
    {
      type: VALIDATE_MIN_LENGTH,
      message: 'Phone numbers must be at least 3 digits long',
    },
    {
      type: VALIDATE_PHONE_NUMBER,
      message: 'Phone numbers must be in the correct format',
    },
  ],
},
```

e.g. Conditionals
```javascript
{
  type: FIELD_CONDITIONAL,
  label: 'What is your favourite animal',
  fieldName: 'favAnimal',
  className: 'govuk-radios',
  displayType: DISPLAY_GROUPED,
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
      label: 'Breed of dog',
      name: 'breedOfDog',
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
        parentValue: 'cat',
        fieldName: 'breedOfCat',
        ruleToTest: VALIDATE_REQUIRED,
        message: 'Enter a breed of cat'
      },
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
  ],
}
```

----

## Single Page Forms
By default single page forms will clear sessionStorage of formData on submit.

For special cases such as when you redirect a user to sign in due to a token expiry and want the user to be able to return to the original form without losing their session data, you can add a `keepSessionOnSubmit` variable to the middle form (in this case sign-in) to tell the form to keep the session data in certain cases.

e.g.
```javascript
 <DisplayForm
  pageHeading="Sign in"
  formId='formSignIn'
  fields={formFields}
  formActions={formActions}
  formType={SINGLE_PAGE_FORM}
  keepSessionOnSubmit={state?.redirectURL ? true : false}
  handleSubmit={handleSubmit}
>
```

----

## Multi Page Forms
If you are creating a multipage form your `handleSubmit` function must include the following:

### First Page
Create a `dataToSubmit` variable and populate it with this page's formData
`const dataToSubmit = { ...formData.formData };`

Within the `navigate` pass the dataToSubmit as state:
`navigate(URL, { state: { dataToSubmit: dataToSubmit } });`

### Step Pages
Create a `dataToSubmit` variable and populate it with the data passed from the previous page, and this page's formData
`const dataToSubmit = { ...state.dataToSubmit, ...formData.formData };`

Within the `navigate` pass the dataToSubmit as state:
`navigate(URL, { state: { dataToSubmit: dataToSubmit } });`

### Final Page
Create a `dataToSubmit` variable and populate it with the formData from state and the current page's formData:
`const dataToSubmit = { ...state.dataToSubmit, ...formData.formData };`

After submit remove all formData from sessionStorage
`sessionStorage.removeItem('formData');`

----
## Structure Diagram

_Last updated November 2022_

<a href="https://raw.githubusercontent.com/UKHomeOffice/nmsw-ui/main/docs/formComposerDiagram.png"><img src="https://raw.githubusercontent.com/UKHomeOffice/nmsw-ui/main/docs/formComposerDiagram.png" alt="Form constructor diagram" title="Form constructor diagram" height="150" /></a>
