import { render, screen } from '@testing-library/react';
import InputPhoneNumber from '../InputPhoneNumber';

/*
 * These tests check that we can pass in the minimum parameters and it will generate the correct input field HTML
 * And we can pass in the maximum parameters and it will generate the correct input field HTML
 * It does NOT test that the full form field component with labels etc is generated
 */

describe('Phone input field generation', () => {
  const parentHandleChange = jest.fn();
  const fieldDetailsBasic = {
    fieldName: 'fieldName',
  };
  const fieldDetailsAllProps = {
    fieldName: 'fullFieldName',
    value: '(123)12345',
    hint: 'The hint text',
  };

  it('should render the two text inputs with only the required props', () => {
    render(
      <InputPhoneNumber
        fieldDetails={fieldDetailsBasic}
        handleChange={parentHandleChange}
      />
    );
    expect(screen.getByLabelText('Country code')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Country code' })).toBeInTheDocument();
    expect(screen.getByLabelText('Phone number')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Phone number' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Country code' }).outerHTML).toEqual('<input class="govuk-input govuk-input--width-5 phoneNumber-input_country-code" id="fieldName-input[0]" name="fieldNameCountryCode" type="text" inputmode="numeric" value="">');
    expect(screen.getByRole('textbox', { name: 'Phone number' }).outerHTML).toEqual('<input class="govuk-input" id="fieldName-input[1]" name="fieldNamePhoneNumber" type="tel" autocomplete="tel" value="">');
  });

  it('should render two text inputs with all props passed', () => {
    render(
      <InputPhoneNumber
        fieldDetails={fieldDetailsAllProps}
        handleChange={parentHandleChange}
      />
    );
    expect(screen.getByLabelText('Country code')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Country code' })).toBeInTheDocument();
    expect(screen.getByLabelText('Phone number')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Phone number' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Country code' }).outerHTML).toEqual('<input class="govuk-input govuk-input--width-5 phoneNumber-input_country-code" id="fullFieldName-input[0]" name="fullFieldNameCountryCode" type="text" inputmode="numeric" aria-describedby="fullFieldName-hint" value="123">');
    expect(screen.getByRole('textbox', { name: 'Phone number' }).outerHTML).toEqual('<input class="govuk-input" id="fullFieldName-input[1]" name="fullFieldNamePhoneNumber" type="tel" autocomplete="tel" aria-describedby="fullFieldName-hint" value="12345">');
  });

  it('should render label text with a hidden class as for UX visual label is seen as the legend', () => {
    render(
      <InputPhoneNumber
        fieldDetails={fieldDetailsBasic}
        handleChange={parentHandleChange}
      />
    );
    expect(screen.getByText('Country code').outerHTML).toEqual('<label class="govuk-visually-hidden" for="fieldName-input[0]">Country code</label>');
    expect(screen.getByText('Phone number').outerHTML).toEqual('<label class="govuk-visually-hidden" for="fieldName-input[1]">Phone number</label>');
  });

  it('should render the default value, the short field with the text between the () and the long field the text after ), when one is provided', () => {
    render(
      <InputPhoneNumber
        fieldDetails={fieldDetailsAllProps}
        handleChange={parentHandleChange}
      />
    );
    expect(screen.getByRole('textbox', { name: 'Country code' })).toHaveValue('123');
    expect(screen.getByRole('textbox', { name: 'Phone number' })).toHaveValue('12345');
  });

  it('should render the class as the error class if an error is passed', () => {
    render(
      <InputPhoneNumber
        error='This field has an error'
        fieldDetails={fieldDetailsAllProps}
        handleChange={parentHandleChange}
      />
    );
    expect(screen.getByRole('textbox', { name: 'Country code' }).outerHTML).toEqual('<input class="govuk-input govuk-input--width-5 phoneNumber-input_country-code govuk-input--error" id="fullFieldName-input[0]" name="fullFieldNameCountryCode" type="text" inputmode="numeric" aria-describedby="fullFieldName-hint" value="123">');
    expect(screen.getByRole('textbox', { name: 'Phone number' }).outerHTML).toEqual('<input class="govuk-input govuk-input--error" id="fullFieldName-input[1]" name="fullFieldNamePhoneNumber" type="tel" autocomplete="tel" aria-describedby="fullFieldName-hint" value="12345">');
  });

  it('should NOT render the class as the error class if NO error is passed', () => {
    render(
      <InputPhoneNumber
        fieldDetails={fieldDetailsAllProps}
        handleChange={parentHandleChange}
      />
    );
    expect(screen.getByRole('textbox', { name: 'Country code' }).outerHTML).toEqual('<input class="govuk-input govuk-input--width-5 phoneNumber-input_country-code" id="fullFieldName-input[0]" name="fullFieldNameCountryCode" type="text" inputmode="numeric" aria-describedby="fullFieldName-hint" value="123">');
    expect(screen.getByRole('textbox', { name: 'Phone number' }).outerHTML).toEqual('<input class="govuk-input" id="fullFieldName-input[1]" name="fullFieldNamePhoneNumber" type="tel" autocomplete="tel" aria-describedby="fullFieldName-hint" value="12345">');
  });
});
