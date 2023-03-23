import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { SIGN_IN_URL } from '../../../constants/AppUrlConstants';
import RegisterConfirmation from '../RegisterConfirmation';

const mockUseLocationState = { state: {} };
const mockedUseNavigate = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedUseNavigate,
  useLocation: jest.fn().mockImplementation(() => mockUseLocationState),
}));

describe('Registration confirmation page tests', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    mockUseLocationState.state = {};
  });

  it('should render h1', () => {
    render(<MemoryRouter><RegisterConfirmation /></MemoryRouter>);
    expect(screen.getByText('Account created')).toBeInTheDocument();
  });

  it('should render company name, full name and email from state', () => {
    mockUseLocationState.state = { companyName: 'My company', fullName: 'John Doe', email: 'test@email.com' };
    render(<MemoryRouter><RegisterConfirmation /></MemoryRouter>);
    expect(screen.getByText('For John Doe')).toBeInTheDocument();
    expect(screen.getByText('Now a team member at My company')).toBeInTheDocument();
    expect(screen.getByText('test@email.com')).toBeInTheDocument();
  });

  it('should not break if company name, full name and email is lost from state', () => {
    mockUseLocationState.state = {};
    render(<MemoryRouter><RegisterConfirmation /></MemoryRouter>);
    expect(screen.getByText('Account created')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('should render a sign in link that links to sign in page', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterConfirmation /></MemoryRouter>);
    expect(screen.getByText('Sign in')).toBeInTheDocument();
    await user.click(screen.getByText('Sign in'));

    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(SIGN_IN_URL, {
        preventScrollReset: undefined, relative: undefined, replace: false, state: undefined,
      }); // params on Link generated links by default
    });
  });
});
