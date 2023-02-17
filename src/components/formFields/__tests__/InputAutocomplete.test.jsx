import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InputAutocomplete from '../InputAutocomplete';

/*
 * These tests check that we can pass in the minimum parameters and it will generate the correct input field HTML
 * And we can pass in the maximum parameters and it will generate the correct input field HTML
 * It does NOT test that the full form field component with labels etc is generated
 */

describe('Text input field generation', () => {
  const parentHandleChange = jest.fn();
  const fieldDetailsBasic = {
    dataSet: [
      {
        name: 'FirstObject',
        identifier: 'one',
      },
      {
        name: 'SecondObject',
        identifier: 'two',
      },
      {
        name: 'ThirdObject',
        identifier: 'three',
      },
    ],
    fieldName: 'fullFieldName',
    responseKey: 'name',
    displayAdditionalKey: false,
  };
  const fieldDetailsAllProps = {
    dataSet: [
      {
        name: 'FirstObject',
        identifier: 'one',
      },
      {
        name: 'SecondObject',
        identifier: 'two',
      },
      {
        name: 'ThirdObject',
        identifier: 'three',
      },
    ],
    fieldName: 'fullFieldName',
    hint: 'The hint text',
    responseKey: 'name',
    additionalKey: 'identifier',
    displayAdditionalKey: true,
  };

  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('should render the autocomplete input field with only the required props', () => {
    render(
      <InputAutocomplete
        fieldDetails={fieldDetailsBasic}
        handleChange={parentHandleChange}
      />,
    );
    expect(screen.getByRole('combobox', { name: '' })).toBeInTheDocument();
    expect(screen.getByRole('listbox', { name: '' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: '' }).outerHTML).toEqual('<input aria-expanded="false" aria-activedescendant="false" aria-owns="fullFieldName-input__listbox" aria-autocomplete="list" aria-describedby="fullFieldName-input__assistiveHint" autocomplete="off" class="autocomplete__input autocomplete__input--default" id="fullFieldName-input" name="fullFieldName" placeholder="" type="text" role="combobox" value="">');
    expect(screen.getByRole('listbox', { name: '' }).outerHTML).toEqual('<ul class="autocomplete__menu autocomplete__menu--inline autocomplete__menu--hidden" id="fullFieldName-input__listbox" role="listbox"></ul>');
  });

  it('should render the autocomplete input field with all props passed except value', () => {
    render(
      <InputAutocomplete
        fieldDetails={fieldDetailsAllProps}
        handleChange={parentHandleChange}
      />,
    );
    expect(screen.getByRole('combobox', { name: '' })).toBeInTheDocument();
    expect(screen.getByRole('listbox', { name: '' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: '' }).outerHTML).toEqual('<input aria-expanded="false" aria-activedescendant="false" aria-owns="fullFieldName-input__listbox" aria-autocomplete="list" aria-describedby="fullFieldName-input__assistiveHint" autocomplete="off" class="autocomplete__input autocomplete__input--default" id="fullFieldName-input" name="fullFieldName" placeholder="" type="text" role="combobox" value="">');
    expect(screen.getByRole('listbox', { name: '' }).outerHTML).toEqual('<ul class="autocomplete__menu autocomplete__menu--inline autocomplete__menu--hidden" id="fullFieldName-input__listbox" role="listbox"></ul>');
  });

  it('should render the list options based on what the user enters when it matches the responseKey', async () => {
    const user = userEvent.setup();
    render(
      <InputAutocomplete
        fieldDetails={fieldDetailsBasic}
        handleChange={parentHandleChange}
      />,
    );
    expect(screen.getByRole('combobox', { name: '' })).toBeInTheDocument();
    expect(screen.getByRole('listbox', { name: '' })).toBeInTheDocument();

    await user.type(screen.getByRole('combobox', { name: '' }), 'Obje');
    expect(screen.getByRole('combobox', { name: '' })).toHaveValue('Obje');
    expect(screen.getByText('FirstObject')).toBeInTheDocument();
    expect(screen.getByText('SecondObject')).toBeInTheDocument();
    expect(screen.getByText('ThirdObject')).toBeInTheDocument();
  });

  it('should render the list options based on what the user enters when it matches the additionalKey', async () => {
    const user = userEvent.setup();
    render(
      <InputAutocomplete
        fieldDetails={{ ...fieldDetailsAllProps, displayAdditionalKey: true }}
        handleChange={parentHandleChange}
      />,
    );
    expect(screen.getByRole('combobox', { name: '' })).toBeInTheDocument();
    expect(screen.getByRole('listbox', { name: '' })).toBeInTheDocument();

    await user.type(screen.getByRole('combobox', { name: '' }), 'thre');
    expect(screen.getByRole('combobox', { name: '' })).toHaveValue('thre');
    expect(screen.getByText('ThirdObject three')).toBeInTheDocument();
  });

  it('should return the concatenated value when the field has two response keys and displayAdditionalKey is set to true', async () => {
    const user = userEvent.setup();
    render(
      <InputAutocomplete
        fieldDetails={{ ...fieldDetailsAllProps, displayAdditionalKey: true }}
        handleChange={parentHandleChange}
      />,
    );
    expect(screen.getByRole('combobox', { name: '' })).toBeInTheDocument();
    expect(screen.getByRole('listbox', { name: '' })).toBeInTheDocument();

    await user.type(screen.getByRole('combobox', { name: '' }), 'Object');
    expect(screen.getByText('FirstObject one')).toBeInTheDocument();
    expect(screen.getByText('SecondObject two')).toBeInTheDocument();
    expect(screen.getByText('ThirdObject three')).toBeInTheDocument();
  });

  it('should return the responseKey value when the field has two response keys but has displayAdditionalKey set to false', async () => {
    const user = userEvent.setup();
    render(
      <InputAutocomplete
        fieldDetails={{ ...fieldDetailsAllProps, displayAdditionalKey: false }}
        handleChange={parentHandleChange}
      />,
    );
    expect(screen.getByRole('combobox', { name: '' })).toBeInTheDocument();
    expect(screen.getByRole('listbox', { name: '' })).toBeInTheDocument();

    await user.type(screen.getByRole('combobox', { name: '' }), 'Object');
    expect(screen.getByText('FirstObject')).toBeInTheDocument();
    expect(screen.getByText('SecondObject')).toBeInTheDocument();
    expect(screen.getByText('ThirdObject')).toBeInTheDocument();
  });

  it('should display prefixes and suffixes when available', async () => {
    const user = userEvent.setup();
    render(
      <InputAutocomplete
        fieldDetails={{
          ...fieldDetailsAllProps,
          displayAdditionalKey: true,
          responseKeyPrefix: '+',
          responseKeySuffix: '-',
          additionalKeyPrefix: '(',
          additionalKeySuffix: ')',
        }}
        handleChange={parentHandleChange}
      />,
    );
    expect(screen.getByRole('combobox', { name: '' })).toBeInTheDocument();
    expect(screen.getByRole('listbox', { name: '' })).toBeInTheDocument();

    await user.type(screen.getByRole('combobox', { name: '' }), 'Object');
    expect(screen.getByText('+FirstObject- (one)')).toBeInTheDocument();
    expect(screen.getByText('+SecondObject- (two)')).toBeInTheDocument();
    expect(screen.getByText('+ThirdObject- (three)')).toBeInTheDocument();

    await user.click(screen.getByText('+SecondObject- (two)'));
    expect(screen.getByRole('combobox', { name: '' })).toHaveValue('+SecondObject- (two)');
  });

  it('should update the value of the input if a selection is made from the list', async () => {
    const user = userEvent.setup();
    render(
      <InputAutocomplete
        fieldDetails={{ ...fieldDetailsAllProps, displayAdditionalKey: true }}
        handleChange={parentHandleChange}
      />,
    );
    expect(screen.getByRole('combobox', { name: '' })).toBeInTheDocument();
    expect(screen.getByRole('listbox', { name: '' })).toBeInTheDocument();

    await user.type(screen.getByRole('combobox', { name: '' }), 'Object');
    await user.click(screen.getByText('SecondObject two'));
    expect(screen.getByRole('combobox', { name: '' })).toHaveValue('SecondObject two');
  });

  it('should call handleChange function if user clears field via backspace key', async () => {
    const user = userEvent.setup();
    render(
      <InputAutocomplete
        fieldDetails={{ ...fieldDetailsAllProps, displayAdditionalKey: true }}
        handleChange={parentHandleChange}
      />,
    );
    expect(screen.getByRole('combobox', { name: '' })).toBeInTheDocument();
    expect(screen.getByRole('listbox', { name: '' })).toBeInTheDocument();

    const input = screen.getByRole('combobox', { name: '' });

    await user.type(screen.getByRole('combobox', { name: '' }), 'Object');
    await user.click(screen.getByText('SecondObject two'));
    expect(input).toHaveValue('SecondObject two');

    input.setSelectionRange(0, 17);
    await user.keyboard('{backspace}');
    expect(input).toHaveValue('');
    expect(parentHandleChange).toHaveBeenCalled();
  });

  it('should call handleChange function if user clears field via delete key', async () => {
    const user = userEvent.setup();
    render(
      <InputAutocomplete
        fieldDetails={{ ...fieldDetailsAllProps, displayAdditionalKey: true }}
        handleChange={parentHandleChange}
      />,
    );
    expect(screen.getByRole('combobox', { name: '' })).toBeInTheDocument();
    expect(screen.getByRole('listbox', { name: '' })).toBeInTheDocument();

    const input = screen.getByRole('combobox', { name: '' });

    await user.type(screen.getByRole('combobox', { name: '' }), 'Object');
    await user.click(screen.getByText('FirstObject one'));
    expect(input).toHaveValue('FirstObject one');

    input.setSelectionRange(0, 16);
    await user.keyboard('{delete}');
    expect(input).toHaveValue('');
    expect(parentHandleChange).toHaveBeenCalled();
  });
});
