import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  FIELD_TEXT,
  SINGLE_PAGE_FORM,
  VALIDATE_FIELD_MATCH,
  VALIDATE_FIELD_MATCH_CASE_SENSITIVE,
  VALIDATE_MIN_LENGTH,
  VALIDATE_REQUIRED,
} from '../../../constants/AppConstants';
import DisplayForm from '../../DisplayForm';
/*
 * These tests check that fields with special validation rules
 * error when those rules are not met and don't
 * error when the rules are met
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
  let scrollIntoViewMock = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;
  const formActionsSubmitOnly = {
    submit: {
      label: 'Submit test button',
    },
  };
  const formMinimumLengthTextInput = [
    {
      type: FIELD_TEXT,
      label: 'Text input',
      fieldName: 'testField',
      validation: [
        {
          type: VALIDATE_MIN_LENGTH,
          message: 'Field must be a minimum of 8 characters',
          condition: 8,
        },
      ],
    }
  ];
  const formCaseSensitiveMatching = [
    {
      type: FIELD_TEXT,
      label: 'Text input',
      fieldName: 'testField',
    },
    {
      type: FIELD_TEXT,
      label: 'Repeating text input',
      fieldName: 'testFieldRepeating',
      validation: [
        {
          type: VALIDATE_FIELD_MATCH_CASE_SENSITIVE,
          message: 'Fields must match',
          condition: 'testField',
        },
      ],
    }
  ];
  const formFieldMatching = [
    {
      type: FIELD_TEXT,
      label: 'Text input',
      fieldName: 'testField',
    },
    {
      type: FIELD_TEXT,
      label: 'Repeating text input',
      fieldName: 'testFieldRepeating',
      validation: [
        {
          type: VALIDATE_FIELD_MATCH,
          message: 'Fields must match',
          condition: 'testField',
        },
      ],
    }
  ];
  const formMultipleValidationRules = [
    {
      type: FIELD_TEXT,
      label: 'Text input',
      fieldName: 'testField',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter your text input value',
        },
        {
          type: VALIDATE_MIN_LENGTH,
          message: 'Field must be a minimum of 8 characters',
          condition: 8,
        },
      ],
    }
  ];
  const formWithBackwardsValidationOrder = [
    {
      type: FIELD_TEXT,
      label: 'Text input',
      fieldName: 'testField',
      validation: [
        {
          type: VALIDATE_MIN_LENGTH,
          message: 'Field must be a minimum of 8 characters',
          condition: 8,
        },
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter your text input value',
        },
      ],
    }
  ];

  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('should return an error if a minimum character count is not met', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <DisplayForm
          formId="testForm"
          fields={formMinimumLengthTextInput}
          formActions={formActionsSubmitOnly}
          formType={SINGLE_PAGE_FORM}
          handleSubmit={handleSubmit}
        />
      </MemoryRouter>
    );
    await user.type(screen.getByLabelText('Text input'), 'Ab');
    await user.click(screen.getByRole('button', { name: 'Submit test button' }));

    expect(screen.getByText('There is a problem').outerHTML).toEqual('<h2 class="govuk-error-summary__title" id="error-summary-title">There is a problem</h2>');
    expect(screen.getAllByText('Field must be a minimum of 8 characters')).toHaveLength(2);
    // Error summary has the error message as a button and correct class
    expect(screen.getByRole('button', { name: 'Field must be a minimum of 8 characters' }).outerHTML).toEqual('<button class="govuk-button--text">Field must be a minimum of 8 characters</button>');
    // Input field has the error class attached
    expect(screen.getByRole('textbox', { name: 'Text input' }).outerHTML).toEqual('<input class="govuk-input govuk-input--error" id="testField-input" name="testField" type="text" value="">');
  });

  it('should return an error if case sensitive match fields do not match', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <DisplayForm
          formId="testForm"
          fields={formCaseSensitiveMatching}
          formActions={formActionsSubmitOnly}
          formType={SINGLE_PAGE_FORM}
          handleSubmit={handleSubmit}
        />
      </MemoryRouter>
    );
    await user.type(screen.getByLabelText('Text input'), 'Abcd');
    await user.type(screen.getByLabelText('Repeating text input'), 'AbcD');
    await user.click(screen.getByRole('button', { name: 'Submit test button' }));

    expect(screen.getByText('There is a problem').outerHTML).toEqual('<h2 class="govuk-error-summary__title" id="error-summary-title">There is a problem</h2>');
    expect(screen.getAllByText('Fields must match')).toHaveLength(2);
    // Error summary has the error message as a button and correct class
    expect(screen.getByRole('button', { name: 'Fields must match' }).outerHTML).toEqual('<button class="govuk-button--text">Fields must match</button>');
    // Input field has the error class attached
    expect(screen.getByRole('textbox', { name: 'Repeating text input' }).outerHTML).toEqual('<input class="govuk-input govuk-input--error" id="testFieldRepeating-input" name="testFieldRepeating" type="text" value="">');
  });

  it('should NOT return an error if NON case sensitive match fields do not match', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <DisplayForm
          formId="testForm"
          fields={formFieldMatching}
          formActions={formActionsSubmitOnly}
          formType={SINGLE_PAGE_FORM}
          handleSubmit={handleSubmit}
        />
      </MemoryRouter>
    );
    await user.type(screen.getByLabelText('Text input'), 'Abcd');
    await user.type(screen.getByLabelText('Repeating text input'), 'AbcD');
    await user.click(screen.getByRole('button', { name: 'Submit test button' }));

    expect(screen.queryByText('There is a problem')).not.toBeInTheDocument();
    expect(screen.queryByText('Fields must match')).not.toBeInTheDocument();
  });

  it('should return the error for the first failing validation rule if there are multiple rules', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <DisplayForm
          formId="testForm"
          fields={formMultipleValidationRules}
          formActions={formActionsSubmitOnly}
          formType={SINGLE_PAGE_FORM}
          handleSubmit={handleSubmit}
        />
      </MemoryRouter>
    );
    await user.click(screen.getByRole('button', { name: 'Submit test button' }));

    expect(screen.getByText('There is a problem').outerHTML).toEqual('<h2 class="govuk-error-summary__title" id="error-summary-title">There is a problem</h2>');
    expect(screen.getAllByText('Enter your text input value')).toHaveLength(2);
    // Error summary has the error message as a button and correct class
    expect(screen.getByRole('button', { name: 'Enter your text input value' }).outerHTML).toEqual('<button class="govuk-button--text">Enter your text input value</button>');
    // Input field has the error class attached
    expect(screen.getByRole('textbox', { name: 'Text input' }).outerHTML).toEqual('<input class="govuk-input govuk-input--error" id="testField-input" name="testField" type="text" value="">');
  });

  it('should return the error for the first failing validation rule based on the validation switch order - regardless of the form object order', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <DisplayForm
          formId="testForm"
          fields={formWithBackwardsValidationOrder}
          formActions={formActionsSubmitOnly}
          formType={SINGLE_PAGE_FORM}
          handleSubmit={handleSubmit}
        />
      </MemoryRouter>
    );
    await user.click(screen.getByRole('button', { name: 'Submit test button' }));

    expect(screen.getByText('There is a problem').outerHTML).toEqual('<h2 class="govuk-error-summary__title" id="error-summary-title">There is a problem</h2>');
    expect(screen.getAllByText('Enter your text input value')).toHaveLength(2);
    // Error summary has the error message as a button and correct class
    expect(screen.getByRole('button', { name: 'Enter your text input value' }).outerHTML).toEqual('<button class="govuk-button--text">Enter your text input value</button>');
    // Input field has the error class attached
    expect(screen.getByRole('textbox', { name: 'Text input' }).outerHTML).toEqual('<input class="govuk-input govuk-input--error" id="testField-input" name="testField" type="text" value="">');
  });
});
