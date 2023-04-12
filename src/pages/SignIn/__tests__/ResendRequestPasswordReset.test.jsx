import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import RequestPasswordResetConfirmation from '../RequestPasswordResetConfirmation';
import { REQUEST_PASSWORD_RESET_RESEND_URL } from '../../../constants/AppUrlConstants';

let mockUseLocationState = {};
const mockedUseNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedUseNavigate,
  useLocation: jest.fn().mockImplementation(() => mockUseLocationState),
}));

describe('Confirm request password reset check your email tests', () => {
  beforeEach(() => {
    mockUseLocationState = {};
  });

  it('should render page with content', () => {
    mockUseLocationState = { state: { dataToSubmit: { emailAddress: 'testemail@email.com' } } };
    render(<MemoryRouter><RequestPasswordResetConfirmation /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Check your email' })).toBeInTheDocument();
  });

  it('should show the email address from state in the page', () => {
    mockUseLocationState = { state: { dataToSubmit: { emailAddress: 'testemail@email.com' } } };
    render(<MemoryRouter><RequestPasswordResetConfirmation /></MemoryRouter>);
    expect(screen.getByText('testemail@email.com')).toBeInTheDocument();
  });

  it('should include a link to resend your verificaiton email', () => {
    render(<MemoryRouter><RequestPasswordResetConfirmation /></MemoryRouter>);
    expect(screen.getByRole('link', { name: 'Not received an email?' }).outerHTML).toEqual('<a class="govuk-body govuk-link" href="/forgotten-password/request-new-link">Not received an email?</a>');
  });

  it('should navigate to the resend request page with email address if link clicked', async () => {
    const user = userEvent.setup();
    mockUseLocationState = { state: { dataToSubmit: { emailAddress: 'testemail@email.com' } } };
    render(<MemoryRouter><RequestPasswordResetConfirmation /></MemoryRouter>);
    expect(screen.getByText('testemail@email.com')).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Not received an email?' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(REQUEST_PASSWORD_RESET_RESEND_URL, {
      preventScrollReset: undefined, relative: undefined, replace: false, state: { dataToSubmit: { emailAddress: 'testemail@email.com' } },
    }); // params on Link generated links by default
  });
});
