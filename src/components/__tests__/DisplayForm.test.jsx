import { render, screen } from '@testing-library/react';
import DisplayForm from '../DisplayForm';

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

describe('Display Form', () => {

  const handleSubmit = jest.fn();
  const formActions = {
    submit: {
      className: 'govuk-button',
      dataModule: 'govuk-button',
      dataTestid: 'submit-button',
      label: 'Submit test button',
      type: 'button',
    },
    cancel: {
      className: 'govuk-button govuk-button--secondary',
      dataModule: 'govuk-button',
      dataTestid: 'cancel-button',
      label: 'Cancel test button',
      type: 'button',
    }
  };
  const formActionsSubmitOnly = {
    submit: {
      className: 'govuk-button',
      dataModule: 'govuk-button',
      dataTestid: 'submit-button',
      label: 'Submit test button',
      type: 'button',
    },
  };
  const formTextInput = [
    {
      type: 'text',
      label: 'Text input',
      hint: 'This is a hint for a text input',
      fieldName: 'testField',
    }
  ];
  const formSpecialInputs = [
    {
      type: 'text',
      label: 'Text input',
      hint: 'This is a hint for a text input',
      fieldName: 'testField',
    },
    {
      type: 'email',
      label: 'Email input',
      hint: 'This is a hint for an email input',
      fieldName: 'email',
    },
    {
      type: 'password',
      label: 'Password input',
      hint: 'This is a hint for a password input',
      fieldName: 'password',
    }
  ];

  it('should render a submit and cancel button if both exist', async () => {
    render(
      <DisplayForm
        formId="testForm"
        fields={formTextInput}
        formActions={formActions}
        handleSubmit={handleSubmit}
      />
    );
    expect((screen.getByTestId('submit-button')).outerHTML).toEqual('<button type="button" class="govuk-button" data-module="govuk-button" data-testid="submit-button">Submit test button</button>');
    expect((screen.getByTestId('cancel-button')).outerHTML).toEqual('<button type="button" class="govuk-button govuk-button--secondary" data-module="govuk-button" data-testid="cancel-button">Cancel test button</button>');
  });

  it('should render only a submit button if there is no cancel button', async () => {
    render(
      <DisplayForm
        formId="testForm"
        fields={formTextInput}
        formActions={formActionsSubmitOnly}
        handleSubmit={handleSubmit}
      />
    );
    expect(screen.getByTestId('submit-button').outerHTML).toEqual('<button type="button" class="govuk-button" data-module="govuk-button" data-testid="submit-button">Submit test button</button>');
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });

  it('should render a text input', async () => {
    render(
      <DisplayForm
        formId="testForm"
        fields={formTextInput}
        formActions={formActionsSubmitOnly}
        handleSubmit={handleSubmit}
      />
    );
    expect(screen.getByLabelText('Text input')).toBeInTheDocument();
    expect(screen.getByText('This is a hint for a text input').outerHTML).toEqual('<div id="testField-hint" class="govuk-hint">This is a hint for a text input</div>');
    expect(screen.getByRole('textbox', {name: 'Text input'})).toBeInTheDocument();
  });

  it('should render the special input types', async () => {
    render(
      <DisplayForm
        formId="testForm"
        fields={formSpecialInputs}
        formActions={formActionsSubmitOnly}
        handleSubmit={handleSubmit}
      />
    );
    /* standard text field */
    expect(screen.getByLabelText('Text input')).toBeInTheDocument();
    expect(screen.getByText('This is a hint for a text input').outerHTML).toEqual('<div id="testField-hint" class="govuk-hint">This is a hint for a text input</div>');
    expect(screen.getByRole('textbox', {name: 'Text input'})).toBeInTheDocument();
    /* email field */
    expect(screen.getByLabelText('Email input')).toBeInTheDocument();
    expect(screen.getByText('This is a hint for an email input').outerHTML).toEqual('<div id="email-hint" class="govuk-hint">This is a hint for an email input</div>');
    expect(screen.getByRole('textbox', {name: 'Email input'})).toBeInTheDocument();
    /* password field: password inputs do not have a true textbox role so must be found via test id */
    expect(screen.getByLabelText('Password input')).toBeInTheDocument();
    expect(screen.getByText('This is a hint for a password input').outerHTML).toEqual('<div id="password-hint" class="govuk-hint">This is a hint for a password input</div>');
    expect(screen.getByTestId('password-passwordField')).toBeInTheDocument();
  });
});
