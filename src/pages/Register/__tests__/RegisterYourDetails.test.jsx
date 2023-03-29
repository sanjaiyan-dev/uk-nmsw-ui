import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import RegisterYourDetails from '../RegisterYourDetails';

let mockUseLocationState = {};
const mockedUseNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedUseNavigate,
  useLocation: jest.fn().mockImplementation(() => mockUseLocationState),
}));

describe('Register your details tests', () => {
  const handleSubmit = jest.fn();
  const scrollIntoViewMock = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

  beforeEach(() => {
    mockUseLocationState = {};
    window.sessionStorage.clear();
  });

  it('should show try again message if there is no state', async () => {
    mockUseLocationState = {};
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Try again' })).toBeInTheDocument();
    expect(screen.getByText('The verification link did not work. Resend the email to try again.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Resend confirmation email' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Resend confirmation email' }).outerHTML).toEqual('<button class="govuk-button" data-module="govuk-button" type="button">Resend confirmation email</button>');
  });

  it('should show try again message if there is no dataToSubmit object in state', async () => {
    mockUseLocationState = { state: {} };
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Try again' })).toBeInTheDocument();
    expect(screen.getByText('The verification link did not work. Resend the email to try again.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Resend confirmation email' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Resend confirmation email' }).outerHTML).toEqual('<button class="govuk-button" data-module="govuk-button" type="button">Resend confirmation email</button>');
  });

  it('should show try again message if there is an empty dataToSubmit object in state', async () => {
    mockUseLocationState = { state: { dataToSubmit: {} } };
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Try again' })).toBeInTheDocument();
    expect(screen.getByText('The verification link did not work. Resend the email to try again.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Resend confirmation email' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Resend confirmation email' }).outerHTML).toEqual('<button class="govuk-button" data-module="govuk-button" type="button">Resend confirmation email</button>');
  });

  it('should show try again message if there is no emailAddress in state', async () => {
    mockUseLocationState = { state: { dataToSubmit: { toke: '123' } } };
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Try again' })).toBeInTheDocument();
    expect(screen.getByText('The verification link did not work. Resend the email to try again.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Resend confirmation email' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Resend confirmation email' }).outerHTML).toEqual('<button class="govuk-button" data-module="govuk-button" type="button">Resend confirmation email</button>');
  });

  it('should show try again message if there is no token in state', async () => {
    mockUseLocationState = { state: { dataToSubmit: { emailAddress: 'testemail@email.com' } } };
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Try again' })).toBeInTheDocument();
    expect(screen.getByText('The verification link did not work. Resend the email to try again.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Resend confirmation email' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Resend confirmation email' }).outerHTML).toEqual('<button class="govuk-button" data-module="govuk-button" type="button">Resend confirmation email</button>');
  });

  it('should render h1', async () => {
    mockUseLocationState = { state: { dataToSubmit: { emailAddress: 'testemail@email.com', token: '123' } } };
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    expect(screen.getByText('Your details')).toBeInTheDocument();
  });

  it('should render a full name question', async () => {
    mockUseLocationState = { state: { dataToSubmit: { emailAddress: 'testemail@email.com', token: '123' } } };
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    expect(screen.getByLabelText('Full name')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Full name' }).outerHTML).toEqual('<input class="govuk-input" id="fullName-input" name="fullName" type="text" value="">');
  });

  it('should render a company name question', async () => {
    mockUseLocationState = { state: { dataToSubmit: { emailAddress: 'testemail@email.com', token: '123' } } };
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    expect(screen.getByLabelText('Your company name')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Your company name' }).outerHTML).toEqual('<input class="govuk-input" id="companyName-input" name="companyName" type="text" value="">');
  });

  it('should render an international dialling code question', async () => {
    mockUseLocationState = { state: { dataToSubmit: { emailAddress: 'testemail@email.com', token: '123' } } };
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    expect(screen.getByLabelText('International dialling code')).toBeInTheDocument();
    expect(screen.getByText('For example, 44 for UK')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'International dialling code' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'International dialling code' }).outerHTML).toEqual('<input aria-expanded="false" aria-activedescendant="false" aria-owns="diallingCode-input__listbox" aria-autocomplete="list" aria-describedby="diallingCode-input__assistiveHint" autocomplete="off" class="autocomplete__input autocomplete__input--default" id="diallingCode-input" name="diallingCode" placeholder="" type="text" role="combobox" value="">');
  });

  it('should render a telephone number question', async () => {
    mockUseLocationState = { state: { dataToSubmit: { emailAddress: 'testemail@email.com', token: '123' } } };
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    expect(screen.getByLabelText('Telephone number')).toBeInTheDocument();
    expect(screen.getByText('For example, 7123123123')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Telephone number' })).toBeInTheDocument();
  });

  it('should render a country question', async () => {
    mockUseLocationState = { state: { dataToSubmit: { emailAddress: 'testemail@email.com', token: '123' } } };
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Country' }).outerHTML).toEqual('<input aria-expanded="false" aria-activedescendant="false" aria-owns="country-input__listbox" aria-autocomplete="list" aria-describedby="country-input__assistiveHint" autocomplete="off" class="autocomplete__input autocomplete__input--default" id="country-input" name="country" placeholder="" type="text" role="combobox" value="">');
  });

  it('should render a shipping agent question', async () => {
    mockUseLocationState = { state: { dataToSubmit: { emailAddress: 'testemail@email.com', token: '123' } } };
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    expect(screen.getByText('Is your company a shipping agent?')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
    // eslint-disable-next-line max-len
    expect(screen.getByRole('group', { name: 'Is your company a shipping agent?' }).outerHTML).toEqual('<fieldset class="govuk-fieldset"><legend class="govuk-fieldset__legend">Is your company a shipping agent?</legend><div id="shippingAgent-hint" class="govuk-hint"></div><p id="shippingAgent-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> </p><div class="govuk-radios govuk-radios--inline" data-module="govuk-radios"><div class="govuk-radios__item"><input class="govuk-radios__input" id="shippingAgent-input[0]" name="shippingAgent" type="radio" value="yes"><label class="govuk-label govuk-radios__label" for="shippingAgent-input[0]">Yes</label></div><div class="govuk-radios__item"><input class="govuk-radios__input" id="shippingAgent-input[1]" name="shippingAgent" type="radio" value="no"><label class="govuk-label govuk-radios__label" for="shippingAgent-input[1]">No</label></div></div></fieldset>');
  });

  it('should render a continue button', async () => {
    mockUseLocationState = { state: { dataToSubmit: { emailAddress: 'testemail@email.com', token: '123' } } };
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    expect(screen.getByRole('button', { name: 'Continue' }).outerHTML).toEqual('<button type="button" class="govuk-button" data-module="govuk-button" data-testid="submit-button">Continue</button>');
  });

  it('should NOT call the handleSubmit function on button click if there ARE errors', async () => {
    mockUseLocationState = { state: { dataToSubmit: { emailAddress: 'testemail@email.com', token: '123' } } };
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    await user.click(screen.getByTestId('submit-button'));
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('should display the Error Summary if there are errors', async () => {
    mockUseLocationState = { state: { dataToSubmit: { emailAddress: 'testemail@email.com', token: '123' } } };
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    await user.click(screen.getByTestId('submit-button'));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
  });

  it('should display the required error messages if required fields are null', async () => {
    mockUseLocationState = { state: { dataToSubmit: { emailAddress: 'testemail@email.com', token: '123' } } };
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    await user.click(screen.getByTestId('submit-button'));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getAllByText('Enter your full name')).toHaveLength(2);
    expect(screen.getAllByText('Enter your company name')).toHaveLength(2);
    expect(screen.getAllByText('Enter a telephone number')).toHaveLength(2);
    expect(screen.getAllByText('Select an international dialling code')).toHaveLength(2);
    expect(screen.getAllByText('Select a country')).toHaveLength(2);
    expect(screen.getAllByText('Select yes if your company is a shipping agent')).toHaveLength(2);
  });

  it('should display the error messages if fields are formatted incorrectly', async () => {
    mockUseLocationState = { state: { dataToSubmit: { emailAddress: 'testemail@email.com', token: '123' } } };
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    await user.type(screen.getByLabelText('International dialling code'), 'abc');
    await user.type(screen.getByLabelText('Telephone number'), 'abc');
    await user.type(screen.getByLabelText('Country'), 'Australia');
    await user.click(screen.getByTestId('submit-button'));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getAllByText('Telephone number must be in the correct format')).toHaveLength(2);
  });

  it('should NOT display error messagess if fields are valid', async () => {
    mockUseLocationState = { state: { dataToSubmit: { emailAddress: 'testemail@email.com', token: '123' } } };
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    await user.type(screen.getByLabelText('Full name'), 'Joe Bloggs');
    await user.type(screen.getByLabelText('Your company name'), 'Joe Bloggs Company');
    await user.type(screen.getByLabelText('Telephone number'), '(123)-123.456+123 12'); // all these characters should be valid
    await user.click(screen.getByRole('radio', { name: 'Yes' }));
    await user.type(screen.getByRole('combobox', { name: 'International dialling code' }), '44');
    await user.click(screen.getByText('+44 (United Kingdom of Great Britain and Northern Ireland)'));
    await user.type(screen.getByRole('combobox', { name: 'Country' }), 'Aus');
    await user.click(screen.getByText('Australia'));

    await user.click(screen.getByTestId('submit-button'));
    expect(screen.queryByText('There is a problem')).not.toBeInTheDocument();
    expect(screen.queryByText('Enter your full name')).not.toBeInTheDocument();
    expect(screen.queryByText('Enter your company name')).not.toBeInTheDocument();
    expect(screen.queryByText('Select an international dialling code')).not.toBeInTheDocument();
    expect(screen.queryByText('Enter a telephone number')).not.toBeInTheDocument();
    expect(screen.queryByText('Telephone number must be in the correct format')).not.toBeInTheDocument();
    expect(screen.queryByText('Select a country')).not.toBeInTheDocument();
    expect(screen.queryByText('Select yes if your company is a shipping agent')).not.toBeInTheDocument();
  });

  it('should NOT clear form session data on submit', async () => {
    mockUseLocationState = { state: { dataToSubmit: { emailAddress: 'testemail@email.com', token: '123' } } };
    const user = userEvent.setup();
    const expectedStoredData = '{"fullName":"Joe Bloggs","companyName":"Joe Bloggs Company","telephoneNumber":"12345","shippingAgent":"yes","diallingCode":"+44 (United Kingdom of Great Britain and Northern Ireland)","diallingCodeExpandedDetails":{"diallingCode":{"Identifier":234,"alphaCode":"GBR","countryName":"United Kingdom of Great Britain and Northern Ireland","dialCode":"44"}},"country":"Australia","countryExpandedDetails":{"country":{"Identifier":14,"alphaCode":"AUS","countryName":"Australia","dialCode":"61"}}}';
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);

    await user.type(screen.getByLabelText('Full name'), 'Joe Bloggs');
    await user.type(screen.getByLabelText('Your company name'), 'Joe Bloggs Company');
    await user.type(screen.getByLabelText('Telephone number'), '12345');
    await user.click(screen.getByRole('radio', { name: 'Yes' }));
    await user.type(screen.getByRole('combobox', { name: 'International dialling code' }), '44');
    await user.click(screen.getByText('+44 (United Kingdom of Great Britain and Northern Ireland)'));
    await user.type(screen.getByRole('combobox', { name: 'Country' }), 'Aus');
    await user.click(screen.getByText('Australia'));

    await user.click(screen.getByTestId('submit-button'));
    expect(window.sessionStorage.getItem('formData')).toStrictEqual(expectedStoredData);
  });

  it('should display international dialling code question with the format +nn (xxxx)', async () => {
    const user = userEvent.setup();
    mockUseLocationState = { state: { dataToSubmit: { emailAddress: 'testemail@email.com', token: '123' } } };
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    await user.type(screen.getByRole('combobox', { name: 'International dialling code' }), '44');

    expect(screen.getByText('+244 (Angola)')).toBeInTheDocument();
    expect(screen.getByText('+1-441 (Bermuda)')).toBeInTheDocument();
    expect(screen.getByText('+44 (Guernsey)')).toBeInTheDocument();
    expect(screen.getByText('+44 (Isle of Man)')).toBeInTheDocument();
    expect(screen.getByText('+44 (Jersey)')).toBeInTheDocument();
    expect(screen.getByText('+44 (United Kingdom of Great Britain and Northern Ireland)')).toBeInTheDocument();
    expect(screen.queryByText('+61 (Australia)')).not.toBeInTheDocument();
  });

  it('should return a dialling code when the country name is typed', async () => {
    const user = userEvent.setup();
    mockUseLocationState = { state: { dataToSubmit: { emailAddress: 'testemail@email.com', token: '123' } } };
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    await user.type(screen.getByRole('combobox', { name: 'International dialling code' }), 'Aus');

    expect(screen.getByText('+61 (Australia)')).toBeInTheDocument();
    expect(screen.getByText('+43 (Austria)')).toBeInTheDocument();
    expect(screen.queryByText('+1-441 (Bermuda)')).not.toBeInTheDocument();
  });

  it('should return a country when the name is typed', async () => {
    const user = userEvent.setup();
    mockUseLocationState = { state: { dataToSubmit: { emailAddress: 'testemail@email.com', token: '123' } } };
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    await user.type(screen.getByRole('combobox', { name: 'Country' }), 'Uni');

    expect(screen.getByText('United Arab Emirates (the)')).toBeInTheDocument();
    expect(screen.getByText('Reunion')).toBeInTheDocument();
    expect(screen.getByText('Tanzania, the United Republic of')).toBeInTheDocument();
    expect(screen.getByText('Tunisia')).toBeInTheDocument();
    expect(screen.getByText('United Kingdom of Great Britain and Northern Ireland')).toBeInTheDocument();
    expect(screen.getByText('United States Minor Outlying Islands (the)')).toBeInTheDocument();
    expect(screen.getByText('United States of America (the)')).toBeInTheDocument();
    expect(screen.queryByText('Burundi')).not.toBeInTheDocument();
  });

  it('should return a country when the alphacode is typed', async () => {
    const user = userEvent.setup();
    mockUseLocationState = { state: { dataToSubmit: { emailAddress: 'testemail@email.com', token: '123' } } };
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    await user.type(screen.getByRole('combobox', { name: 'Country' }), 'GB');

    expect(screen.getByText('United Kingdom of Great Britain and Northern Ireland')).toBeInTheDocument();
    expect(screen.getByText('Virgin Islands (British)')).toBeInTheDocument();
    expect(screen.queryByText('Australia')).not.toBeInTheDocument();
  });
});
