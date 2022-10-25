import { UserContext } from '../../context/userContext';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SignIn from '../../pages/SignIn/SignIn';

describe('Sign in tests', () => {
  const mockedLogin = jest.fn();
  const mockedLogout = jest.fn();

  function renderWithUserContext(userDetails) {
    return render(
      <UserContext.Provider value={{ 
        user: userDetails, 
        login: mockedLogin, 
        logout: mockedLogout
       }}>
        <MemoryRouter><SignIn user={userDetails} /></MemoryRouter>
      </UserContext.Provider>
    );
  }

  it('should render the sign in page', async () => {
    render(<MemoryRouter><SignIn /></MemoryRouter>);
    expect(screen.getByTestId('signin-h1')).toHaveTextContent('Sign in');
    expect(screen.getByTestId('submit-button')).toHaveTextContent('Sign in');
  });

  it('should display an input field for email', async () => {
    render(<MemoryRouter><SignIn /></MemoryRouter>);
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByText('Enter the email address you used when you created your account').outerHTML).toEqual('<div id="email-hint" class="govuk-hint">Enter the email address you used when you created your account</div>');
    expect(screen.getByRole('textbox', {name: /email/i}).outerHTML).toEqual('<input class="govuk-input" id="email-input" name="email" type="email" autocomplete="email" aria-describedby="email-hint">');
  });

  it('should display an input field for password', async () => {
    render(<MemoryRouter><SignIn /></MemoryRouter>);
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByTestId('password-passwordField')).toHaveAttribute('type', 'password');
    expect(screen.getByTestId('password-passwordField').outerHTML).toEqual('<input class="govuk-input" id="password-input" data-testid="password-passwordField" name="password" type="password">');
  });

  it('should display a primary styled sign in button', async () => {
    render(<MemoryRouter><SignIn /></MemoryRouter>);
    expect((screen.getByTestId('submit-button')).outerHTML).toEqual('<button type="button" class="govuk-button" data-module="govuk-button" data-testid="submit-button">Sign in</button>');
    
  });

  it('should NOT call the login function on sign in button click if there ARE errors', async () => {
    const user = userEvent.setup();
    const userDetails = { name: 'MockedUser', auth: true };

    renderWithUserContext(userDetails);
    await user.click(screen.getByTestId('submit-button'));
    expect(mockedLogin).not.toHaveBeenCalled();
  });

  it('should display the Error Summary if there are errors', async () => {
    const user = userEvent.setup();
    const userDetails = { name: 'MockedUser', auth: true };

    renderWithUserContext(userDetails);
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
  });

  it('should display the email required error if there is no email address', async () => {
    const user = userEvent.setup();
    const userDetails = { name: 'MockedUser', auth: true };

    renderWithUserContext(userDetails);
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getByText('Enter your email address')).toBeInTheDocument();
  });

  it('should display the email invalid error if the email address has no @', async () => {
    const user = userEvent.setup();
    const userDetails = { name: 'MockedUser', auth: true };

    renderWithUserContext(userDetails);
    await user.type(screen.getByRole('textbox', {name: /email/i}), 'testemail');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getByText('Enter your email address in the correct format, like name@example.com')).toBeInTheDocument();
  });

  it('should display the email invalid error if the email address has no .xx', async () => {
    const user = userEvent.setup();
    const userDetails = { name: 'MockedUser', auth: true };

    renderWithUserContext(userDetails);
    await user.type(screen.getByRole('textbox', {name: /email/i}), 'testemail@boo');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getByText('Enter your email address in the correct format, like name@example.com')).toBeInTheDocument();
  });

  it('should NOT display the email errors if the email address is a valid format', async () => {
    const user = userEvent.setup();
    const userDetails = { name: 'MockedUser', auth: true };

    renderWithUserContext(userDetails);
    await user.type(screen.getByRole('textbox', {name: /email/i}), 'testemail@email.com');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.queryByText('Enter your email address')).not.toBeInTheDocument();
    expect(screen.queryByText('Enter your email address in the correct format, like name@example.com')).not.toBeInTheDocument();
  });

  it('should display the password required error if there is no password', async () => {
    const user = userEvent.setup();
    const userDetails = { name: 'MockedUser', auth: true };

    renderWithUserContext(userDetails);
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getByText('Enter your password')).toBeInTheDocument();
  });

  it('should NOT display the password required error if a password is entered', async () => {
    const user = userEvent.setup();
    const userDetails = { name: 'MockedUser', auth: true };

    renderWithUserContext(userDetails);
    await user.type(screen.getByTestId('password-passwordField'), 'testpassword');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.queryByText('Enter your password')).not.toBeInTheDocument();
  });

  it('should display the sample field required error if there is no sample field text', async () => {
    const user = userEvent.setup();
    const userDetails = { name: 'MockedUser', auth: true };

    renderWithUserContext(userDetails);
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getByText('Enter your sample field password')).toBeInTheDocument();
  });

  it('should display the sample field min length error if the text in the field is < 8 characters', async () => {
    const user = userEvent.setup();
    const userDetails = { name: 'MockedUser', auth: true };

    renderWithUserContext(userDetails);
    await user.type(screen.getByTestId('sampleMinLengthTest-passwordField'), 'one');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getByText('Sample field must be a minimum of 8 characters')).toBeInTheDocument();
  });

  it('should NOT display any sample field errors if the text in the field is >= 8 characters', async () => {
    const user = userEvent.setup();
    const userDetails = { name: 'MockedUser', auth: true };

    renderWithUserContext(userDetails);
    await user.type(screen.getByTestId('sampleMinLengthTest-passwordField'), '12345678');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.queryByText('Sample field must be a minimum of 8 characters')).not.toBeInTheDocument();
  });

  it('should call the login function on sign in button click if there are no errors', async () => {
    const user = userEvent.setup();
    const userDetails = { name: 'MockedUser', auth: true };

    renderWithUserContext(userDetails);
    await user.type(screen.getByRole('textbox', {name: /email/i}), 'testemail@email.com');
    await user.type(screen.getByTestId('password-passwordField'), 'testpassword');
    await user.type(screen.getByTestId('sampleMinLengthTest-passwordField'), 'testminlengthpassword');
    await user.click(screen.getByTestId('submit-button'));
    expect(mockedLogin).toHaveBeenCalled();
  });

});
