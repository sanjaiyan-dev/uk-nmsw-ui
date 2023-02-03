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

describe('Your details tests', () => {
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
    expect(screen.getByRole('textbox', { name: 'International dialling code' })).toBeInTheDocument();
  });

  it('should render a phone number question', () => {
    render(<MemoryRouter><ChangeYourDetails /></MemoryRouter>);
    expect(screen.getByLabelText('Telephone number')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Telephone number' })).toBeInTheDocument();
  });

  it('should render a country question', () => {
    render(<MemoryRouter><ChangeYourDetails /></MemoryRouter>);
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Country' }).outerHTML).toEqual('<input class="govuk-input" id="country-input" name="country" type="text" value="">');
  });

  it('should render a continue button', () => {
    render(<MemoryRouter><ChangeYourDetails /></MemoryRouter>);
    expect(screen.getByRole('button', { name: 'Continue' }).outerHTML).toEqual('<button type="button" class="govuk-button" data-module="govuk-button" data-testid="submit-button">Continue</button>');
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
    expect(screen.getAllByText('Enter your international dialling code')).toHaveLength(2);
    expect(screen.getAllByText('Enter your telephone number')).toHaveLength(2);
    expect(screen.getAllByText('Enter country')).toHaveLength(2);
  });

  it('should display the error messages if fields are formatted incorrectly', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ChangeYourDetails /></MemoryRouter>);
    await user.type(screen.getByLabelText('Country'), 'Australia');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getAllByText('Enter 3 digit country code')).toHaveLength(2);
  });

  it('should NOT display error messagess if fields are valid', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ChangeYourDetails /></MemoryRouter>);
    await user.type(screen.getByLabelText('Full name'), 'Joe Bloggs');
    await user.type(screen.getByLabelText('Your company name'), 'Joe Bloggs Company');
    await user.type(screen.getByLabelText('International dialling code'), '123');
    await user.type(screen.getByLabelText('Telephone number'), '12345');
    await user.type(screen.getByLabelText('Country'), 'AUS');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.queryByText('There is a problem')).not.toBeInTheDocument();
    expect(screen.queryByText('Enter your full name')).not.toBeInTheDocument();
    expect(screen.queryByText('Enter your company name')).not.toBeInTheDocument();
    expect(screen.queryByText('Enter your international dialling code')).not.toBeInTheDocument();
    expect(screen.queryByText('Enter your phone number')).not.toBeInTheDocument();
    expect(screen.queryByText('Enter country')).not.toBeInTheDocument();
  });

  it('should take user to a confirmation page is there are no errors', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ChangeYourDetails /></MemoryRouter>);

    await user.type(screen.getByLabelText('Full name'), 'Joe Bloggs');
    await user.type(screen.getByLabelText('Your company name'), 'Joe Bloggs Company');
    await user.type(screen.getByLabelText('International dialling code'), '123');
    await user.type(screen.getByLabelText('Telephone number'), '12345');
    await user.type(screen.getByLabelText('Country'), 'AUS');
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
