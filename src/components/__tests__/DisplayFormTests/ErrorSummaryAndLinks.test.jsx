import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  DISPLAY_GROUPED,
  FIELD_CONDITIONAL,
  FIELD_RADIO,
  FIELD_TEXT,
  SINGLE_PAGE_FORM,
  VALIDATE_CONDITIONAL,
  VALIDATE_REQUIRED,
} from '../../../constants/AppConstants';
import DisplayForm from '../../DisplayForm';
/*
 * These tests check that if validation fails
 * the errory summary and field level errors are displayed
 * and the links in the summary are generated correctly
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
  const formRequiredRadioInput = [
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
          checked: true,
        },
        {
          label: 'Radio two',
          name: 'radioButtonSet',
          id: 'radioTwo',
          value: 'radioTwo',
          checked: false,
        },
        {
          label: 'Radio three',
          name: 'radioButtonSet',
          id: 'radioThree',
          value: 'radioThree',
          checked: false,
        },
      ],
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Select your radio option',
        },
      ],
    },
  ];

  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('should render error summary & field error if there are field errors', async () => {
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
    await screen.findByText('There is a problem');

    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getByText('There is a problem').outerHTML).toEqual('<h2 class="govuk-error-summary__title" id="error-summary-title">There is a problem</h2>');
    expect(screen.getAllByText('Enter your text input value')).toHaveLength(2);
    // Error summary has the error message as a button and correct class
    expect(screen.getByRole('button', { name: 'Enter your text input value' }).outerHTML).toEqual('<button class="govuk-button--text" type="button">Enter your text input value</button>');
    // Input field has the error class attached
    expect(screen.getByRole('textbox', { name: 'Text input' }).outerHTML).toEqual('<input class="govuk-input govuk-input--error" id="testField-input" name="testField" type="text" aria-describedby="testField-hint" value="">');
  });

  it('should render error summary & field error for a conditional field if there are field errors', async () => {
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

    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getByText('There is a problem').outerHTML).toEqual('<h2 class="govuk-error-summary__title" id="error-summary-title">There is a problem</h2>');
    expect(screen.getAllByText('Enter a breed of cat')).toHaveLength(2);
    // // Error summary has the error message as a button and correct class
    expect(screen.getByRole('button', { name: 'Enter a breed of cat' }).outerHTML).toEqual('<button class="govuk-button--text" type="button">Enter a breed of cat</button>');
    // // Input field has the error class attached
    expect(screen.getByTestId('breedOfCat-container').outerHTML).toEqual('<div data-testid="breedOfCat-container" class="govuk-radios__conditional"><div class="govuk-form-group govuk-form-group--error"><label class="govuk-label" for="breedOfCat-input">Breed of cat</label><div id="breedOfCat-hint" class="govuk-hint"></div><p id="breedOfCat-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Enter a breed of cat</p><input class="govuk-input govuk-!-width-one-third govuk-input--error" id="breedOfCat-input" name="breedOfCat" type="text" value=""></div></div>');
  });

  it('should scroll to erroring field if user clicks an error summary link for a single input field', async () => {
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
    await user.click(screen.getByRole('button', { name: 'Enter your text input value' }));
    expect(scrollIntoViewMock).toHaveBeenCalled();
    expect(screen.getByRole('textbox', { name: /Text input/i })).toHaveFocus();
  });

  it('should scroll to erroring field if user clicks an error summary link for a radio button set', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <DisplayForm
          formId="testForm"
          fields={formRequiredRadioInput}
          formActions={formActionsSubmitOnly}
          formType={SINGLE_PAGE_FORM}
          handleSubmit={handleSubmit}
        />
      </MemoryRouter>,
    );
    await user.click(screen.getByRole('button', { name: 'Submit test button' }));
    await user.click(screen.getByRole('button', { name: 'Select your radio option' }));
    expect(scrollIntoViewMock).toHaveBeenCalled();
    expect(screen.getByRole('radio', { name: /Radio one/i })).toHaveFocus();
  });
});
