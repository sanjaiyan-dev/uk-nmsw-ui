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
    expect(screen.getByTestId('signin-button')).toHaveTextContent('Sign in');
  });

  it('should call the login function on sign in button click', async () => {
    const user = userEvent.setup();
    const userDetails = { name: 'MockedUser', auth: true };

    renderWithUserContext(userDetails);
    await user.click(screen.getByTestId('signin-button'));
    expect(mockedLogin).toHaveBeenCalled();
  });

});
