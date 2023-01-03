import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RegisterEmailResend from '../RegisterEmailResend';

let mockUseLocationState = {};
const mockedUseNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedUseNavigate,
  useLocation: jest.fn().mockImplementation(() => {
    return mockUseLocationState;
  })
}));

describe('Resend registration email verification email', () => {

  beforeEach(() => {
    mockUseLocationState = {};
  });

  it('should render page with content', () => {
    mockUseLocationState = { state: { dataToSubmit: { emailAddress: 'testemail@email.com' } } };
    render(<MemoryRouter><RegisterEmailResend /></MemoryRouter>);
    expect(screen.getByText('Resend page')).toBeInTheDocument();
  });

  it('should show the email address from state in the page', () => {
    mockUseLocationState = { state: { dataToSubmit: { emailAddress: 'testemail@email.com' } } };
    render(<MemoryRouter><RegisterEmailResend /></MemoryRouter>);
    expect(screen.getByText('testemail@email.com')).toBeInTheDocument();
  });

});
