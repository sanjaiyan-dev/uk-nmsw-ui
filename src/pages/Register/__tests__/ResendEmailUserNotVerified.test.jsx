import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  REGISTER_RESEND_VERIFICATION_EMAIL_ENDPOINT,
} from '../../../constants/AppAPIConstants';
import {
  MESSAGE_URL,
  REGISTER_EMAIL_CHECK_URL,
  REGISTER_EMAIL_RESEND_URL,
  SIGN_IN_URL,
} from '../../../constants/AppUrlConstants';
import ResendEmailUserNotVerified from '../ResendEmailUserNotVerified';

let mockUseLocationState = { state: {} };
const mockedUseNavigate = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedUseNavigate,
  useLocation: jest.fn().mockImplementation(() => mockUseLocationState),
}));

describe('Resend email when user not verified tests', () => {
  const mockAxios = new MockAdapter(axios);
  const scrollIntoViewMock = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

  beforeEach(() => {
    mockAxios.reset();
    mockUseLocationState = { state: { emailAddress: 'test@email.com' } };
    window.sessionStorage.clear();
  });

  afterAll(() => {
    mockAxios.reset();
    mockUseLocationState = {};
    window.sessionStorage.clear();
  });

  it('should redirect to resend verification link page if email is missing from state', async () => {
    mockUseLocationState = { state: {} };
    render(<MemoryRouter><ResendEmailUserNotVerified /></MemoryRouter>);
    expect(mockedUseNavigate).toHaveBeenCalledWith(REGISTER_EMAIL_RESEND_URL, { replace: true });
  });

  it('should NOT redirect to error page if email is in state', async () => {
    render(<MemoryRouter><ResendEmailUserNotVerified /></MemoryRouter>);
    await screen.findByRole('heading', { name: 'Email address not verified' });
    expect(mockedUseNavigate).not.toHaveBeenCalled();
  });

  it('should render h1, message and resend button', async () => {
    mockUseLocationState = { state: { email: 'test@email.com', redirectURL: SIGN_IN_URL } };
    render(<MemoryRouter><ResendEmailUserNotVerified /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Email address not verified' })).toBeInTheDocument();
    expect(screen.getByText('We can send you a verification link so you can continue creating your account.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Resend verification email' })).toBeInTheDocument();
  });

  it('should navigate to check your email page if successful POST response', async () => {
    const user = userEvent.setup();
    mockAxios
      .onPost(REGISTER_RESEND_VERIFICATION_EMAIL_ENDPOINT, {
        email: 'test@email.com',
      })
      .reply(204);

    render(<MemoryRouter><ResendEmailUserNotVerified /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: 'Resend verification email' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(REGISTER_EMAIL_CHECK_URL, { state: { dataToSubmit: { emailAddress: 'test@email.com' } } });
  });

  it('should navigate to message page if API returns a 500', async () => {
    const user = userEvent.setup();
    mockUseLocationState = { state: { email: 'test@email.com', redirectURL: SIGN_IN_URL } };
    mockAxios
      .onPost(REGISTER_RESEND_VERIFICATION_EMAIL_ENDPOINT, {
        email: 'test@email.com',
      })
      .reply(500);

    render(<MemoryRouter><ResendEmailUserNotVerified /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: 'Resend verification email' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(MESSAGE_URL, {
      state: {
        title: 'Something has gone wrong',
        redirectURL: SIGN_IN_URL,
      },
    });
  });
});
