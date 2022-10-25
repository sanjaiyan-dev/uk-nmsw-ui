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

  //it('should display Error summary if there are errors',
  //it('should display email missingif there is no email address,
  //it('should display email missingif the email address has no @
  //it('should display email missing if the email address has no .xx
  //it('should display password missing if there is no password
  //it('should display min length missing if there is no min length value
  //it('should display min length length if the min length field is too short


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
