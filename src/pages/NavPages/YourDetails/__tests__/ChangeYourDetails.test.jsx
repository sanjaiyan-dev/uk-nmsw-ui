import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { GENERIC_CONFIRMATION_URL, YOUR_DETAILS_PAGE_URL } from '../../../../constants/AppUrlConstants';
import ChangeYourDetails from '../ChangeYourDetails';

let mockUseLocationState = {};
const mockedUseNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedUseNavigate,
  useLocation: jest.fn().mockImplementation(() => mockUseLocationState),
}));

describe('Change your details tests', () => {
  const handleSubmit = jest.fn();

  beforeEach(() => {
    mockUseLocationState = {};
    window.sessionStorage.clear();
  });

  it('should render h1', () => {
    render(<MemoryRouter><ChangeYourDetails /></MemoryRouter>);
    expect(screen.getByText('Change your details')).toBeInTheDocument();
  });

  it('should render a full name question', () => {
    render(<MemoryRouter><ChangeYourDetails /></MemoryRouter>);
    expect(screen.getByLabelText('Full name')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Full name' }).outerHTML).toEqual('<input class="govuk-input" id="fullName-input" name="fullName" type="text" value="">');
  });

  it('should render a company name question', () => {
    render(<MemoryRouter><ChangeYourDetails /></MemoryRouter>);
    expect(screen.getByLabelText('Your company name')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Your company name' }).outerHTML).toEqual('<input class="govuk-input" id="companyName-input" name="companyName" type="text" value="">');
  });

  it('should render an international dialling code question', () => {
    render(<MemoryRouter><ChangeYourDetails /></MemoryRouter>);
    expect(screen.getByLabelText('International dialling code')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'International dialling code' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'International dialling code' }).outerHTML).toEqual('<input aria-expanded="false" aria-activedescendant="false" aria-owns="diallingCode-input__listbox" aria-autocomplete="list" aria-describedby="diallingCode-input__assistiveHint" autocomplete="off" class="autocomplete__input autocomplete__input--default" id="diallingCode-input" name="diallingCode" placeholder="" type="text" role="combobox" value="">');
  });

  it('should render a phone number question', () => {
    render(<MemoryRouter><ChangeYourDetails /></MemoryRouter>);
    expect(screen.getByLabelText('Telephone number')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Telephone number' })).toBeInTheDocument();
  });

  it('should render a country question', () => {
    render(<MemoryRouter><ChangeYourDetails /></MemoryRouter>);
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Country' }).outerHTML).toEqual('<input aria-expanded="false" aria-activedescendant="false" aria-owns="country-input__listbox" aria-autocomplete="list" aria-describedby="country-input__assistiveHint" autocomplete="off" class="autocomplete__input autocomplete__input--default" id="country-input" name="country" placeholder="" type="text" role="combobox" value="">');
  });

  it('should render a continue button', () => {
    render(<MemoryRouter><ChangeYourDetails /></MemoryRouter>);
    expect(screen.getByRole('button', { name: 'Continue' }).outerHTML).toEqual('<button type="button" class="govuk-button" data-module="govuk-button" data-testid="submit-button">Continue</button>');
  });

  it('should display international dialling code question with the format +nn (xxxx)', async () => {
    const user = userEvent.setup();
    mockUseLocationState = { state: { dataToSubmit: { emailAddress: 'testemail@email.com', token: '123' } } };
    render(<MemoryRouter><ChangeYourDetails /></MemoryRouter>);
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
    render(<MemoryRouter><ChangeYourDetails /></MemoryRouter>);
    await user.type(screen.getByRole('combobox', { name: 'International dialling code' }), 'Aus');

    expect(screen.getByText('+61 (Australia)')).toBeInTheDocument();
    expect(screen.getByText('+43 (Austria)')).toBeInTheDocument();
    expect(screen.queryByText('+1-441 (Bermuda)')).not.toBeInTheDocument();
  });

  it('should return a country when the name is typed', async () => {
    const user = userEvent.setup();
    mockUseLocationState = { state: { dataToSubmit: { emailAddress: 'testemail@email.com', token: '123' } } };
    render(<MemoryRouter><ChangeYourDetails /></MemoryRouter>);
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
    render(<MemoryRouter><ChangeYourDetails /></MemoryRouter>);
    await user.type(screen.getByRole('combobox', { name: 'Country' }), 'GB');

    expect(screen.getByText('United Kingdom of Great Britain and Northern Ireland')).toBeInTheDocument();
    expect(screen.getByText('Virgin Islands (British)')).toBeInTheDocument();
    expect(screen.queryByText('Australia')).not.toBeInTheDocument();
  });

  it('should NOT call the handleSubmit function on button click if there ARE errors', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ChangeYourDetails /></MemoryRouter>);
    await user.click(screen.getByTestId('submit-button'));
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('should display the Error Summary if there are errors', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ChangeYourDetails /></MemoryRouter>);
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
  });

  it('should display the required error messages if required fields are null', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ChangeYourDetails /></MemoryRouter>);
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getAllByText('Enter your full name')).toHaveLength(2);
    expect(screen.getAllByText('Enter your company name')).toHaveLength(2);
    expect(screen.getAllByText('Enter an international dialling code')).toHaveLength(2);
    expect(screen.getAllByText('Enter a telephone number')).toHaveLength(2);
    expect(screen.getAllByText('Enter country')).toHaveLength(2);
  });

  it('should NOT display error messagess if fields are valid', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ChangeYourDetails /></MemoryRouter>);
    await user.type(screen.getByLabelText('Full name'), 'Joe Bloggs');
    await user.type(screen.getByLabelText('Your company name'), 'Joe Bloggs Company');
    await user.type(screen.getByLabelText('Telephone number'), '12345');
    await user.type(screen.getByRole('combobox', { name: 'International dialling code' }), '44');
    await user.click(screen.getByText('+44 (United Kingdom of Great Britain and Northern Ireland)'));
    await user.type(screen.getByRole('combobox', { name: 'Country' }), 'Aus');
    await user.click(screen.getByText('Australia'));
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.queryByText('There is a problem')).not.toBeInTheDocument();
    expect(screen.queryByText('Enter your full name')).not.toBeInTheDocument();
    expect(screen.queryByText('Enter your company name')).not.toBeInTheDocument();
    expect(screen.queryByText('Enter an international dialling code')).not.toBeInTheDocument();
    expect(screen.queryByText('Enter a telephone number')).not.toBeInTheDocument();
    expect(screen.queryByText('Enter country')).not.toBeInTheDocument();
  });

  it('should take user to a confirmation page is there are no errors', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ChangeYourDetails /></MemoryRouter>);

    await user.type(screen.getByLabelText('Full name'), 'Joe Bloggs');
    await user.type(screen.getByLabelText('Your company name'), 'Joe Bloggs Company');
    await user.type(screen.getByLabelText('Telephone number'), '12345');
    await user.type(screen.getByRole('combobox', { name: 'International dialling code' }), '44');
    await user.click(screen.getByText('+44 (United Kingdom of Great Britain and Northern Ireland)'));
    await user.type(screen.getByRole('combobox', { name: 'Country' }), 'Aus');
    await user.click(screen.getByText('Australia'));
    await user.click(screen.getByTestId('submit-button'));

    expect(mockedUseNavigate).toHaveBeenCalledWith(
      GENERIC_CONFIRMATION_URL,
      {
        state: {
          pageTitle: 'Change your details confirmation',
          nextPageLink: YOUR_DETAILS_PAGE_URL,
          nextPageName: 'your details',
          confirmationMessage: 'Your details have been saved',
        },
      },
    );
  });
});
