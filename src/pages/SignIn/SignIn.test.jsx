import { UserContext } from '../../context/userContext';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SignIn from '../../pages/SignIn/SignIn';

const mockUseLocationState = { state: {} };
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLocation: jest.fn().mockImplementation(() => {
    return mockUseLocationState;
  })
}));

describe('Sign in tests', () => {
  const mockedLogin = jest.fn();
  const mockedLogout = jest.fn();
  let scrollIntoViewMock = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

  beforeEach(() => {
    window.sessionStorage.clear();
  });

  function renderWithUserContext(userDetails) {
    return render(
      <UserContext.Provider value={{ 
        user: userDetails, 
        signIn: mockedLogin, 
        signOut: mockedLogout,
       }}>
        <MemoryRouter><SignIn user={userDetails} /></MemoryRouter>
      </UserContext.Provider>
    );
  }

  it('should render the sign in page', () => {
    render(<MemoryRouter><SignIn /></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Sign in');
    expect(screen.getByTestId('submit-button')).toHaveTextContent('Sign in');
  });

  it('should display an input field for email', () => {
    render(<MemoryRouter><SignIn /></MemoryRouter>);
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByRole('textbox', {name: /email/i}).outerHTML).toEqual('<input class="govuk-input" id="email-input" name="email" type="email" autocomplete="email" value="">');
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
    expect(mockedLogin).not.toHaveBeenCalled();
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
    await user.click(screen.getByRole('button', { name: 'Enter your email address'}));
    expect(scrollIntoViewMock).toHaveBeenCalled();
    expect(screen.getByRole('textbox', {name: /email/i})).toHaveFocus();
  });

  it('should display the email invalid error if the email address has no @', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><SignIn /></MemoryRouter>);
    await user.type(screen.getByRole('textbox', {name: /email/i}), 'testemail');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getAllByText('Enter your email address in the correct format, like name@example.com')).toHaveLength(2);
  });

  it('should display the email invalid error if the email address has no .xx', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><SignIn /></MemoryRouter>);
    await user.type(screen.getByRole('textbox', {name: /email/i}), 'testemail@boo');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getAllByText('Enter your email address in the correct format, like name@example.com')).toHaveLength(2);
  });

  it('should scroll to email field and set focus on email input if user clicks on email invalid format error link', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><SignIn /></MemoryRouter>);
    await user.type(screen.getByRole('textbox', {name: /email/i}), 'testemail@boo');
    await user.click(screen.getByTestId('submit-button'));
    await user.click(screen.getByRole('button', { name: 'Enter your email address in the correct format, like name@example.com'}));
    expect(scrollIntoViewMock).toHaveBeenCalled();
    expect(screen.getByRole('textbox', {name: /email/i})).toHaveFocus();
  });

  it('should NOT display the email errors if the email address is a valid format', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><SignIn /></MemoryRouter>);
    await user.type(screen.getByRole('textbox', {name: /email/i}), 'testemail@email.com');
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
    await user.click(screen.getByRole('button', { name: 'Enter your password'}));
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
    const userDetails = { name: 'MockedUser', token: '123', group: 'testGroup' };

    renderWithUserContext(userDetails);
    await user.type(screen.getByRole('textbox', {name: /email/i}), 'testemail@email.com');
    await user.type(screen.getByTestId('password-passwordField'), 'testpassword');
    await user.click(screen.getByTestId('submit-button'));
    expect(mockedLogin).toHaveBeenCalled();
  });

  it('should not clear session storage if user is being redirected to sign in before completing their action AND the newly signed in user is the same as the previously signed in one', async () => {
    mockUseLocationState.state = {
      redirectURL: '/thisurl',
    };
    const user = userEvent.setup();
    /* mock some sessionData that may exist if a user had clicked 'submit' on a form page but their AuthToken had expired */
    window.sessionStorage.setItem('formData', JSON.stringify({ testField: 'Hello Test Field', radioButtonSet: 'radioOne'}));
    const expectedStoredData = '{"testField":"Hello Test Field","radioButtonSet":"radioOne"}';
    const userDetails = { name: 'MockedUser', token: '123', group: 'testGroup', email: 'testemail@email.com' };

    renderWithUserContext(userDetails);
    await user.type(screen.getByRole('textbox', {name: /email/i}), 'testemail@email.com');
    await user.type(screen.getByTestId('password-passwordField'), 'testpassword');
    await user.click(screen.getByTestId('submit-button'));
    expect(mockedLogin).toHaveBeenCalled();
    expect(window.sessionStorage.getItem('formData')).toStrictEqual(expectedStoredData);
  });

  it('should clear session storage if user is being redirected to sign in before completing their action AND the newly signed in user is NOT the same as the previously signed in one', async () => {
    mockUseLocationState.state = {
      redirectURL: '/thisurl',
    };
    const user = userEvent.setup();
    /* mock some sessionData that may exist if a user had clicked 'submit' on a form page but their AuthToken had expired */
    window.sessionStorage.setItem('formData', JSON.stringify({ testField: 'Hello Test Field', radioButtonSet: 'radioOne'}));
    const userDetails = { name: 'MockedUser', token: '123', group: 'testGroup', email: 'testemail@email.com' };

    renderWithUserContext(userDetails);
    await user.type(screen.getByRole('textbox', {name: /email/i}), 'differentperson@email.com');
    await user.type(screen.getByTestId('password-passwordField'), 'testpassword');
    await user.click(screen.getByTestId('submit-button'));
    expect(mockedLogin).toHaveBeenCalled();
    expect(window.sessionStorage.getItem('formData')).toStrictEqual(null);
  });
});
