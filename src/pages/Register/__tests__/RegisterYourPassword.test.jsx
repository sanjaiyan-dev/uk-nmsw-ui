import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { REGISTER_ACCOUNT_ENDPOINT, TOKEN_INVALID } from '../../../constants/AppAPIConstants';
import {
  MESSAGE_URL, REGISTER_CONFIRMATION_URL, REGISTER_EMAIL_RESEND_URL, REGISTER_PASSWORD_URL,
} from '../../../constants/AppUrlConstants';
import RegisterYourPassword from '../RegisterYourPassword';

let mockUseLocationState = { state: {} };
const mockedUseNavigate = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedUseNavigate,
  useLocation: jest.fn().mockImplementation(() => mockUseLocationState),
}));

describe('Register password tests', () => {
  const handleSubmit = jest.fn();
  const mockAxios = new MockAdapter(axios);
  const scrollIntoViewMock = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

  beforeEach(() => {
    mockAxios.reset();
    mockUseLocationState = { state: {} };
    window.sessionStorage.clear();
  });

  it('should render h1', async () => {
    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    expect(screen.getByText('Create a password')).toBeInTheDocument();
  });

  it('should render an intro', async () => {
    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    expect(screen.getByText('Your password must be at least 10 characters long. There is no restriction on the characters you use.')).toBeInTheDocument();
    /*
     * Because the text below is in a paragraph which has a link within it, RTL struggles to find the text in the render
     * We could test by adding a data-testId
     * but we can also test more easily with the Cypress tests
     * so leaving this line for the Cypress tests
     */
    // expect(screen.getByText('To create a long and strong password, the National Cyber Security Centre recommends using ')).toBeInTheDocument();
    expect(screen.getByText('3 random words')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://www.ncsc.gov.uk/collection/top-tips-for-staying-secure-online/three-random-words#:~:text=Why%20does%20the%20NCSC%20recommend,enough%20for%20you%20to%20remember');
  });

  it('should render two password questions', async () => {
    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Password').outerHTML).toEqual('<input class="govuk-input" id="requirePassword-input" data-testid="requirePassword-passwordField" name="requirePassword" type="password" value="">');
    expect(screen.getByLabelText('Confirm your password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm your password').outerHTML).toEqual('<input class="govuk-input" id="repeatPassword-input" data-testid="repeatPassword-passwordField" name="repeatPassword" type="password" value="">');
  });

  it('should render a continue button', async () => {
    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    expect(screen.getByRole('button', { name: 'Continue' }).outerHTML).toEqual('<button type="button" class="govuk-button" data-module="govuk-button" data-testid="submit-button">Continue</button>');
  });

  it('should NOT call the handleSubmit function on button click if there ARE errors', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    await user.click(screen.getByTestId('submit-button'));
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('should display the Error Summary if there are errors', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
  });

  it('should display the required error messages if required fields are null', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getAllByText('Enter a password')).toHaveLength(2);
    expect(screen.getAllByText('Confirm your password')).toHaveLength(3); // label & 2 error messages
  });

  it('should display the required error messages if just confirm password is null', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    await user.type(screen.getByLabelText('Password'), 'mypasswordis');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getAllByText('Confirm your password')).toHaveLength(3);
  });

  it('should display the min length error messages if password value too short', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    await user.type(screen.getByLabelText('Password'), 'shortpwd');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getAllByText('Passwords must be at least 10 characters long')).toHaveLength(2);
  });

  it('should display the error messages if password values do not match', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    await user.type(screen.getByLabelText('Password'), 'mypasswordis');
    await user.type(screen.getByLabelText('Confirm your password'), 'mypass');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getAllByText('Passwords must match')).toHaveLength(2);
  });

  it('should display the error messages if password values do not match only due to capitalisation', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    await user.type(screen.getByLabelText('Password'), 'mypasswordis');
    await user.type(screen.getByLabelText('Confirm your password'), 'myPasswordIs');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getAllByText('Passwords must match')).toHaveLength(2);
  });

  it('should display the error messages if password value has spaces', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterYourPassword state={{ dataToSubmit: { sampleField: 'field value', secondField: 'second value' } }} /></MemoryRouter>);
    await user.type(screen.getByLabelText('Password'), 'my password');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getAllByText('Enter a password that does not contain spaces')).toHaveLength(2);
  });

  it('should display the error messages if password value has spaces at the start', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterYourPassword state={{ dataToSubmit: { sampleField: 'field value', secondField: 'second value' } }} /></MemoryRouter>);
    await user.type(screen.getByLabelText('Password'), ' mypassword');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getAllByText('Enter a password that does not contain spaces')).toHaveLength(2);
  });

  it('should display the error messages if password value has spaces at the end', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterYourPassword state={{ dataToSubmit: { sampleField: 'field value', secondField: 'second value' } }} /></MemoryRouter>);
    await user.type(screen.getByLabelText('Password'), 'mypassword ');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getAllByText('Enter a password that does not contain spaces')).toHaveLength(2);
  });

  it('should display the required error messages if password value is only spaces', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterYourPassword state={{ dataToSubmit: { sampleField: 'field value', secondField: 'second value' } }} /></MemoryRouter>);
    await user.type(screen.getByLabelText('Password'), '          ');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getAllByText('Enter a password')).toHaveLength(2);
    expect(screen.queryByText('Enter a password that does not contain spaces')).not.toBeInTheDocument();
  });

  it('should display the min length error message if password has spaces and is fewer than 10 characters', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterYourPassword state={{ dataToSubmit: { sampleField: 'field value', secondField: 'second value' } }} /></MemoryRouter>);
    await user.type(screen.getByLabelText('Password'), '   s');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getAllByText('Passwords must be at least 10 characters long')).toHaveLength(2);
    expect(screen.queryByText('Enter a password that does not contain spaces')).not.toBeInTheDocument();
  });

  it('should NOT display error messagess if fields are valid', async () => {
    const user = userEvent.setup();
    mockAxios
      .onPatch(REGISTER_ACCOUNT_ENDPOINT)
      .reply(200, {
        email: 'testemail@email.com',
        fullName: 'Joe Bloggs',
        country: 'GBR',
        // phoneNumber: '(44)123123123',
        password: 'abc1234567',
        groupName: 'My Corporation',
        groupTypeName: 'Shipping Agency',
        token: 'tokennumber',
      });

    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    await user.type(screen.getByLabelText('Password'), 'mypasswordis');
    await user.type(screen.getByLabelText('Confirm your password'), 'mypasswordis');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.queryByText('There is a problem')).not.toBeInTheDocument();
    expect(screen.queryByText('Enter a password')).not.toBeInTheDocument();
    expect(screen.getAllByText('Confirm your password')).toHaveLength(1); // label only
  });

  it('should persist data from previous form (state.dataToSubmit) in session as well as new fields', async () => {
    const user = userEvent.setup();
    // const expectedStoredData = '{"fullName":"Joe Bloggs","companyName":"My company","phoneNumber":"(123)12345","country":"AUS","shippingAgent":"yes","requirePassword":"mypasswordis","repeatPassword":"mypasswordis"}';
    const expectedStoredData = '{"fullName":"Joe Bloggs","companyName":"My company","country":"AUS","shippingAgent":"yes","requirePassword":"mypasswordis","repeatPassword":"mypasswordis"}';
    mockUseLocationState.state = {
      dataToSubmit: {
        companyName: 'My company',
        country: 'AUS',
        emailAddress: 'testemail@email.com',
        fullName: 'Joe Bloggs',
        // phoneNumber: '(123)12345',
        shippingAgent: 'yes',
      },
    };
    mockAxios
      .onPatch(REGISTER_ACCOUNT_ENDPOINT)
      .reply(200, {
        email: 'testemail@email.com',
        fullName: 'Joe Bloggs',
        country: 'GBR',
        // phoneNumber: '(44)123123123',
        password: 'abc1234567',
        groupName: 'My Corporation',
        groupTypeName: 'Shipping Agency',
        token: 'tokennumber',
        id: '123',
        groupId: '456',
        verified: false,
        dateCreated: '2022-12-14T10:10:17.134835',
        lastUpdated: '2022-12-14T14:20:23.497658',
      });

    // set what would be in the session prior to this page
    window.sessionStorage.setItem('formData', JSON.stringify({
      fullName: 'Joe Bloggs', companyName: 'My company', country: 'AUS', shippingAgent: 'yes',
      // fullName: 'Joe Bloggs', companyName: 'My company', phoneNumber: '(123)12345', country: 'AUS', shippingAgent: 'yes',
    }));
    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    await user.type(screen.getByLabelText('Password'), 'mypasswordis');
    await user.type(screen.getByLabelText('Confirm your password'), 'mypasswordis');
    expect(window.sessionStorage.getItem('formData')).toStrictEqual(expectedStoredData);
    // after successful submit session data should clear
    await user.click(screen.getByTestId('submit-button'));
    await waitFor(() => {
      expect(window.sessionStorage.getItem('formData')).toStrictEqual(null);
    });
  });

  it('should navigate to confirmation page if successful PATCH response', async () => {
    const user = userEvent.setup();
    mockAxios
      .onPatch(REGISTER_ACCOUNT_ENDPOINT)
      .reply(200, {
        email: 'testemail@email.com',
        fullName: 'Joe Bloggs',
        country: 'GBR',
        // phoneNumber: '(44)123123123',
        password: 'abc1234567',
        groupName: 'My company',
        groupTypeName: 'Shipping Agency',
        token: 'tokennumber',
        id: '123',
        groupId: '456',
        verified: false,
        dateCreated: '2022-12-14T10:10:17.134835',
        lastUpdated: '2022-12-14T14:20:23.497658',
      });

    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    await user.type(screen.getByLabelText('Password'), 'mypasswordis');
    await user.type(screen.getByLabelText('Confirm your password'), 'mypasswordis');
    await user.click(screen.getByTestId('submit-button'));
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(REGISTER_CONFIRMATION_URL, { state: { companyName: 'My company' } });
    });
  });

  it('should navigate to error page if PATCH response returns invalid token', async () => {
    const user = userEvent.setup();
    mockAxios
      .onPatch(REGISTER_ACCOUNT_ENDPOINT)
      .reply(401, {
        message: TOKEN_INVALID,
      });

    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    await user.type(screen.getByLabelText('Password'), 'mypasswordis');
    await user.type(screen.getByLabelText('Confirm your password'), 'mypasswordis');
    await user.click(screen.getByTestId('submit-button'));
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(MESSAGE_URL, {
        state: {
          title: 'Verification link has expired',
          button: {
            buttonLabel: 'Request a new link',
            buttonNavigateTo: REGISTER_EMAIL_RESEND_URL,
          },
        },
      });
    });
  });

  it('should navigate to error page if PATCH response returns axios error', async () => {
    const user = userEvent.setup();
    mockAxios
      .onPatch(REGISTER_ACCOUNT_ENDPOINT)
      .reply({
        message: 'Network Error',
      });

    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    await user.type(screen.getByLabelText('Password'), 'mypasswordis');
    await user.type(screen.getByLabelText('Confirm your password'), 'mypasswordis');
    await user.click(screen.getByTestId('submit-button'));
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(MESSAGE_URL, { state: { title: 'Something has gone wrong', redirectURL: REGISTER_PASSWORD_URL } });
    });
  });

  it('should navigate to error page if PATCH response returns 500 error', async () => {
    const user = userEvent.setup();
    mockAxios
      .onPatch(REGISTER_ACCOUNT_ENDPOINT)
      .reply(500);

    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    await user.type(screen.getByLabelText('Password'), 'mypasswordis');
    await user.type(screen.getByLabelText('Confirm your password'), 'mypasswordis');
    await user.click(screen.getByTestId('submit-button'));
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(MESSAGE_URL, { state: { title: 'Something has gone wrong', redirectURL: REGISTER_PASSWORD_URL } });
    });
  });

  it('should navigate to error page if PATCH response returns unknown error', async () => {
    const user = userEvent.setup();
    mockAxios
      .onPatch(REGISTER_ACCOUNT_ENDPOINT)
      .reply(400, {
        message: 'an error we do not handle',
      });

    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    await user.type(screen.getByLabelText('Password'), 'mypasswordis');
    await user.type(screen.getByLabelText('Confirm your password'), 'mypasswordis');
    await user.click(screen.getByTestId('submit-button'));
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(MESSAGE_URL, { state: { title: 'Something has gone wrong', message: 'an error we do not handle', redirectURL: REGISTER_PASSWORD_URL } });
    });
  });
});
