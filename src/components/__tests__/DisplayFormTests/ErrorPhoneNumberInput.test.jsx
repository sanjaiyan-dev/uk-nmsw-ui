import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  FIELD_PHONE,
  SINGLE_PAGE_FORM,
  VALIDATE_PHONE_NUMBER,
  VALIDATE_REQUIRED,
} from '../../../constants/AppConstants';
import DisplayForm from '../../DisplayForm';
/*
 * These tests check that we can generate a phone number
 * field with country dial code and number inputs
 * and those will error correctly
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
  const formRequiredPhoneNumberInput = [
    {
      type: FIELD_PHONE,
      label: 'Phone input',
      hint: 'This is a hint for a phone input',
      fieldName: 'testPhoneField',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter your phone value',
        },
        {
          type: VALIDATE_PHONE_NUMBER,
          message: 'Enter your phone value',
        },
      ],
    }
  ];

  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('should render one field error to cover both phone number fields', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <DisplayForm
          formId="testForm"
          fields={formRequiredPhoneNumberInput}
          formActions={formActionsSubmitOnly}
          formType={SINGLE_PAGE_FORM}
          handleSubmit={handleSubmit}
        />
      </MemoryRouter>
    );
    await user.click(screen.getByRole('button', { name: 'Submit test button' }));
    expect(screen.getByText('There is a problem').outerHTML).toEqual('<h2 class="govuk-error-summary__title" id="error-summary-title">There is a problem</h2>');
    expect(screen.getAllByText('Enter your phone value')).toHaveLength(2);
    // Error summary has the error message as a button and correct class
    expect(screen.getByRole('button', { name: 'Enter your phone value' }).outerHTML).toEqual('<button class="govuk-button--text">Enter your phone value</button>');
    // Input field has the error class attached
    expect(screen.getByRole('textbox', { name: 'Country phone code field' }).outerHTML).toEqual('<input class="govuk-input govuk-input--width-5 phoneNumber-input_country-code govuk-input--error" id="testPhoneField-input[0]" name="testPhoneFieldCountryPhoneCode" type="text" inputmode="numeric" aria-describedby="testPhoneField-hint" value="">');
    expect(screen.getByRole('textbox', { name: 'Phone number field' }).outerHTML).toEqual('<input class="govuk-input govuk-input--error" id="testPhoneField-input[1]" name="testPhoneFieldPhoneNumber" type="tel" autocomplete="tel" aria-describedby="testPhoneField-hint" value="">');
  });

  it('should render an error if just Country phone code of phone number is provided', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <DisplayForm
          formId="testForm"
          fields={formRequiredPhoneNumberInput}
          formActions={formActionsSubmitOnly}
          formType={SINGLE_PAGE_FORM}
          handleSubmit={handleSubmit}
        />
      </MemoryRouter>
    );

    await user.type(screen.getByRole('textbox', { name: 'Country phone code field' }), '123');
    await user.click(screen.getByRole('button', { name: 'Submit test button' }));
    expect(screen.getAllByText('Enter your phone value')).toHaveLength(2);
    // Error summary has the error message as a button and correct class
    expect(screen.getByRole('button', { name: 'Enter your phone value' }).outerHTML).toEqual('<button class="govuk-button--text">Enter your phone value</button>');
    // Input field has the error class attached
    expect(screen.getByRole('textbox', { name: 'Country phone code field' }).outerHTML).toEqual('<input class="govuk-input govuk-input--width-5 phoneNumber-input_country-code govuk-input--error" id="testPhoneField-input[0]" name="testPhoneFieldCountryPhoneCode" type="text" inputmode="numeric" aria-describedby="testPhoneField-hint" value="123">');
    expect(screen.getByRole('textbox', { name: 'Phone number field' }).outerHTML).toEqual('<input class="govuk-input govuk-input--error" id="testPhoneField-input[1]" name="testPhoneFieldPhoneNumber" type="tel" autocomplete="tel" aria-describedby="testPhoneField-hint" value="">');
  });

  it('should render an error if just phone number of phone number is provided', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <DisplayForm
          formId="testForm"
          fields={formRequiredPhoneNumberInput}
          formActions={formActionsSubmitOnly}
          formType={SINGLE_PAGE_FORM}
          handleSubmit={handleSubmit}
        />
      </MemoryRouter>
    );

    await user.type(screen.getByRole('textbox', { name: 'Phone number field' }), '123');
    await user.click(screen.getByRole('button', { name: 'Submit test button' }));
    expect(screen.getAllByText('Enter your phone value')).toHaveLength(2);
    // Error summary has the error message as a button and correct class
    expect(screen.getByRole('button', { name: 'Enter your phone value' }).outerHTML).toEqual('<button class="govuk-button--text">Enter your phone value</button>');
    // Input field has the error class attached
    expect(screen.getByRole('textbox', { name: 'Country phone code field' }).outerHTML).toEqual('<input class="govuk-input govuk-input--width-5 phoneNumber-input_country-code govuk-input--error" id="testPhoneField-input[0]" name="testPhoneFieldCountryPhoneCode" type="text" inputmode="numeric" aria-describedby="testPhoneField-hint" value="">');
    expect(screen.getByRole('textbox', { name: 'Phone number field' }).outerHTML).toEqual('<input class="govuk-input govuk-input--error" id="testPhoneField-input[1]" name="testPhoneFieldPhoneNumber" type="tel" autocomplete="tel" aria-describedby="testPhoneField-hint" value="123">');
  });

  it('should NOT render an error if both Country phone code and phone number of phone number is provided', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <DisplayForm
          formId="testForm"
          fields={formRequiredPhoneNumberInput}
          formActions={formActionsSubmitOnly}
          formType={SINGLE_PAGE_FORM}
          handleSubmit={handleSubmit}
        />
      </MemoryRouter>
    );

    await user.type(screen.getByRole('textbox', { name: 'Country phone code field' }), '123');
    await user.type(screen.getByRole('textbox', { name: 'Phone number field' }), '12345');
    await user.click(screen.getByRole('button', { name: 'Submit test button' }));
    expect(screen.queryByText('Enter your phone value')).not.toBeInTheDocument();
    // Input field has the error class attached
    expect(screen.getByRole('textbox', { name: 'Country phone code field' }).outerHTML).toEqual('<input class="govuk-input govuk-input--width-5 phoneNumber-input_country-code" id="testPhoneField-input[0]" name="testPhoneFieldCountryPhoneCode" type="text" inputmode="numeric" aria-describedby="testPhoneField-hint" value="123">');
    expect(screen.getByRole('textbox', { name: 'Phone number field' }).outerHTML).toEqual('<input class="govuk-input" id="testPhoneField-input[1]" name="testPhoneFieldPhoneNumber" type="tel" autocomplete="tel" aria-describedby="testPhoneField-hint" value="12345">');
  });
});
