import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AccountAlreadyActive from '../AccountAlreadyActive';

let mockUseLocationState = {};
const mockedUseNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedUseNavigate,
  useLocation: jest.fn().mockImplementation(() => {
    return mockUseLocationState;
  })
}));

describe('Account already exists page tests', () => {

  beforeEach(() => {
    mockUseLocationState = {};
  });

  it('should render page with content', () => {
    mockUseLocationState = { state: { dataToSubmit: { emailAddress: 'testemail@email.com' } } };
    render(<MemoryRouter><AccountAlreadyActive /></MemoryRouter>);
    expect(screen.getByText('You already have an account')).toBeInTheDocument();
    expect(screen.getByTestId('insetText').outerHTML).toEqual('<p class="govuk-body" data-testid="insetText">Your email address <strong>testemail@email.com</strong> is already registered with this service.</p>');
  });

  it('should show the email address from state in the page', () => {
    mockUseLocationState = { state: { dataToSubmit: { emailAddress: 'testemail@email.com' } } };
    render(<MemoryRouter><AccountAlreadyActive /></MemoryRouter>);
    expect(screen.getByText('testemail@email.com')).toBeInTheDocument();
  });

  it('should include a button to sign in', () => {
    mockUseLocationState = { state: { dataToSubmit: { emailAddress: 'testemail@email.com' } } };
    render(<MemoryRouter><AccountAlreadyActive /></MemoryRouter>);
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('should include a button to sign in link', async () => {
    render(<MemoryRouter><AccountAlreadyActive /></MemoryRouter>);
    expect(screen.getByRole('button', { name: 'Sign in' }).outerHTML).toEqual('<a role="button" draggable="false" class="govuk-button govuk-button--primary" data-module="govuk-button" href="/sign-in">Sign in</a>');
  });

  it('should not fail if state is missing', () => {
    mockUseLocationState = {};
    render(<MemoryRouter><AccountAlreadyActive /></MemoryRouter>);
    expect(screen.getByText('You already have an account')).toBeInTheDocument();
    expect(screen.getByText('Your email address is already registered with this service.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('should not fail if state does not have dataToSubmit object', () => {
    mockUseLocationState = { state: {} };
    render(<MemoryRouter><AccountAlreadyActive /></MemoryRouter>);
    expect(screen.getByText('You already have an account')).toBeInTheDocument();
    expect(screen.getByText('Your email address is already registered with this service.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('should not fail if state does not have email address', () => {
    mockUseLocationState = { state: { dataToSubmit: {} } };
    render(<MemoryRouter><AccountAlreadyActive /></MemoryRouter>);
    expect(screen.getByText('You already have an account')).toBeInTheDocument();
    expect(screen.getByText('Your email address is already registered with this service.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });
});
