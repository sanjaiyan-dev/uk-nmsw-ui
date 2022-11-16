import { render, screen } from '@testing-library/react';
import { FIELD_EMAIL, FIELD_PASSWORD, FIELD_TEXT } from '../../../constants/AppConstants';
import InputText from '../InputText';

/*
 * These tests check that we can pass in the minimum parameters and it will generate the correct input field HTML
 * And we can pass in the maximum parameters and it will generate the correct input field HTML
 * It does NOT test that the full form field component with labels etc is generated
 */

describe('Text input field generation', () => {
  const parentHandleChange = jest.fn();
  const fieldDetailsBasic = {
    fieldName: 'simpleFieldName'
  };
  const fieldDetailsAllProps = {
    fieldName: 'fullFieldName',
    value: 'The full field value',
    hint: 'The hint text',
  };

  it('should render the text input field with only the required props', () => {
    render(
      <InputText
        fieldDetails={fieldDetailsBasic}
        handleChange={parentHandleChange}
        type='text'
      />
    );
    expect(screen.getByRole('textbox', { name: '' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '' }).outerHTML).toEqual('<input class="govuk-input" id="simpleFieldName-input" name="simpleFieldName" type="text" value="">');
  });

  it('should render a text input field with all props passed', () => {
    render(
      <InputText
        autoComplete='email'
        dataTestid='test-id'
        error='this field has an error'
        fieldDetails={fieldDetailsAllProps}
        handleChange={parentHandleChange}
        type='text'
      />
    );
    expect(screen.getByRole('textbox', { name: '' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '' }).outerHTML).toEqual('<input class="govuk-input govuk-input--error" id="fullFieldName-input" data-testid="test-id" name="fullFieldName" type="text" autocomplete="email" aria-describedby="fullFieldName-hint" value="The full field value">');
  });

  it('should render the input with type of text if text passed', () => {
    render(
      <InputText
        fieldDetails={fieldDetailsAllProps}
        handleChange={parentHandleChange}
        type={FIELD_TEXT}
      />
    );
    expect(screen.getByRole('textbox', { name: '' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '' })).toHaveAttribute('type', 'text');
  });

  it('should render the input with type of email if email passed', () => {
    render(
      <InputText
        fieldDetails={fieldDetailsAllProps}
        handleChange={parentHandleChange}
        type={FIELD_EMAIL}
      />
    );
    expect(screen.getByRole('textbox', { name: '' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '' })).toHaveAttribute('type', 'email');
  });

  it('should render the input with type of password if password passed', () => {
    render(
      <InputText
        dataTestid='passwordField'
        fieldDetails={fieldDetailsAllProps}
        handleChange={parentHandleChange}
        type={FIELD_PASSWORD}
      />
    );

    expect(screen.getByTestId('passwordField')).toHaveAttribute('type', 'password');
  });

  it('should render the default value in the input text field when one is provided', () => {
    render(
      <InputText
        fieldDetails={fieldDetailsAllProps}
        handleChange={parentHandleChange}
        type='text'
      />
    );
    expect(screen.getByRole('textbox', { name: '' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '' })).toHaveValue('The full field value');
  });

  it('should render the class as the error class if an error is passed', () => {
    render(
      <InputText
        error='This field has an error'
        fieldDetails={fieldDetailsAllProps}
        handleChange={parentHandleChange}
        type='text'
      />
    );
    expect(screen.getByRole('textbox', { name: '' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '' }).outerHTML).toEqual('<input class="govuk-input govuk-input--error" id="fullFieldName-input" name="fullFieldName" type="text" aria-describedby="fullFieldName-hint" value="The full field value">');
  });

  it('should NOT render the class as the error class if NO error is passed', () => {
    render(
      <InputText
        fieldDetails={fieldDetailsAllProps}
        handleChange={parentHandleChange}
        type='text'
      />
    );
    expect(screen.getByRole('textbox', { name: '' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '' }).outerHTML).toEqual('<input class="govuk-input" id="fullFieldName-input" name="fullFieldName" type="text" aria-describedby="fullFieldName-hint" value="The full field value">');
  });

});
