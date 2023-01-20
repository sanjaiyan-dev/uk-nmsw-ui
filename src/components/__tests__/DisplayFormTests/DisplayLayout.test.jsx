import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import {
  DISPLAY_DETAILS,
  DISPLAY_GROUPED,
  DISPLAY_SINGLE,
  FIELD_RADIO,
  FIELD_TEXT,
  SINGLE_PAGE_FORM,
} from '../../../constants/AppConstants';
import DisplayForm from '../../DisplayForm';

describe('Display Form, display layout tests', () => {
  const handleSubmit = jest.fn();
  const scrollIntoViewMock = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;
  const formActions = {
    submit: {
      label: 'Submit test button',
    },
  };
  const formFields = [
    {
      type: FIELD_TEXT,
      displayType: DISPLAY_DETAILS,
      label: 'Text input wrapped in details',
      hint: 'This is a hint for the details input',
      fieldName: 'textWithDetails',
      linkText: 'The details link text',
    },
    {
      type: FIELD_TEXT,
      displayType: DISPLAY_SINGLE,
      label: 'Basic text input',
      hint: 'This is a hint for the basic text input',
      fieldName: 'textSingle',
    },
    {
      type: FIELD_TEXT,
      label: 'Text input without a displayType defined',
      hint: 'This is a hint for the text without display type',
      fieldName: 'textMissingDisplayType',
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
          fields={formFields}
          formActions={formActions}
          formType={SINGLE_PAGE_FORM}
          handleSubmit={handleSubmit}
        />
      </MemoryRouter>,
    );
    expect((screen.getByTestId('submit-button')).outerHTML).toEqual('<button type="button" class="govuk-button" data-module="govuk-button" data-testid="submit-button">Submit test button</button>');
  });

  it('should render a details component with an input', () => {
    render(
      <MemoryRouter>
        <DisplayForm
          formId="testForm"
          fields={formFields}
          formActions={formActions}
          formType={SINGLE_PAGE_FORM}
          handleSubmit={handleSubmit}
        />
      </MemoryRouter>,
    );
    expect(screen.getByLabelText('Text input wrapped in details')).toBeInTheDocument();
    expect(screen.getByText('This is a hint for the details input').outerHTML).toEqual('<div id="textWithDetails-hint" class="govuk-hint">This is a hint for the details input</div>');
    expect(screen.getByRole('textbox', { name: 'Text input wrapped in details' })).toBeInTheDocument();
    expect(screen.getByTestId('details-component').outerHTML).toEqual('<details class="govuk-details" data-module="govuk-details" data-testid="details-component"><summary class="govuk-details__summary"><span class="govuk-details__summary-text">The details link text</span></summary><div class="govuk-details__text"><label class="govuk-label" for="textWithDetails-input">Text input wrapped in details</label><div id="textWithDetails-hint" class="govuk-hint">This is a hint for the details input</div><p id="textWithDetails-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> </p><input class="govuk-input" id="textWithDetails-input" name="textWithDetails" type="text" aria-describedby="textWithDetails-hint" value=""></div></details>');
  });

  it('should render a grouped input', () => {
    render(
      <MemoryRouter>
        <DisplayForm
          formId="testForm"
          fields={formFields}
          formActions={formActions}
          formType={SINGLE_PAGE_FORM}
          handleSubmit={handleSubmit}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText('This is a radio button set')).toBeInTheDocument();
    expect(screen.getByText('radio hint').outerHTML).toEqual('<div id="radioButtonSet-hint" class="govuk-hint">radio hint</div>');
    expect(screen.getByRole('group', { name: 'This is a radio button set' })).toBeInTheDocument();
    expect(screen.getByLabelText('Radio one')).toBeInTheDocument();
    expect(screen.getByLabelText('Radio two')).toBeInTheDocument();
    expect(screen.getByLabelText('Radio three')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Radio one' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Radio two' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Radio three' })).toBeInTheDocument();
  });

  it('should render a single input', () => {
    render(
      <MemoryRouter>
        <DisplayForm
          formId="testForm"
          fields={formFields}
          formActions={formActions}
          formType={SINGLE_PAGE_FORM}
          handleSubmit={handleSubmit}
        />
      </MemoryRouter>,
    );
    expect(screen.getByLabelText('Basic text input')).toBeInTheDocument();
    expect(screen.getByText('This is a hint for the basic text input').outerHTML).toEqual('<div id="textSingle-hint" class="govuk-hint">This is a hint for the basic text input</div>');
    expect(screen.getByRole('textbox', { name: 'Basic text input' })).toBeInTheDocument();
  });

  it('should render a single input if the displayType is missing', () => {
    render(
      <MemoryRouter>
        <DisplayForm
          formId="testForm"
          fields={formFields}
          formActions={formActions}
          formType={SINGLE_PAGE_FORM}
          handleSubmit={handleSubmit}
        />
      </MemoryRouter>,
    );
    expect(screen.getByLabelText('Text input without a displayType defined')).toBeInTheDocument();
    expect(screen.getByText('This is a hint for the text without display type').outerHTML).toEqual('<div id="textMissingDisplayType-hint" class="govuk-hint">This is a hint for the text without display type</div>');
    expect(screen.getByRole('textbox', { name: 'Text input without a displayType defined' })).toBeInTheDocument();
  });
});
