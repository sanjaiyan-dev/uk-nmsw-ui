import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { REGISTER_EMAIL_RESEND_URL } from '../../../constants/AppUrlConstants';
import VerificationLinkFailed from '../VerificationLinkFailed';

const mockedUseNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedUseNavigate,
}));

describe('Verification link failed page tests', () => {
  it('should render page with content', () => {
    render(<MemoryRouter><VerificationLinkFailed /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Try again' })).toBeInTheDocument();
    expect(screen.getByText('The verification link did not work. Resend the email to try again.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Resend confirmation email' })).toBeInTheDocument();
  });

  it('should trigger the resend verification email process on button click', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><VerificationLinkFailed /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: 'Resend confirmation email' }));
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(REGISTER_EMAIL_RESEND_URL);
    });
  });
});
