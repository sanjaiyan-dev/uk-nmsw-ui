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
    expect(screen.getByTestId('passwordField')).toHaveAttribute('type', 'password');
    expect(screen.getByTestId('passwordField').outerHTML).toEqual('<input class="govuk-input" id="password-input" data-testid="passwordField" name="password" type="password">');
  });

  it('should display a primary styled sign in button', async () => {
    render(<MemoryRouter><SignIn /></MemoryRouter>);
    expect((screen.getByTestId('submit-button')).outerHTML).toEqual('<button type="button" class="govuk-button" data-module="govuk-button" data-testid="submit-button">Sign in</button>');
    
  });

  it('should call the login function on sign in button click', async () => {
    const user = userEvent.setup();
    const userDetails = { name: 'MockedUser', auth: true };

    renderWithUserContext(userDetails);
    await user.click(screen.getByTestId('submit-button'));
    expect(mockedLogin).toHaveBeenCalled();
  });

});
