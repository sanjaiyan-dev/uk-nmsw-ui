import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import SignIn from './SignIn';
import { SIGN_IN_ENDPOINT, USER_NOT_VERIFIED, USER_SIGN_IN_DETAILS_INVALID } from '../../constants/AppAPIConstants';
import {
  MESSAGE_URL, REGISTER_EMAIL_RESEND_URL, SIGN_IN_URL, YOUR_VOYAGES_URL,
} from '../../constants/AppUrlConstants';

const mockUseLocationState = { state: {} };
const mockedUseNavigate = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLocation: jest.fn().mockImplementation(() => mockUseLocationState),
  useNavigate: () => mockedUseNavigate,
}));

describe('Sign in tests', () => {
  const scrollIntoViewMock = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

  const mockAxios = new MockAdapter(axios);

  beforeEach(() => {
    mockAxios.reset();
    window.sessionStorage.clear();
  });
  it('should render the sign in page', () => {
    render(<MemoryRouter><SignIn /></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Sign in');
    expect(screen.getByTestId('submit-button')).toHaveTextContent('Sign in');
  });

  it('should display an input field for email', () => {
    render(<MemoryRouter><SignIn /></MemoryRouter>);
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /email/i }).outerHTML).toEqual('<input class="govuk-input" id="email-input" name="email" type="email" autocomplete="email" value="">');
  });

  it('should display a link to create account', () => {
    render(<MemoryRouter><SignIn /></MemoryRouter>);
    expect(screen.getByText('create one now')).toBeInTheDocument();
    expect(screen.getByText('create one now').outerHTML).toEqual('<a href="/create-account/email-address">create one now</a>');
  });

  it('should display an input field for password', () => {
    render(<MemoryRouter><SignIn /></MemoryRouter>);
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByTestId('password-passwordField')).toHaveAttribute('type', 'password');
    expect(screen.getByTestId('password-passwordField').outerHTML).toEqual('<input class="govuk-input" id="password-input" data-testid="password-passwordField" name="password" type="password" value="">');
  });

  it('should display a primary styled sign in button', () => {
    render(<MemoryRouter><SignIn /></MemoryRouter>);
    expect((screen.getByTestId('submit-button')).outerHTML).toEqual('<button type="button" class="govuk-button" data-module="govuk-button" data-testid="submit-button">Sign in</button>');
  });

  it('should NOT call the login function on sign in button click if there ARE errors', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><SignIn /></MemoryRouter>);
    await user.click(screen.getByTestId('submit-button'));
    expect(mockedUseNavigate).not.toHaveBeenCalled();
  });

  it('should display the Error Summary if there are errors', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><SignIn /></MemoryRouter>);
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
  });

  it('should display the email required error if there is no email address', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><SignIn /></MemoryRouter>);
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getAllByText('Enter your email address')).toHaveLength(2);
  });

  it('should scroll to email field and set focus on email input if user clicks on email required error link', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><SignIn /></MemoryRouter>);
    await user.click(screen.getByTestId('submit-button'));
    await user.click(screen.getByRole('button', { name: 'Enter your email address' }));
    expect(scrollIntoViewMock).toHaveBeenCalled();
    expect(screen.getByRole('textbox', { name: /email/i })).toHaveFocus();
  });

  it('should display the email invalid error if the email address has no @', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><SignIn /></MemoryRouter>);
    await user.type(screen.getByRole('textbox', { name: /email/i }), 'testemail');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getAllByText('Enter your email address in the correct format, like name@example.com')).toHaveLength(2);
  });

  it('should display the email invalid error if the email address has no .xx', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><SignIn /></MemoryRouter>);
    await user.type(screen.getByRole('textbox', { name: /email/i }), 'testemail@boo');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getAllByText('Enter your email address in the correct format, like name@example.com')).toHaveLength(2);
  });

  it('should scroll to email field and set focus on email input if user clicks on email invalid format error link', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><SignIn /></MemoryRouter>);
    await user.type(screen.getByRole('textbox', { name: /email/i }), 'testemail@boo');
    await user.click(screen.getByTestId('submit-button'));
    await user.click(screen.getByRole('button', { name: 'Enter your email address in the correct format, like name@example.com' }));
    expect(scrollIntoViewMock).toHaveBeenCalled();
    expect(screen.getByRole('textbox', { name: /email/i })).toHaveFocus();
  });

  it('should NOT display the email errors if the email address is a valid format', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><SignIn /></MemoryRouter>);
    await user.type(screen.getByRole('textbox', { name: /email/i }), 'testemail@email.com');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.queryByText('Enter your email address')).not.toBeInTheDocument();
    expect(screen.queryByText('Enter your email address in the correct format, like name@example.com')).not.toBeInTheDocument();
  });

  it('should display the password required error if there is no password', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><SignIn /></MemoryRouter>);
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getAllByText('Enter your password')).toHaveLength(2);
  });

  it('should scroll to password field and set focus on password input if user clicks on password required error link', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><SignIn /></MemoryRouter>);
    await user.click(screen.getByTestId('submit-button'));
    await user.click(screen.getByRole('button', { name: 'Enter your password' }));
    expect(scrollIntoViewMock).toHaveBeenCalled();
    expect(screen.getByTestId('password-passwordField')).toHaveFocus();
  });

  it('should NOT display the password required error if a password is entered', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><SignIn /></MemoryRouter>);
    await user.type(screen.getByTestId('password-passwordField'), 'testpassword');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.queryByText('Enter your password')).not.toBeInTheDocument();
  });

  it('should call the login function on sign in button click if there are no errors', async () => {
    const user = userEvent.setup();

    mockAxios
      .onPost(SIGN_IN_ENDPOINT)
      .reply(200, {
        token: '123',
      });

    render(<MemoryRouter><SignIn /></MemoryRouter>);

    await user.type(screen.getByRole('textbox', { name: /email/i }), 'testemail@email.com');
    await user.type(screen.getByTestId('password-passwordField'), 'testpassword');
    await user.click(screen.getByTestId('submit-button'));
    expect(mockedUseNavigate).toHaveBeenCalledWith(YOUR_VOYAGES_URL);
  });

  it('should store token in session storage if sign in is successful', async () => {
    const user = userEvent.setup();

    mockAxios
      .onPost(SIGN_IN_ENDPOINT)
      .reply(200, {
        token: '123',
      });

    render(<MemoryRouter><SignIn /></MemoryRouter>);

    await user.type(screen.getByRole('textbox', { name: /email/i }), 'testemail@email.com');
    await user.type(screen.getByTestId('password-passwordField'), 'testpassword');
    await user.click(screen.getByTestId('submit-button'));
    expect(window.sessionStorage.getItem('token')).toEqual('123');
  });

  it('should not clear session storage if user is being redirected to sign in before completing their action AND the newly signed in user is the same as the previously signed in one', async () => {
    mockUseLocationState.state = {
      redirectURL: '/thisurl',
    };
    const user = userEvent.setup();
    /* mock some sessionData that may exist if a user had clicked 'submit' on a form page but their AuthToken had expired */
    window.sessionStorage.setItem('formData', JSON.stringify({ testField: 'Hello Test Field', radioButtonSet: 'radioOne' }));
    const expectedStoredData = '{"testField":"Hello Test Field","radioButtonSet":"radioOne"}';
    mockAxios
      .onPost(SIGN_IN_ENDPOINT)
      .reply(200, {
        token: '123',
      });

    render(<MemoryRouter><SignIn /></MemoryRouter>);

    await user.type(screen.getByRole('textbox', { name: /email/i }), 'testemail@email.com');
    await user.type(screen.getByTestId('password-passwordField'), 'testpassword');
    await user.click(screen.getByTestId('submit-button'));
    expect(mockedUseNavigate).toHaveBeenCalled();
    expect(window.sessionStorage.getItem('formData')).toStrictEqual(expectedStoredData);
  });

  it('should show an error if email and/or password is incorrect', async () => {
    const user = userEvent.setup();

    mockAxios
      .onPost(SIGN_IN_ENDPOINT)
      .reply(401, {
        message: USER_SIGN_IN_DETAILS_INVALID,
      });

    render(<MemoryRouter><SignIn /></MemoryRouter>);

    await user.type(screen.getByRole('textbox', { name: /email/i }), 'testemail@email.com');
    await user.type(screen.getByTestId('password-passwordField'), 'testpassword');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getByText('Email and password combination is invalid')).toBeInTheDocument();
  });

  it('should redirect to re-send verification email page if user is not verified', async () => {
    const user = userEvent.setup();

    mockAxios
      .onPost(SIGN_IN_ENDPOINT)
      .reply(401, {
        message: USER_NOT_VERIFIED,
      });

    render(<MemoryRouter><SignIn /></MemoryRouter>);

    await user.type(screen.getByRole('textbox', { name: /email/i }), 'testemail@email.com');
    await user.type(screen.getByTestId('password-passwordField'), 'testpassword');
    await user.click(screen.getByTestId('submit-button'));
    expect(mockedUseNavigate).toHaveBeenCalledWith(REGISTER_EMAIL_RESEND_URL, { state: { dataToSubmit: { emailAddress: 'testemail@email.com' } } });
  });

  it('should redirect to error page if 500 response received', async () => {
    const user = userEvent.setup();
    mockAxios
      .onPost(SIGN_IN_ENDPOINT)
      .reply(500);

    render(<MemoryRouter><SignIn /></MemoryRouter>);

    await user.type(screen.getByRole('textbox', { name: /email/i }), 'testemail@email.com');
    await user.type(screen.getByTestId('password-passwordField'), 'testpassword');
    await user.click(screen.getByTestId('submit-button'));
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(MESSAGE_URL, { state: { title: 'Something has gone wrong', redirectURL: SIGN_IN_URL } }); // on error we redirect to error page
    });
  });

  it('should clear API error when something is typed into input', async () => {
    const user = userEvent.setup();

    mockAxios
      .onPost(SIGN_IN_ENDPOINT)
      .reply(401, {
        message: USER_SIGN_IN_DETAILS_INVALID,
      });

    render(<MemoryRouter><SignIn /></MemoryRouter>);

    await user.type(screen.getByRole('textbox', { name: /email/i }), 'testemail@email.com');
    await user.type(screen.getByTestId('password-passwordField'), 'testpassword');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getByText('Email and password combination is invalid')).toBeInTheDocument();

    await user.type(screen.getByRole('textbox', { name: /email/i }), 'testemail@email.com');
    expect(screen.queryByText('Email and password combination is invalid')).not.toBeInTheDocument();
  });

  it('should redirect to redirectURL on successful sign in if one in state, and pass the state through', async () => {
    const user = userEvent.setup();
    mockUseLocationState.state = {
      redirectURL: '/thisurl',
      otherState: 'another piece of state',
    };
    mockAxios
      .onPost(SIGN_IN_ENDPOINT)
      .reply(200, {
        token: '123',
      });

    render(<MemoryRouter><SignIn /></MemoryRouter>);

    await user.type(screen.getByRole('textbox', { name: /email/i }), 'testemail@email.com');
    await user.type(screen.getByTestId('password-passwordField'), 'testpassword');
    await user.click(screen.getByTestId('submit-button'));
    expect(mockedUseNavigate).toHaveBeenCalledWith('/thisurl', { state: { redirectURL: '/thisurl', otherState: 'another piece of state' } });
  });
});
