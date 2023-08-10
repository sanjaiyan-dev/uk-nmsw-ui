import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  REGISTER_CHECK_TOKEN_ENDPOINT,
  TOKEN_INVALID,
  TOKEN_USED_TO_REGISTER,
  USER_ALREADY_VERIFIED,
} from '../../../constants/AppAPIConstants';
import {
  ERROR_ACCOUNT_ALREADY_ACTIVE_URL,
  MESSAGE_URL,
  REGISTER_DETAILS_URL,
  REGISTER_EMAIL_RESEND_URL,
} from '../../../constants/AppUrlConstants';
import RegisterEmailVerified from '../RegisterEmailVerified';

const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useSearchParams: () => [new URLSearchParams({ email: 'testemail@email.com', token: '123' })],
  useNavigate: () => mockedUseNavigate,
}));

describe('Verify email address tests', () => {
  const mockAxios = new MockAdapter(axios);

  beforeEach(() => {
    mockAxios.reset();
    window.sessionStorage.clear();
  });

  it('should load the email verified successfully message if token is valid', async () => {
    mockAxios
      .onPost(REGISTER_CHECK_TOKEN_ENDPOINT)
      .reply(204);

    render(<MemoryRouter><RegisterEmailVerified /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Your email address has been verified' })).toBeInTheDocument();
      expect(screen.getByText('You can continue creating your account')).toBeInTheDocument();
      const nextButton = screen.getByRole('button', { name: 'Continue' });
      expect(nextButton).toBeInTheDocument();
      expect(nextButton.outerHTML).toEqual('<button class="govuk-button" data-module="govuk-button" type="button">Continue</button>');
    });
  });

  it('should link user to your details page if token is valid', async () => {
    const user = userEvent.setup();
    mockAxios
      .onPost(REGISTER_CHECK_TOKEN_ENDPOINT, { token: '123' })
      .reply(204);

    render(<MemoryRouter><RegisterEmailVerified /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Your email address has been verified' })).toBeInTheDocument();
    });
    user.click(screen.getByRole('button', { name: 'Continue' }));
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(REGISTER_DETAILS_URL, { state: { dataToSubmit: { emailAddress: 'testemail@email.com', token: '123' } } });
    });
  });

  it('should link user to sign in page if token blacklisted (aka account activated)', async () => {
    mockAxios
      .onPost(REGISTER_CHECK_TOKEN_ENDPOINT, { token: '123' })
      .reply(401, {
        message: TOKEN_USED_TO_REGISTER,
      });

    render(<MemoryRouter><RegisterEmailVerified /></MemoryRouter>);
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(ERROR_ACCOUNT_ALREADY_ACTIVE_URL, { state: { dataToSubmit: { emailAddress: 'testemail@email.com' } } });
    });
  });

  it('should link user to sign in page account already exists', async () => {
    mockAxios
      .onPost(REGISTER_CHECK_TOKEN_ENDPOINT, { token: '123' })
      .reply(409, {
        message: USER_ALREADY_VERIFIED,
      });

    render(<MemoryRouter><RegisterEmailVerified /></MemoryRouter>);
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(ERROR_ACCOUNT_ALREADY_ACTIVE_URL, { state: { dataToSubmit: { emailAddress: 'testemail@email.com' } } });
    });
  });

  it('should link user to resend verification page if token expired', async () => {
    mockAxios
      .onPost(REGISTER_CHECK_TOKEN_ENDPOINT, { token: '123' })
      .reply(401, { message: TOKEN_INVALID });

    render(<MemoryRouter><RegisterEmailVerified /></MemoryRouter>);
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(MESSAGE_URL, {
        state: {
          title: 'Verification link has expired',
          button: {
            buttonLabel: 'Request a new link',
            buttonNavigateTo: REGISTER_EMAIL_RESEND_URL,
            buttonState: { state: { dataToSubmit: { emailAddress: 'testemail@email.com' } } },
          },
        },
      });
    });
  });

  it('should show generic error if 500 returned', async () => {
    mockAxios
      .onPost(REGISTER_CHECK_TOKEN_ENDPOINT, { token: '123' })
      .reply(500);

    render(<MemoryRouter><RegisterEmailVerified /></MemoryRouter>);
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(MESSAGE_URL, { state: { title: 'Something has gone wrong' } });
    });
  });
});
