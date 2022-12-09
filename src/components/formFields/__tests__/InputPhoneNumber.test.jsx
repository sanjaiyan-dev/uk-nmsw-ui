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
    expect(screen.getAllByRole('textbox', { name: '' })).toHaveLength(2);
    expect(screen.getAllByRole('textbox', { name: '' })[0].outerHTML).toEqual('<input class="govuk-input govuk-input--width-5 phoneNumber-input_country-code" id="fieldName-input[0]" name="fieldNameCountryCode" type="text" inputmode="numeric" value="">');
    expect(screen.getAllByRole('textbox', { name: '' })[1].outerHTML).toEqual('<input class="govuk-input" id="fieldName-input[1]" name="fieldNamePhoneNumber" type="tel" autocomplete="tel" value="">');
  });

  it('should render two text inputs with all props passed', () => {
    render(
      <InputPhoneNumber
        fieldDetails={fieldDetailsAllProps}
        handleChange={parentHandleChange}
      />
    );
    expect(screen.getAllByRole('textbox', { name: '' })).toHaveLength(2);
    expect(screen.getAllByRole('textbox', { name: '' })[0].outerHTML).toEqual('<input class="govuk-input govuk-input--width-5 phoneNumber-input_country-code" id="fullFieldName-input[0]" name="fullFieldNameCountryCode" type="text" inputmode="numeric" aria-describedby="fullFieldName-hint" value="123">');
    expect(screen.getAllByRole('textbox', { name: '' })[1].outerHTML).toEqual('<input class="govuk-input" id="fullFieldName-input[1]" name="fullFieldNamePhoneNumber" type="tel" autocomplete="tel" aria-describedby="fullFieldName-hint" value="12345">');
  });

  it('should render the default value, the short field with the text between the () and the long field the text after ), when one is provided', () => {
    render(
      <InputPhoneNumber
        fieldDetails={fieldDetailsAllProps}
        handleChange={parentHandleChange}
      />
    );
    
    expect(screen.getAllByRole('textbox', { name: '' })[0]).toHaveValue('123');
    expect(screen.getAllByRole('textbox', { name: '' })[1]).toHaveValue('12345');
  });

  it('should render the class as the error class if an error is passed', () => {
    render(
      <InputPhoneNumber
        error='This field has an error'
        fieldDetails={fieldDetailsAllProps}
        handleChange={parentHandleChange}
      />
    );

    expect(screen.getAllByRole('textbox', { name: '' })[0].outerHTML).toEqual('<input class="govuk-input govuk-input--width-5 phoneNumber-input_country-code govuk-input--error" id="fullFieldName-input[0]" name="fullFieldNameCountryCode" type="text" inputmode="numeric" aria-describedby="fullFieldName-hint" value="123">');
    expect(screen.getAllByRole('textbox', { name: '' })[1].outerHTML).toEqual('<input class="govuk-input govuk-input--error" id="fullFieldName-input[1]" name="fullFieldNamePhoneNumber" type="tel" autocomplete="tel" aria-describedby="fullFieldName-hint" value="12345">');
  });

  it('should NOT render the class as the error class if NO error is passed', () => {
    render(
      <InputPhoneNumber
        fieldDetails={fieldDetailsAllProps}
        handleChange={parentHandleChange}
      />
    );
    expect(screen.getAllByRole('textbox', { name: '' })).toHaveLength(2);
    expect(screen.getAllByRole('textbox', { name: '' })[0].outerHTML).toEqual('<input class="govuk-input govuk-input--width-5 phoneNumber-input_country-code" id="fullFieldName-input[0]" name="fullFieldNameCountryCode" type="text" inputmode="numeric" aria-describedby="fullFieldName-hint" value="123">');
    expect(screen.getAllByRole('textbox', { name: '' })[1].outerHTML).toEqual('<input class="govuk-input" id="fullFieldName-input[1]" name="fullFieldNamePhoneNumber" type="tel" autocomplete="tel" aria-describedby="fullFieldName-hint" value="12345">');
  });
});
