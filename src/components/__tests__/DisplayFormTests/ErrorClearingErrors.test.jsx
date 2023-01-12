import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  FIELD_CONDITIONAL,
  FIELD_PHONE,
  FIELD_TEXT,
  SINGLE_PAGE_FORM,
  VALIDATE_CONDITIONAL,
  VALIDATE_PHONE_NUMBER,
  VALIDATE_REQUIRED,
} from '../../../constants/AppConstants';
import DisplayForm from '../../DisplayForm';
/*
 * These tests check if an error is triggered that it is cleared
 * when the user interacts with the erroring field.
 * It does NOT test a specific form structure or wording
 * (that is done on the page that hold the specific form)
 */

const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

describe('Display Form', () => {
  const handleSubmit = jest.fn();
  const scrollIntoViewMock = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;
  const formActionsSubmitOnly = {
    submit: {
      label: 'Submit test button',
    },
  };
  const formRequiredConditionalTextInput = [
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
            message: 'Enter a breed of dog',
          },
        },
        {
          type: VALIDATE_CONDITIONAL,
          condition: {
            parentValue: 'cat',
            fieldName: 'breedOfCat',
            ruleToTest: VALIDATE_REQUIRED,
            message: 'Enter a breed of cat',
          },
        },
      ],
    },
  ];
  const formRequiredPhoneNumberInput = [
    {
      type: FIELD_PHONE,
      label: 'Phone input',
      hint: 'This is a hint for a phone input',
      fieldName: 'testPhoneField',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter your phone value',
        },
        {
          type: VALIDATE_PHONE_NUMBER,
          message: 'Enter your phone value',
        },
      ],
    },
  ];
  const formRequiredTextInput = [
    {
      type: FIELD_TEXT,
      label: 'Text input',
      hint: 'This is a hint for a text input',
      fieldName: 'testField',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter your text input value',
        },
      ],
    },
  ];

  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('should clear the error message when user interacts with the field', async () => {
    // the setErrors function should clear the error message from the field when it is called from this scenario
    // we will test that it does clear in Cypress tests
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <DisplayForm
          formId="testForm"
          fields={formRequiredTextInput}
          formActions={formActionsSubmitOnly}
          formType={SINGLE_PAGE_FORM}
          handleSubmit={handleSubmit}
        />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: 'Submit test button' }));
    // Input field has the error class attached as component rendered with errors > 0
    expect(screen.getByRole('textbox', { name: 'Text input' }).outerHTML).toEqual('<input class="govuk-input govuk-input--error" id="testField-input" name="testField" type="text" aria-describedby="testField-hint" value="">');
    // user starts to type
    await user.type(screen.getByRole('textbox', { name: 'Text input' }), 'Hello');
    // error class and message is cleared
    expect(screen.getByRole('textbox', { name: 'Text input' }).outerHTML).toEqual('<input class="govuk-input" id="testField-input" name="testField" type="text" aria-describedby="testField-hint" value="">');
  });

  it('should clear a conditional field error if a user selects a new radio option', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <DisplayForm
          formId="testForm"
          fields={formRequiredConditionalTextInput}
          formActions={formActionsSubmitOnly}
          formType={SINGLE_PAGE_FORM}
          handleSubmit={handleSubmit}
        />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('radio', { name: 'Cat' }));
    await user.click(screen.getByRole('button', { name: 'Submit test button' }));

    expect(screen.getByText('There is a problem').outerHTML).toEqual('<h2 class="govuk-error-summary__title" id="error-summary-title">There is a problem</h2>');
    expect(screen.getAllByText('Enter a breed of cat')).toHaveLength(2);
    // // Error summary has the error message as a button and correct class
    expect(screen.getByRole('button', { name: 'Enter a breed of cat' }).outerHTML).toEqual('<button class="govuk-button--text">Enter a breed of cat</button>');
    // // Input field has the error class attached
    expect(screen.getByTestId('breedOfCat-container').outerHTML).toEqual('<div data-testid="breedOfCat-container" class="govuk-radios__conditional"><div class="govuk-form-group govuk-form-group--error"><label class="govuk-label" for="breedOfCat-input">Breed of cat</label><div id="breedOfCat-hint" class="govuk-hint"></div><p id="breedOfCat-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Enter a breed of cat</p><input class="govuk-input govuk-!-width-one-third govuk-input--error" id="breedOfCat-input" name="breedOfCat" type="text" value=""></div></div>');

    await user.click(screen.getByRole('radio', { name: 'Rabbit' }));
    expect(screen.queryByText('Enter a breed of cat')).not.toBeInTheDocument();
    // // Input field does not have the error class attached
    expect(screen.getByTestId('breedOfCat-container').outerHTML).toEqual('<div data-testid="breedOfCat-container" class="govuk-radios__conditional govuk-radios__conditional--hidden"><div class="govuk-form-group"><label class="govuk-label" for="breedOfCat-input">Breed of cat</label><div id="breedOfCat-hint" class="govuk-hint"></div><p id="breedOfCat-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> </p><input class="govuk-input govuk-!-width-one-third" id="breedOfCat-input" name="breedOfCat" type="text" value=""></div></div>');
  });

  it('should clear a phone number field error if a user types in either field', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <DisplayForm
          formId="testForm"
          fields={formRequiredPhoneNumberInput}
          formActions={formActionsSubmitOnly}
          formType={SINGLE_PAGE_FORM}
          handleSubmit={handleSubmit}
        />
      </MemoryRouter>,
    );

    // trigger error
    await user.click(screen.getByRole('button', { name: 'Submit test button' }));
    expect(screen.getAllByText('Enter your phone value')).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Enter your phone value' }).outerHTML).toEqual('<button class="govuk-button--text">Enter your phone value</button>');
    expect(screen.getByRole('textbox', { name: 'Country phone code field' }).outerHTML).toEqual('<input class="govuk-input govuk-input--width-5 phoneNumber-input_country-code govuk-input--error" id="testPhoneField-input[0]" name="testPhoneFieldCountryPhoneCode" type="text" inputmode="numeric" aria-describedby="testPhoneField-hint" value="">');
    expect(screen.getByRole('textbox', { name: 'Phone number field' }).outerHTML).toEqual('<input class="govuk-input govuk-input--error" id="testPhoneField-input[1]" name="testPhoneFieldPhoneNumber" type="tel" autocomplete="tel" aria-describedby="testPhoneField-hint" value="">');

    // typing in phone number field should clear error
    await user.type(screen.getByRole('textbox', { name: 'Phone number field' }), '1');
    expect(screen.queryByText('Enter your phone value')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Country phone code field' }).outerHTML).toEqual('<input class="govuk-input govuk-input--width-5 phoneNumber-input_country-code" id="testPhoneField-input[0]" name="testPhoneFieldCountryPhoneCode" type="text" inputmode="numeric" aria-describedby="testPhoneField-hint" value="">');
    expect(screen.getByRole('textbox', { name: 'Phone number field' }).outerHTML).toEqual('<input class="govuk-input" id="testPhoneField-input[1]" name="testPhoneFieldPhoneNumber" type="tel" autocomplete="tel" aria-describedby="testPhoneField-hint" value="1">');

    // trigger error again
    screen.getByRole('textbox', { name: 'Phone number field' }).setSelectionRange(0, 14);
    await user.keyboard('{delete}');
    await user.click(screen.getByRole('button', { name: 'Submit test button' }));
    expect(screen.getAllByText('Enter your phone value')).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Enter your phone value' }).outerHTML).toEqual('<button class="govuk-button--text">Enter your phone value</button>');
    expect(screen.getByRole('textbox', { name: 'Country phone code field' }).outerHTML).toEqual('<input class="govuk-input govuk-input--width-5 phoneNumber-input_country-code govuk-input--error" id="testPhoneField-input[0]" name="testPhoneFieldCountryPhoneCode" type="text" inputmode="numeric" aria-describedby="testPhoneField-hint" value="">');
    expect(screen.getByRole('textbox', { name: 'Phone number field' }).outerHTML).toEqual('<input class="govuk-input govuk-input--error" id="testPhoneField-input[1]" name="testPhoneFieldPhoneNumber" type="tel" autocomplete="tel" aria-describedby="testPhoneField-hint" value="">');

    // typing in Country phone code field should clear error
    await user.type(screen.getByRole('textbox', { name: 'Country phone code field' }), '1');
    expect(screen.queryByText('Enter your phone value')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Country phone code field' }).outerHTML).toEqual('<input class="govuk-input govuk-input--width-5 phoneNumber-input_country-code" id="testPhoneField-input[0]" name="testPhoneFieldCountryPhoneCode" type="text" inputmode="numeric" aria-describedby="testPhoneField-hint" value="1">');
    expect(screen.getByRole('textbox', { name: 'Phone number field' }).outerHTML).toEqual('<input class="govuk-input" id="testPhoneField-input[1]" name="testPhoneFieldPhoneNumber" type="tel" autocomplete="tel" aria-describedby="testPhoneField-hint" value="">');
  });
});
