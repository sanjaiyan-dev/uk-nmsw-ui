import { UserContext } from '../../context/userContext';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Dashboard } from '../../pages/Dashboard/Dashboard';
import ProtectedRoute from '../ProtectedRoute';

describe('Routing tests', () => {
  it('should redirect to landing page if user not authorised', () => {

   
    const currentUser = { name: 'bob', auth: false };

    render(
      <UserContext.Provider value={{ currentUser }}>
        <MemoryRouter initialEntries={['/sign-in']}>
          <ProtectedRoute component={Dashboard} user={currentUser} />
        </MemoryRouter>
      </UserContext.Provider>
    );

    expect(screen.getByTestId('landing-h1')).toBeInTheDocument();
  });
});
