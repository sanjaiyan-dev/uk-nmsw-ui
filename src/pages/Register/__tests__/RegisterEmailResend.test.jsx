import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  REGISTER_ACCOUNT_ENDPOINT,
  REGISTER_RESEND_VERIFICATION_EMAIL_ENDPOINT,
  USER_ALREADY_REGISTERED,
  USER_ALREADY_VERIFIED,
  USER_NOT_REGISTERED,
} from '../../../constants/AppAPIConstants';
import {
  ERROR_ACCOUNT_ALREADY_ACTIVE_URL,
  MESSAGE_URL,
  REGISTER_EMAIL_CHECK_URL,
  REGISTER_EMAIL_URL,
} from '../../../constants/AppUrlConstants';
import RegisterEmailResend from '../RegisterEmailResend';

let mockUseLocationState = {};
const mockedUseNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedUseNavigate,
  useLocation: jest.fn().mockImplementation(() => mockUseLocationState),
}));

describe('Resend registration email verification email', () => {
  const mockAxios = new MockAdapter(axios);
  const scrollIntoViewMock = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

  beforeEach(() => {
    mockAxios.reset();
    mockUseLocationState = {};
    window.sessionStorage.clear();
  });

  // ================
  // RENDER
  // ================
  it('should render page with content when there is no state', () => {
    render(<MemoryRouter><RegisterEmailResend /></MemoryRouter>);
    expect(screen.getByText('Request a new verification link')).toBeInTheDocument();
    expect(screen.getByText('Emails sometimes take a few minutes to arrive. If you did not receive the link, you can request a new one.')).toBeInTheDocument();
    expect(screen.getByTestId('details-component').outerHTML).toEqual('<details class="govuk-details" data-module="govuk-details" data-testid="details-component"><summary class="govuk-details__summary"><span class="govuk-details__summary-text">Change the contact email address you want to use</span></summary><div class="govuk-details__text"><label class="govuk-label" for="emailAddress-input">Email address</label><div id="emailAddress-hint" class="govuk-hint"></div><p id="emailAddress-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> </p><input class="govuk-input" id="emailAddress-input" name="emailAddress" type="email" autocomplete="email" value=""></div></details>');
    expect(screen.getByRole('button', { name: 'Request a new link' })).toBeInTheDocument('');
  });

  it('should render page with content when email address is in state', () => {
    mockUseLocationState = { state: { dataToSubmit: { emailAddress: 'testemail@email.com' } } };
    render(<MemoryRouter><RegisterEmailResend /></MemoryRouter>);
    expect(screen.getByText('Request a new verification link')).toBeInTheDocument();
    expect(screen.getByText('Emails sometimes take a few minutes to arrive. If you did not receive the link, you can request a new one.')).toBeInTheDocument();
    expect(screen.getByTestId('details-component').outerHTML).toEqual('<details class="govuk-details" data-module="govuk-details" data-testid="details-component"><summary class="govuk-details__summary"><span class="govuk-details__summary-text">Change the contact email address you want to use</span></summary><div class="govuk-details__text"><label class="govuk-label" for="emailAddress-input">Email address</label><div id="emailAddress-hint" class="govuk-hint"></div><p id="emailAddress-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> </p><input class="govuk-input" id="emailAddress-input" name="emailAddress" type="email" autocomplete="email" value="testemail@email.com"></div></details>');
    expect(screen.getByRole('button', { name: 'Request a new link' })).toBeInTheDocument('');
  });

  // ================
  // ERROR
  // ================
  it('should display the Error Summary if there are errors', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterEmailResend /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: 'Request a new link' }));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
  });

  it('should display the email required error if there is no email address', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterEmailResend /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: 'Request a new link' }));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getAllByText('Enter your email address')).toHaveLength(2);
  });

  it('should scroll to email field and set focus on email input if user clicks on email required error link', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterEmailResend /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: 'Request a new link' }));
    await user.click(screen.getByRole('button', { name: 'Enter your email address' }));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(scrollIntoViewMock).toHaveBeenCalled();
    expect(screen.getAllByRole('textbox', { name: /email/i })[0]).toHaveFocus();
  });

  it('should display the email invalid error if the email address has no @', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterEmailResend /></MemoryRouter>);
    await user.type(screen.getAllByRole('textbox', { name: /email/i })[0], 'testemail');
    await user.click(screen.getByRole('button', { name: 'Request a new link' }));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getAllByText('Enter an email address in the correct format, like name@example.com')).toHaveLength(2);
  });

  it('should display the email invalid error if the email address has no .xx', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterEmailResend /></MemoryRouter>);
    await user.type(screen.getAllByRole('textbox', { name: /email/i })[0], 'testemail@boo');
    await user.click(screen.getByRole('button', { name: 'Request a new link' }));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getAllByText('Enter an email address in the correct format, like name@example.com')).toHaveLength(2);
  });

  it('should scroll to email field and set focus on email input if user clicks on email invalid format error link', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterEmailResend /></MemoryRouter>);
    await user.type(screen.getAllByRole('textbox', { name: /email/i })[0], 'testemail@boo');
    await user.click(screen.getByRole('button', { name: 'Request a new link' }));
    await screen.findByRole('heading', { name: 'There is a problem' });
    await user.click(screen.getByRole('button', { name: 'Enter an email address in the correct format, like name@example.com' }));
    expect(scrollIntoViewMock).toHaveBeenCalled();
    expect(screen.getAllByRole('textbox', { name: /email/i })[0]).toHaveFocus();
  });

  // ================
  // POST
  // ================
  it('should navigate to email verified page if successful POST to resend response', async () => {
    const user = userEvent.setup();
    mockUseLocationState = { state: { dataToSubmit: { emailAddress: 'testemail@email.com' } } };
    mockAxios
      .onPost(REGISTER_RESEND_VERIFICATION_EMAIL_ENDPOINT)
      .reply(204);

    render(<MemoryRouter><RegisterEmailResend /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: 'Request a new link' }));
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(REGISTER_EMAIL_CHECK_URL, { state: { dataToSubmit: { emailAddress: 'testemail@email.com' } } });
    });
  });

  it('should navigate to account already active page if POST to resend response returns 409 user already verified', async () => {
    const user = userEvent.setup();
    mockUseLocationState = { state: { dataToSubmit: { emailAddress: 'testemail@email.com' } } };
    mockAxios
      .onPost(REGISTER_RESEND_VERIFICATION_EMAIL_ENDPOINT)
      .reply(409, {
        message: USER_ALREADY_VERIFIED,
      });

    render(<MemoryRouter><RegisterEmailResend /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: 'Request a new link' }));
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(ERROR_ACCOUNT_ALREADY_ACTIVE_URL, { state: { dataToSubmit: { emailAddress: 'testemail@email.com' } } });
    });
  });

  it('should attempt to register an account if the POST to resend response is not registered, and if register successful then take user to check email page', async () => {
    const user = userEvent.setup();
    mockUseLocationState = { state: { dataToSubmit: { emailAddress: 'testemail@email.com' } } };
    mockAxios
      .onPost(REGISTER_RESEND_VERIFICATION_EMAIL_ENDPOINT)
      .reply(401, {
        message: USER_NOT_REGISTERED,
      })
      .onPost(REGISTER_ACCOUNT_ENDPOINT)
      .reply(200, {
        email: 'testemail@email.com',
      });

    render(<MemoryRouter><RegisterEmailResend /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: 'Request a new link' }));
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(REGISTER_EMAIL_CHECK_URL, { state: { dataToSubmit: { emailAddress: 'testemail@email.com' } } });
    });
  });

  it('should attempt to register an account if the POST to resend response is not registered, and if register fails due to already active take user to already active page', async () => {
    const user = userEvent.setup();
    mockUseLocationState = { state: { dataToSubmit: { emailAddress: 'testemail@email.com' } } };
    mockAxios
      .onPost(REGISTER_RESEND_VERIFICATION_EMAIL_ENDPOINT)
      .reply(401, {
        message: USER_NOT_REGISTERED,
      })
      .onPost(REGISTER_ACCOUNT_ENDPOINT)
      .reply(409, {
        message: USER_ALREADY_REGISTERED,
      });

    render(<MemoryRouter><RegisterEmailResend /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: 'Request a new link' }));
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(ERROR_ACCOUNT_ALREADY_ACTIVE_URL, { state: { dataToSubmit: { emailAddress: 'testemail@email.com' } } });
    });
  });

  it('should attempt to register an account if the POST to resend response is not registered, and if register fails due to any other reason go to the generic message page', async () => {
    const user = userEvent.setup();
    mockUseLocationState = { state: { dataToSubmit: { emailAddress: 'testemail@email.com' } } };
    mockAxios
      .onPost(REGISTER_RESEND_VERIFICATION_EMAIL_ENDPOINT)
      .reply(401, {
        message: USER_NOT_REGISTERED,
      })
      .onPost(REGISTER_ACCOUNT_ENDPOINT)
      .reply(500, {
        message: 'Internal server error',
      });

    render(<MemoryRouter><RegisterEmailResend /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: 'Request a new link' }));
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(MESSAGE_URL, { state: { message: 'Internal server error', redirectURL: REGISTER_EMAIL_URL, title: 'Something has gone wrong' } });
    });
  });

  it('should navigate to generic message page if POST to resend response returns any other response', async () => {
    const user = userEvent.setup();
    mockUseLocationState = { state: { dataToSubmit: { emailAddress: 'testemail@email.com' } } };
    mockAxios
      .onPost(REGISTER_RESEND_VERIFICATION_EMAIL_ENDPOINT)
      .reply(500, {
        message: 'Internal server error',
      });

    render(<MemoryRouter><RegisterEmailResend /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: 'Request a new link' }));
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(MESSAGE_URL, { state: { message: 'Internal server error', redirectURL: REGISTER_EMAIL_URL, title: 'Something has gone wrong' } });
    });
  });
});
