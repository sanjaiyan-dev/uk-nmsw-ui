import { render, screen } from '@testing-library/react';
import InputRadio from '../InputRadio';

/*
 * These tests check that we can pass in the minimum parameters and it will generate the correct input field HTML
 * And we can pass in the maximum parameters and it will generate the correct input field HTML
 * It does NOT test that the full form field component with labels etc is generated
 */

describe('Radio input field generation', () => {
  const parentHandleChange = jest.fn();
  const fieldDetailsBasic = {
    fieldName: 'simpleFieldName', // gets rendered in DisplayForm component
    radioOptions: [
      {
        id: 'radio1',
        name: 'radioOne',
        label: 'Radio one',
        value: 'radioOne',
      }
    ]
  };
  const fieldDetailsAllProps = {
    fieldName: 'fullFieldName', // gets rendered in DisplayForm component
    hint: 'The hint text', // gets rendered in DisplayForm component
    value: 'radioOne', // gets rendered in DisplayForm component
    className: 'govuk-radios govuk-radios--inline', // gets rendered in DisplayForm component
    radioOptions: [
      {
        id: 'radio1',
        name: 'radioOne',
        label: 'Radio one',
        value: 'radioOne',
        checked: false,
      },
      {
        id: 'radio2',
        name: 'radioTwo',
        label: 'Radio two',
        value: 'radioTwo',
        checked: true,
      }
    ]
  };

  it('should render the radio input field with only the required props', () => {
    render(
      <InputRadio
        fieldDetails={fieldDetailsBasic}
        handleChange={parentHandleChange}
        type='radio'
      />
    );
    expect(screen.getByRole('radio', { name: 'Radio one' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Radio one' }).outerHTML).toEqual('<input class="govuk-radios__input" id="radio1-input" name="radioOne" type="radio" value="radioOne">');
  });

  it('should render the radio input field with all props passed', () => {
    render(
      <InputRadio
        fieldDetails={fieldDetailsAllProps}
        handleChange={parentHandleChange}
        type='radio'
      />
    );
    expect(screen.getByRole('radio', { name: 'Radio one' }).outerHTML).toEqual('<input class="govuk-radios__input" id="radio1-input" name="radioOne" type="radio" value="radioOne">');
    expect(screen.getByRole('radio', { name: 'Radio two' }).outerHTML).toEqual('<input class="govuk-radios__input" id="radio2-input" name="radioTwo" type="radio" value="radioTwo" checked="">');
    expect(screen.getByRole('radio', { name: 'Radio one' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'Radio two' })).toBeChecked();
  });

});
