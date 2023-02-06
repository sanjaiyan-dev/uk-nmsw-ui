import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ERROR_VERIFICATION_FAILED_URL } from '../../../constants/AppUrlConstants';
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

  it('should redirect user to other page if there is no state', async () => {
    mockUseLocationState = {};
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(ERROR_VERIFICATION_FAILED_URL);
    });
  });

  it('should redirect user to other page if there is no dataToSubmit object in state', async () => {
    mockUseLocationState = { state: {} };
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(ERROR_VERIFICATION_FAILED_URL);
    });
  });

  it('should redirect user to other page if there is an empty dataToSubmit object in state', async () => {
    mockUseLocationState = { state: { dataToSubmit: {} } };
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(ERROR_VERIFICATION_FAILED_URL);
    });
  });

  it('should redirect user to other page if there is no emailAddress in state', async () => {
    mockUseLocationState = { state: { dataToSubmit: { toke: '123' } } };
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(ERROR_VERIFICATION_FAILED_URL);
    });
  });

  it('should redirect user to other page if there is no token in state', async () => {
    mockUseLocationState = { state: { dataToSubmit: { emailAddress: 'testemail@email.com' } } };
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(ERROR_VERIFICATION_FAILED_URL);
    });
  });

  it('should render h1', async () => {
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    expect(screen.getByText('Your details')).toBeInTheDocument();
  });

  it('should render a full name question', async () => {
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    expect(screen.getByLabelText('Full name')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Full name' }).outerHTML).toEqual('<input class="govuk-input" id="fullName-input" name="fullName" type="text" value="">');
  });

  it('should render a company name question', async () => {
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    expect(screen.getByLabelText('Your company name')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Your company name' }).outerHTML).toEqual('<input class="govuk-input" id="companyName-input" name="companyName" type="text" value="">');
  });

  it('should render an international dialling code question', async () => {
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    expect(screen.getByLabelText('International dialling code')).toBeInTheDocument();
    expect(screen.getByText('For example, 44 for UK')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'International dialling code' })).toBeInTheDocument();
  });

  it('should render a telephone number question', async () => {
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    expect(screen.getByLabelText('Telephone number')).toBeInTheDocument();
    expect(screen.getByText('For example, 7123123123')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Telephone number' })).toBeInTheDocument();
  });

  it('should render a country question', async () => {
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Country' }).outerHTML).toEqual('<input class="govuk-input" id="country-input" name="country" type="text" value="">');
  });

  it('should render a shipping agent question', async () => {
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    expect(screen.getByText('Is your company a shipping agent?')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
    // eslint-disable-next-line max-len
    expect(screen.getByRole('group', { name: 'Is your company a shipping agent?' }).outerHTML).toEqual('<fieldset class="govuk-fieldset"><legend class="govuk-fieldset__legend">Is your company a shipping agent?</legend><div id="shippingAgent-hint" class="govuk-hint"></div><p id="shippingAgent-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> </p><div class="govuk-radios govuk-radios--inline" data-module="govuk-radios"><div class="govuk-radios__item"><input class="govuk-radios__input" id="shippingAgent-input[0]" name="shippingAgent" type="radio" value="yes"><label class="govuk-label govuk-radios__label" for="shippingAgent-input[0]">Yes</label></div><div class="govuk-radios__item"><input class="govuk-radios__input" id="shippingAgent-input[1]" name="shippingAgent" type="radio" value="no"><label class="govuk-label govuk-radios__label" for="shippingAgent-input[1]">No</label></div></div></fieldset>');
  });

  it('should render a continue button', async () => {
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    expect(screen.getByRole('button', { name: 'Continue' }).outerHTML).toEqual('<button type="button" class="govuk-button" data-module="govuk-button" data-testid="submit-button">Continue</button>');
  });

  it('should NOT call the handleSubmit function on button click if there ARE errors', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    await user.click(screen.getByTestId('submit-button'));
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('should display the Error Summary if there are errors', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
  });

  it('should display the required error messages if required fields are null', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getAllByText('Enter your full name')).toHaveLength(2);
    expect(screen.getAllByText('Enter your company name')).toHaveLength(2);
    expect(screen.getAllByText('Enter a telephone number')).toHaveLength(2);
    expect(screen.getAllByText('Enter an international dialling code')).toHaveLength(2);
    expect(screen.getAllByText('Enter country')).toHaveLength(2);
    expect(screen.getAllByText('Select is your company a shipping agent')).toHaveLength(2);
  });

  it('should display the error messages if fields are formatted incorrectly', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    await user.type(screen.getByLabelText('International dialling code'), 'abc');
    await user.type(screen.getByLabelText('Telephone number'), 'abc');
    await user.type(screen.getByLabelText('Country'), 'Australia');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getAllByText('Enter a telephone number in the correct format')).toHaveLength(2);
    expect(screen.getAllByText('Enter an international dialling code in the correct format')).toHaveLength(2);
    expect(screen.getAllByText('Enter 3 digit country code')).toHaveLength(2);
  });

  it('should NOT display error messagess if fields are valid', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);
    await user.type(screen.getByLabelText('Full name'), 'Joe Bloggs');
    await user.type(screen.getByLabelText('Your company name'), 'Joe Bloggs Company');
    await user.type(screen.getByLabelText('International dialling code'), '+44');
    await user.type(screen.getByLabelText('Telephone number'), '(123)-123.456+123 12'); // all these characters should be valid
    await user.type(screen.getByLabelText('Country'), 'AUS');
    await user.click(screen.getByRole('radio', { name: 'Yes' }));
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.queryByText('There is a problem')).not.toBeInTheDocument();
    expect(screen.queryByText('Enter your full name')).not.toBeInTheDocument();
    expect(screen.queryByText('Enter your company name')).not.toBeInTheDocument();
    expect(screen.queryByText('Enter an international dialling code')).not.toBeInTheDocument();
    expect(screen.queryByText('Enter a telephone number')).not.toBeInTheDocument();
    expect(screen.queryByText('Enter a telephone number in the correct format')).not.toBeInTheDocument();
    expect(screen.queryByText('Enter country')).not.toBeInTheDocument();
    expect(screen.queryByText('Select is your company a shipping agent')).not.toBeInTheDocument();
  });

  it('should NOT clear form session data on submit', async () => {
    const user = userEvent.setup();
    const expectedStoredData = '{"fullName":"Joe Bloggs","companyName":"Joe Bloggs Company","diallingCode":"44","telephoneNumber":"12345","country":"AUS","shippingAgent":"yes"}';
    render(<MemoryRouter><RegisterYourDetails /></MemoryRouter>);

    await user.type(screen.getByLabelText('Full name'), 'Joe Bloggs');
    await user.type(screen.getByLabelText('Your company name'), 'Joe Bloggs Company');
    await user.type(screen.getByLabelText('International dialling code'), '44');
    await user.type(screen.getByLabelText('Telephone number'), '12345');
    await user.type(screen.getByLabelText('Country'), 'AUS');
    await user.click(screen.getByRole('radio', { name: 'Yes' }));

    await user.click(screen.getByTestId('submit-button'));
    expect(window.sessionStorage.getItem('formData')).toStrictEqual(expectedStoredData);
  });
});
