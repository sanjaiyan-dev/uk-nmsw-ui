import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../../pages/Dashboard/Dashboard';
import ProtectedRoute from '../ProtectedRoutes';

/* Testing the 'not authorised' scenarios e.g. <ProtectedRoute user={{ name: 'bob', auth: false }}>
 * tried rendering ProtectedRoute (without MemoryRouter) and it errors with '<Navigate>' must
 * be inside a router
 * However, when wrapping ProtectedRoute inside MemoryRouter or BrowserRouter
 * in the negative scenario the test times out
 * It seems to be something to do with <Navigate to=> being triggered and not completing
 * the navigation function
 * 
 * Therefore we will test the negative routes with the Cypress E2E tests
 */

describe('Routing tests', () => {
  it('should render a protected page if user is authorised', () => {
    render(
      <MemoryRouter>
        <ProtectedRoute user={{ name: 'bob', auth: true }}>
          <Dashboard />
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

});

