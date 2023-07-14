import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import SignIn from '../SignIn';
import {
  SIGN_IN_ENDPOINT,
  USER_MUST_UPDATE_PASSWORD,
  USER_NOT_VERIFIED,
  USER_SIGN_IN_DETAILS_INVALID,
} from '../../../constants/AppAPIConstants';
import {
  MESSAGE_URL,
  SIGN_IN_URL,
  LOGGED_IN_LANDING,
  REQUEST_PASSWORD_RESET_URL,
} from '../../../constants/AppUrlConstants';

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

  // Currently we are not showing any link to create an account
  // it('should display a link to create account', () => {
  //   render(<MemoryRouter><SignIn /></MemoryRouter>);
  //   expect(screen.getByText('create one now')).toBeInTheDocument();
  //   expect(screen.getByText('create one now').outerHTML).toEqual('<a class="govuk-link" href="/create-account/email-address">create one now</a>');
  // });

  it('should display an input field for password', () => {
    render(<MemoryRouter><SignIn /></MemoryRouter>);
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByTestId('password-passwordField')).toHaveAttribute('type', 'password');
    expect(screen.getByTestId('password-passwordField').outerHTML).toEqual('<input class="govuk-input" id="password-input" data-testid="password-passwordField" name="password" type="password" value="">');
  });

  it('should display a primary styled sign in button', () => {
    render(<MemoryRouter><SignIn /></MemoryRouter>);
    expect((screen.getByTestId('submit-button')).outerHTML).toEqual('<button type="submit" class="govuk-button" data-module="govuk-button" data-testid="submit-button">Sign in</button>');
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
    await screen.findByRole('heading', { name: 'There is a problem' });
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
    expect(screen.getAllByText('Enter a real email address')).toHaveLength(2);
  });

  it('should display the email invalid error if the email address has no .xx', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><SignIn /></MemoryRouter>);
    await user.type(screen.getByRole('textbox', { name: /email/i }), 'testemail@boo');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getAllByText('Enter a real email address')).toHaveLength(2);
  });

  it('should scroll to email field and set focus on email input if user clicks on email invalid format error link', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><SignIn /></MemoryRouter>);
    await user.type(screen.getByRole('textbox', { name: /email/i }), 'testemail@boo');
    await user.click(screen.getByTestId('submit-button'));
    await screen.findByRole('button', { name: 'Enter a real email address' });
    await user.click(screen.getByRole('button', { name: 'Enter a real email address' }));
    expect(scrollIntoViewMock).toHaveBeenCalled();
    expect(screen.getByRole('textbox', { name: /email/i })).toHaveFocus();
  });

  it('should NOT display the email errors if the email address is a valid format', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><SignIn /></MemoryRouter>);
    await user.type(screen.getByRole('textbox', { name: /email/i }), 'testemail@email.com');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.queryByText('Enter your email address')).not.toBeInTheDocument();
    expect(screen.queryByText('Enter a real email address')).not.toBeInTheDocument();
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
    expect(mockedUseNavigate).toHaveBeenCalledWith(LOGGED_IN_LANDING);
  });

  it('should store token and refresh token in session storage if sign in is successful', async () => {
    const user = userEvent.setup();

    mockAxios
      .onPost(SIGN_IN_ENDPOINT)
      .reply(200, {
        token: '123',
        refresh_token: '321',
      });

    render(<MemoryRouter><SignIn /></MemoryRouter>);

    await user.type(screen.getByRole('textbox', { name: /email/i }), 'testemail@email.com');
    await user.type(screen.getByTestId('password-passwordField'), 'testpassword');
    await user.click(screen.getByTestId('submit-button'));
    expect(window.sessionStorage.getItem('token')).toEqual('123');
    expect(window.sessionStorage.getItem('refreshToken')).toEqual('321');
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

  it('should show instructions to send verification email if user not yet activated', async () => {
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
    screen.findByRole('heading', { name: 'Email address not verified' });
    expect(screen.getByRole('heading', { name: 'Email address not verified' })).toBeInTheDocument();
    expect(screen.getByText('We can send you a verification link so you can continue creating your account.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send confirmation email' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send confirmation email' }).outerHTML).toEqual('<button class="govuk-button" data-module="govuk-button" type="button">Send confirmation email</button>');
  });

  it('should redirect to message page with password reset instructions if user account needs to be updated', async () => {
    const user = userEvent.setup();
    mockAxios
      .onPost(SIGN_IN_ENDPOINT)
      .reply(401, {
        message: USER_MUST_UPDATE_PASSWORD,
      });

    render(<MemoryRouter><SignIn /></MemoryRouter>);
    await user.type(screen.getByRole('textbox', { name: /email/i }), 'testemail@email.com');
    await user.type(screen.getByTestId('password-passwordField'), 'testpassword');
    await user.click(screen.getByTestId('submit-button'));
    expect(mockedUseNavigate).toHaveBeenCalledWith(MESSAGE_URL, {
      state:
      {
        title: 'Service update',
        message: "To continue to use the service, please reset your password. Any voyage reports you've saved will not be affected.",
        linkText: 'Reset password',
        redirectURL: REQUEST_PASSWORD_RESET_URL,
        resetPasswordTitle: 'Reset password',
      },
    });
  });

  it('should redirect to message page if 500 from sign in and 500/unknown error received', async () => {
    const user = userEvent.setup();
    mockAxios
      .onPost(SIGN_IN_ENDPOINT)
      .reply(500);

    render(<MemoryRouter><SignIn /></MemoryRouter>);

    await user.type(screen.getByRole('textbox', { name: /email/i }), 'testemail@email.com');
    await user.type(screen.getByTestId('password-passwordField'), 'testpassword');
    await user.click(screen.getByTestId('submit-button'));
    expect(mockedUseNavigate).toHaveBeenCalledWith(MESSAGE_URL, { state: { title: 'Something has gone wrong', redirectURL: SIGN_IN_URL } });
  });
});
