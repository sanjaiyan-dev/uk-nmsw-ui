import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DisplayForm from '../../DisplayForm';
import {
  DISPLAY_GROUPED,
  FIELD_AUTOCOMPLETE,
  FIELD_CONDITIONAL,
  FIELD_EMAIL,
  FIELD_PASSWORD,
  FIELD_PHONE,
  FIELD_RADIO,
  FIELD_TEXT,
  MULTI_PAGE_FORM,
  SIGN_IN_FORM,
  SINGLE_PAGE_FORM,
  VALIDATE_EMAIL_ADDRESS,
  VALIDATE_REQUIRED,
} from '../../../constants/AppConstants';
import { YOUR_VOYAGES_URL } from '../../../constants/AppUrlConstants';

/*
 * These tests check that we can pass a variety of
 * form field objects, and form action objects
 * to the display component
 * and it will return HTML that will display a full form
 * including labels, hints, inputs, buttons based on what we
 * pass in
 * It does NOT test a specific form structure or wording
 * (that is done on the page that hold the specific form)
 */

const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

describe('Display Form default values and session data', () => {
  const handleSubmit = jest.fn();
  const removeApiErrors = jest.fn();
  const scrollIntoViewMock = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;
  const formActions = {
    submit: {
      label: 'Submit test button',
    },
    cancel: {
      label: 'Cancel test button',
      redirectURL: YOUR_VOYAGES_URL,
    },
  };
  const formActionsSubmitOnly = {
    submit: {
      label: 'Submit test button',
    },
  };
  const formSignIn = [
    {
      type: FIELD_EMAIL,
      label: 'Email',
      fieldName: 'email',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter your email address',
        },
        {
          type: VALIDATE_EMAIL_ADDRESS,
          message: 'Enter your email address in the correct format, like name@example.com',
        },
      ],
    },
    {
      type: FIELD_PASSWORD,
      label: 'Password',
      fieldName: 'password',
    },
  ];
  const formWithMultipleFields = [
    {
      type: FIELD_AUTOCOMPLETE,
      label: 'Autocomplete input',
      fieldName: 'items',
      hint: 'Hint for Autocomplete input',
      dataSet: [
        {
          name: 'ObjectOne',
          identifier: 'one',
        },
        {
          name: 'ObjectTwo',
          identifier: 'two',
        },
        {
          name: 'ObjectThree',
          identifier: 'three',
        },
      ],
      responseKey: 'name',
      displayAdditionalKey: false,
    },
    {
      type: FIELD_TEXT,
      label: 'Dialling code input',
      hint: 'This is a hint for a dialling code input',
      fieldName: 'testDiallingCodeField',
    },
    {
      type: FIELD_PHONE,
      label: 'Phone input',
      hint: 'This is a hint for a phone input',
      fieldName: 'testPhoneField',
    },
    {
      type: FIELD_TEXT,
      label: 'Text input',
      hint: 'This is a hint for a text input',
      fieldName: 'testField',
    },
    {
      type: FIELD_PASSWORD,
      label: 'Password',
      fieldName: FIELD_PASSWORD,
    },
    {
      type: FIELD_RADIO,
      label: 'This is a radio button set',
      fieldName: 'radioButtonSet',
      className: 'govuk-radios',
      displayType: DISPLAY_GROUPED,
      hint: 'radio hint',
      radioOptions: [
        {
          label: 'Radio one',
          name: 'radioButtonSet',
          id: 'radioOne',
          value: 'radioOne',
          checked: false,
        },
        {
          label: 'Radio two',
          name: 'radioButtonSet',
          id: 'radioTwo',
          value: 'radioTwo',
          checked: false,
        },
      ],
    },
    {
      type: FIELD_CONDITIONAL,
      className: 'govuk-radios',
      label: 'This is a radio set with a conditional field',
      fieldName: 'radioWithConditional',
      hint: 'Hint for conditional set',
      displayType: DISPLAY_GROUPED,
      radioOptions: [
        {
          radioField: true,
          label: 'Option that has a conditional',
          name: 'radioWithConditional',
          value: 'optionWithConditional',
        },
        {
          radioField: false,
          parentFieldValue: 'optionWithConditional',
          label: 'Conditional text input',
          name: 'conditionalTextInput',
        },
        {
          radioField: true,
          label: 'Option without a conditional',
          name: 'radioWithConditional',
          value: 'optionNoConditional',
        },
      ],
    },
  ];
  const formWithDefaultValues = [
    {
      type: FIELD_TEXT,
      label: 'Text input',
      hint: 'This is a hint for a text input',
      fieldName: 'testField',
      value: 'test value',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter your text input value',
        },
      ],
    },
  ];
  const formWithAutocompleteAndAdditionalKey = [
    {
      type: FIELD_AUTOCOMPLETE,
      label: 'Autocomplete input',
      fieldName: 'myItems',
      hint: 'Hint for Autocomplete input',
      dataSet: [
        {
          primary: 'ObjectOne',
          other: 'oneAC',
        },
        {
          primary: 'ObjectTwo',
          other: 'twoAC',
        },
        {
          primary: 'ObjectThree',
          other: 'threeAC',
        },
      ],
      responseKey: 'primary',
      additionalKey: 'other',
      displayAdditionalKey: true,
    },
  ];

  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('should prefill values from formField data if they exist and no session data exists', async () => {
    render(
      <MemoryRouter>
        <DisplayForm
          formId="testForm"
          fields={formWithDefaultValues}
          formActions={formActionsSubmitOnly}
          formType={SINGLE_PAGE_FORM}
          handleSubmit={handleSubmit}
        />
      </MemoryRouter>,
    );
    expect(screen.getByLabelText('Text input')).toHaveValue('test value');
  });

  it('should prefill values from session first if both formField data and session data exists', async () => {
    window.sessionStorage.setItem('formData', JSON.stringify({ testField: 'sessionvalue' }));
    render(
      <MemoryRouter>
        <DisplayForm
          formId="testForm"
          fields={formWithDefaultValues}
          formActions={formActionsSubmitOnly}
          formType={SINGLE_PAGE_FORM}
          handleSubmit={handleSubmit}
        />
      </MemoryRouter>,
    );
    expect(screen.getByLabelText('Text input')).toHaveValue('sessionvalue');
  });

  it('should store form data in the session for use on refresh', async () => {
    const user = userEvent.setup();
    const expectedStoredData = '{"testField":"Hello","radioButtonSet":"radioTwo","radioWithConditional":"optionWithConditional","conditionalTextInput":"world"}';
    render(
      <MemoryRouter>
        <DisplayForm
          formId="testForm"
          fields={formWithMultipleFields}
          formActions={formActionsSubmitOnly}
          formType={SINGLE_PAGE_FORM}
          handleSubmit={handleSubmit}
        />
      </MemoryRouter>,
    );
    await user.type(screen.getByLabelText('Text input'), 'Hello');
    expect(screen.getByLabelText('Text input')).toHaveValue('Hello');
    await user.click(screen.getByRole('radio', { name: 'Radio two' }));
    expect(screen.getByRole('radio', { name: 'Radio two' })).toBeChecked();
    await user.click(screen.getByRole('radio', { name: 'Option that has a conditional' }));
    expect(screen.getByRole('radio', { name: 'Option that has a conditional' })).toBeChecked();
    await user.type(screen.getByLabelText('Conditional text input'), 'world');
    expect(screen.getByLabelText('Conditional text input')).toHaveValue('world');
    expect(window.sessionStorage.getItem('formData')).toStrictEqual(expectedStoredData);
  });

  it('should NOT store form data for a password field in the session for use on refresh', async () => {
    const user = userEvent.setup();
    const expectedStoredData = '{"radioButtonSet":"radioTwo"}';
    render(
      <MemoryRouter>
        <DisplayForm
          formId="testForm"
          fields={formWithMultipleFields}
          formActions={formActionsSubmitOnly}
          formType={SINGLE_PAGE_FORM}
          handleSubmit={handleSubmit}
        />
      </MemoryRouter>,
    );
    await user.type(screen.getByLabelText('Password'), 'MyPassword');
    expect(screen.getByLabelText('Password')).toHaveValue('MyPassword');
    await user.click(screen.getByRole('radio', { name: 'Radio two' }));
    expect(screen.getByRole('radio', { name: 'Radio two' })).toBeChecked();
    expect(window.sessionStorage.getItem('formData')).toStrictEqual(expectedStoredData);
  });

  it('should prefill form with data from session if it exists', async () => {
    const expectedStoredData = '{"testField":"Hello Test Field","radioButtonSet":"radioOne","radioWithConditional":"optionWithConditional","conditionalTextInput":"world","testDiallingCodeField":"+44","testPhoneField":"(123)1.2 3+4-5"}';
    window.sessionStorage.setItem('formData', JSON.stringify({
      testField: 'Hello Test Field', radioButtonSet: 'radioOne', radioWithConditional: 'optionWithConditional', conditionalTextInput: 'world', testDiallingCodeField: '+44', testPhoneField: '(123)1.2 3+4-5',
    }));
    render(
      <MemoryRouter>
        <DisplayForm
          formId="testForm"
          fields={formWithMultipleFields}
          formActions={formActionsSubmitOnly}
          formType={SINGLE_PAGE_FORM}
          handleSubmit={handleSubmit}
        />
      </MemoryRouter>,
    );
    expect(screen.getByLabelText('Text input')).toHaveValue('Hello Test Field');
    expect(screen.getByRole('radio', { name: 'Radio one' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Option that has a conditional' })).toBeChecked();
    expect(screen.getByLabelText('Conditional text input')).toHaveValue('world');
    expect(screen.getByRole('textbox', { name: 'Dialling code input' })).toHaveValue('+44');
    expect(screen.getByRole('textbox', { name: 'Phone input' })).toHaveValue('(123)1.2 3+4-5');
    expect(window.sessionStorage.getItem('formData')).toStrictEqual(expectedStoredData);
  });

  it('should persist Autocomplete field expanded data if the page is refreshed and user clicks on combo box and reselects existing value', async () => {
    const user = userEvent.setup();
    window.sessionStorage.setItem('formData', JSON.stringify({
      items: 'ObjectTwo',
      itemsExpandedDetails: {
        items: {
          identifier: 'two',
          name: 'ObjectTwo',
        },
      },
    }));
    const expectedStoredData = '{"items":"ObjectTwo","itemsExpandedDetails":{"items":{"name":"ObjectTwo","identifier":"two"}}}';
    render(
      <MemoryRouter>
        <DisplayForm
          formId="testForm"
          fields={formWithMultipleFields}
          formActions={formActionsSubmitOnly}
          formType={SINGLE_PAGE_FORM}
          handleSubmit={handleSubmit}
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole('combobox', { name: 'Autocomplete input' })).toHaveValue('ObjectTwo');
    await user.click(screen.getByRole('combobox', { name: 'Autocomplete input' }));
    expect(screen.getByText('ObjectTwo')).toBeInTheDocument();
    expect(screen.queryByText('ObjectOne')).not.toBeInTheDocument();
    expect(screen.queryByText('ObjectThree')).not.toBeInTheDocument();
    await user.click(screen.getByText('ObjectTwo'));

    expect(window.sessionStorage.getItem('formData')).toStrictEqual(expectedStoredData);
  });

  it('should persist Autocomplete field expanded data if the page is refreshed and user clicks on combo box and reselects existing value AND there is an additionalKey displayed', async () => {
    const user = userEvent.setup();
    window.sessionStorage.setItem('formData', JSON.stringify({
      myItems: 'ObjectTwo twoAC',
      myItemsExpandedDetails: {
        myItems: {
          primary: 'ObjectTwo',
          other: 'twoAC',
        },
      },
    }));
    const expectedStoredData = '{"myItems":"ObjectTwo twoAC","myItemsExpandedDetails":{"myItems":{"primary":"ObjectTwo","other":"twoAC"}}}';
    render(
      <MemoryRouter>
        <DisplayForm
          formId="testForm"
          fields={formWithAutocompleteAndAdditionalKey}
          formActions={formActionsSubmitOnly}
          formType={SINGLE_PAGE_FORM}
          handleSubmit={handleSubmit}
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole('combobox', { name: 'Autocomplete input' })).toHaveValue('ObjectTwo twoAC');
    await user.click(screen.getByRole('combobox', { name: 'Autocomplete input' }));
    expect(screen.getByText('ObjectTwo twoAC')).toBeInTheDocument();
    expect(screen.queryByText('ObjectOne oneAC')).not.toBeInTheDocument();
    expect(screen.queryByText('ObjectThree threeAC')).not.toBeInTheDocument();
    await user.click(screen.getByText('ObjectTwo twoAC'));

    expect(window.sessionStorage.getItem('formData')).toStrictEqual(expectedStoredData);
  });

  it('should clear session values of conditional fields if they become hidden', async () => {
    const user = userEvent.setup();
    const expectedStoredData = '{"radioWithConditional":"optionNoConditional","conditionalTextInput":null}';
    render(
      <MemoryRouter>
        <DisplayForm
          formId="testForm"
          fields={formWithMultipleFields}
          formActions={formActionsSubmitOnly}
          formType={SINGLE_PAGE_FORM}
          handleSubmit={handleSubmit}
        />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('radio', { name: 'Option that has a conditional' }));
    await user.type(screen.getByRole('radio', { name: 'Option that has a conditional' }), 'Hello');
    await user.click(screen.getByRole('radio', { name: 'Option without a conditional' }));

    expect(window.sessionStorage.getItem('formData')).toStrictEqual(expectedStoredData);
  });

  it('should clear session data when form is ready to submit', async () => {
    const user = userEvent.setup();
    const expectedStoredData = '{"testField":"Hello Test Field","radioButtonSet":"radioOne"}';
    window.sessionStorage.setItem('formData', JSON.stringify({ testField: 'Hello Test Field', radioButtonSet: 'radioOne' }));
    render(
      <MemoryRouter>
        <DisplayForm
          formId="testForm"
          fields={formWithMultipleFields}
          formActions={formActionsSubmitOnly}
          formType={SINGLE_PAGE_FORM}
          handleSubmit={handleSubmit}
        />
      </MemoryRouter>,
    );
    expect(screen.getByLabelText('Text input')).toHaveValue('Hello Test Field');
    expect(screen.getByRole('radio', { name: 'Radio one' })).toBeChecked();
    expect(window.sessionStorage.getItem('formData')).toStrictEqual(expectedStoredData);

    await user.click(screen.getByRole('button', { name: 'Submit test button' }));
    expect(handleSubmit).toHaveBeenCalled();
    expect(window.sessionStorage.getItem('formData')).toStrictEqual(null);
  });

  it('should NOT clear multipage formsession data when form is ready to submit', async () => {
    const user = userEvent.setup();
    const expectedStoredData = '{"testField":"Hello Test Field","radioButtonSet":"radioOne"}';
    window.sessionStorage.setItem('formData', JSON.stringify({ testField: 'Hello Test Field', radioButtonSet: 'radioOne' }));
    render(
      <MemoryRouter>
        <DisplayForm
          formId="testForm"
          fields={formWithMultipleFields}
          formActions={formActionsSubmitOnly}
          formType={MULTI_PAGE_FORM}
          handleSubmit={handleSubmit}
        />
      </MemoryRouter>,
    );
    expect(screen.getByLabelText('Text input')).toHaveValue('Hello Test Field');
    expect(screen.getByRole('radio', { name: 'Radio one' })).toBeChecked();
    expect(window.sessionStorage.getItem('formData')).toStrictEqual(expectedStoredData);

    await user.click(screen.getByRole('button', { name: 'Submit test button' }));
    expect(handleSubmit).toHaveBeenCalled();
    expect(window.sessionStorage.getItem('formData')).toStrictEqual(expectedStoredData);
  });

  it('should clear session data when form is cancelled', async () => {
    const user = userEvent.setup();
    const expectedStoredData = '{"testField":"Hello Test Field","radioButtonSet":"radioOne"}';
    window.sessionStorage.setItem('formData', JSON.stringify({ testField: 'Hello Test Field', radioButtonSet: 'radioOne' }));
    render(
      <MemoryRouter>
        <DisplayForm
          formId="testForm"
          fields={formWithMultipleFields}
          formActions={formActions}
          formType={SINGLE_PAGE_FORM}
          handleSubmit={handleSubmit}
        />
      </MemoryRouter>,
    );
    expect(screen.getByLabelText('Text input')).toHaveValue('Hello Test Field');
    expect(screen.getByRole('radio', { name: 'Radio one' })).toBeChecked();
    expect(window.sessionStorage.getItem('formData')).toStrictEqual(expectedStoredData);

    await user.click(screen.getByRole('button', { name: 'Cancel test button' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(YOUR_VOYAGES_URL);
    expect(window.sessionStorage.getItem('formData')).toStrictEqual(null);
  });

  it('should not store new session data if form is of type SIGN IN', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <DisplayForm
          formId="testForm"
          fields={formSignIn}
          formActions={formActionsSubmitOnly}
          formType={SIGN_IN_FORM}
          handleSubmit={handleSubmit}
          removeApiErrors={removeApiErrors}

        />
      </MemoryRouter>,
    );
    await user.type(screen.getByRole('textbox', { name: /email/i }), 'testemail@email.com');
    await user.type(screen.getByTestId('password-passwordField'), 'testpassword');
    expect(window.sessionStorage.getItem('formData')).toStrictEqual(null);
  });
});
