import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  DISPLAY_DETAILS,
  FIELD_TEXT,
  SINGLE_PAGE_FORM,
  VALIDATE_REQUIRED,
} from '../../../constants/AppConstants';
import DisplayForm from '../../DisplayForm';

describe('Details component tests', () => {
  const handleSubmit = jest.fn();
  const scrollIntoViewMock = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;
  const formActions = {
    submit: {
      label: 'Submit test button',
    },
  };
  const formFieldsWithValue = [
    {
      type: FIELD_TEXT,
      displayType: DISPLAY_DETAILS,
      label: 'Field with a default value label',
      hint: 'This is a hint for the details input',
      fieldName: 'fieldWithValue',
      linkText: 'The details link text',
      value: 'test value',
    },
  ];
  const formFieldsWithoutValue = [
    {
      type: FIELD_TEXT,
      displayType: DISPLAY_DETAILS,
      label: 'Field that has no default value',
      fieldName: 'fieldWithNoValue',
      linkText: 'Open details',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter your email address',
        },
      ],
    },
  ];

  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('should render a submit button if exist', () => {
    render(
      <MemoryRouter>
        <DisplayForm
          formId="testForm"
          fields={formFieldsWithValue}
          formActions={formActions}
          formType={SINGLE_PAGE_FORM}
          handleSubmit={handleSubmit}
        />
      </MemoryRouter>,
    );
    expect((screen.getByTestId('submit-button')).outerHTML).toEqual('<button type="submit" class="govuk-button" data-module="govuk-button" data-testid="submit-button">Submit test button</button>');
  });

  it('should render a details component with an input with a default value', () => {
    render(
      <MemoryRouter>
        <DisplayForm
          formId="testForm"
          fields={formFieldsWithValue}
          formActions={formActions}
          formType={SINGLE_PAGE_FORM}
          handleSubmit={handleSubmit}
        />
      </MemoryRouter>,
    );
    expect(screen.getByLabelText('Field with a default value label')).toBeInTheDocument();
    expect(screen.getByText('This is a hint for the details input').outerHTML).toEqual('<div id="fieldWithValue-hint" class="govuk-hint">This is a hint for the details input</div>');
    expect(screen.getByRole('textbox', { name: 'Field with a default value label' })).toBeInTheDocument();
    expect(screen.getByTestId('details-component').outerHTML).toEqual('<details class="govuk-details" data-module="govuk-details" data-testid="details-component"><summary class="govuk-details__summary"><span class="govuk-details__summary-text">The details link text</span></summary><div class="govuk-details__text"><label class="govuk-label" for="fieldWithValue-input">Field with a default value label</label><div id="fieldWithValue-hint" class="govuk-hint">This is a hint for the details input</div><p id="fieldWithValue-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> </p><input class="govuk-input" id="fieldWithValue-input" name="fieldWithValue" type="text" aria-describedby="fieldWithValue-hint" value="test value"></div></details>');
  });

  it('should render a closed details component with an input without a default value', () => {
    // TODO: by default I think we should render details open when there is a value
    // so need to add that to the details component
    // at which point this test should fail
    // and then add a variable to state it renders closed
    // and then update object values here so test will pass
    render(
      <MemoryRouter>
        <DisplayForm
          formId="testForm"
          fields={formFieldsWithoutValue}
          formActions={formActions}
          formType={SINGLE_PAGE_FORM}
          handleSubmit={handleSubmit}
        />
      </MemoryRouter>,
    );
    expect(screen.getByLabelText('Field that has no default value')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Field that has no default value' })).toBeInTheDocument();
    expect(screen.getByTestId('details-component').outerHTML).toEqual('<details class="govuk-details" data-module="govuk-details" data-testid="details-component"><summary class="govuk-details__summary"><span class="govuk-details__summary-text">Open details</span></summary><div class="govuk-details__text"><label class="govuk-label" for="fieldWithNoValue-input">Field that has no default value</label><div id="fieldWithNoValue-hint" class="govuk-hint"></div><p id="fieldWithNoValue-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> </p><input class="govuk-input" id="fieldWithNoValue-input" name="fieldWithNoValue" type="text" value=""></div></details>');
  });

  it('should open details if there are errors', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <DisplayForm
          formId="testForm"
          fields={formFieldsWithoutValue}
          formActions={formActions}
          formType={SINGLE_PAGE_FORM}
          handleSubmit={handleSubmit}
        />
      </MemoryRouter>,
    );
    expect(screen.getByLabelText('Field that has no default value')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Submit test button' }));
    // the key piece of the html is it has ` open="">` at the end of `<details `
    await waitFor(() => {
      expect(screen.getByTestId('details-component').outerHTML).toEqual('<details class="govuk-details" data-module="govuk-details" data-testid="details-component" open=""><summary class="govuk-details__summary"><span class="govuk-details__summary-text">Open details</span></summary><div class="govuk-details__text"><label class="govuk-label" for="fieldWithNoValue-input">Field that has no default value</label><div id="fieldWithNoValue-hint" class="govuk-hint"></div><p id="fieldWithNoValue-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Enter your email address</p><input class="govuk-input govuk-input--error" id="fieldWithNoValue-input" name="fieldWithNoValue" type="text" value=""></div></details>');
    });
  });

  it('should remain open if there were errors, but user has begun typing and error is removed', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <DisplayForm
          formId="testForm"
          fields={formFieldsWithoutValue}
          formActions={formActions}
          formType={SINGLE_PAGE_FORM}
          handleSubmit={handleSubmit}
        />
      </MemoryRouter>,
    );
    expect(screen.getByLabelText('Field that has no default value')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Submit test button' }));
    await user.type(screen.getByRole('textbox', { name: 'Field that has no default value' }), 'a');
    // the key piece of the html is it has ` open="">` at the end of `<details `
    await waitFor(() => {
      expect(screen.getByTestId('details-component').outerHTML).toEqual('<details class="govuk-details" data-module="govuk-details" data-testid="details-component" open=""><summary class="govuk-details__summary"><span class="govuk-details__summary-text">Open details</span></summary><div class="govuk-details__text"><label class="govuk-label" for="fieldWithNoValue-input">Field that has no default value</label><div id="fieldWithNoValue-hint" class="govuk-hint"></div><p id="fieldWithNoValue-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> </p><input class="govuk-input" id="fieldWithNoValue-input" name="fieldWithNoValue" type="text" value=""></div></details>');
    });
  });
});
