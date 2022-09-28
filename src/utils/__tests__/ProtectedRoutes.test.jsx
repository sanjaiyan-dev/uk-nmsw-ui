import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoutes';

/* Testing the 'not authorised' scenarios e.g. <ProtectedRoute user={{ name: 'bob', auth: false }}>
 * tried rendering ProtectedRoute (without MemoryRouter) and it errors with '<Navigate>' must
 * be inside a router
 * However, when wrapping ProtectedRoute inside MemoryRouter or BrowserRouter
 * in the negative scenario the test times out
 * It seems to be something to do with <Navigate to=> being triggered and not completing
 * the navigation function in the test environment
 * 
 * Therefore we will test the negative routes with the Cypress E2E tests
 */


describe('Routing tests', () => {
  const TestComponent = () => <div>test text</div>;
  const isPermittedToView = true;

  it('should fail', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<ProtectedRoute isPermittedToView={isPermittedToView} />}>
            <Route path="/" element={<TestComponent />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText('test text')).toBeInTheDocument();
  });

});
