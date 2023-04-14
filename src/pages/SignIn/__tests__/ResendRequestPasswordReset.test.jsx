import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  REQUEST_PASSSWORD_RESET_ENDPOINT,
} from '../../../constants/AppAPIConstants';
import {
  MESSAGE_URL,
  REQUEST_PASSWORD_RESET_CONFIRMATION_URL,
  REQUEST_PASSWORD_RESET_URL,
} from '../../../constants/AppUrlConstants';
import ResendRequestPasswordReset from '../ResendRequestPasswordReset';

let mockUseLocationState = {};
const mockedUseNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedUseNavigate,
  useLocation: jest.fn().mockImplementation(() => mockUseLocationState),
}));

describe('Resend password reset link email', () => {
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
    render(<MemoryRouter><ResendRequestPasswordReset /></MemoryRouter>);
    expect(screen.getByText('Request a new verification link')).toBeInTheDocument();
    expect(screen.getByText('Emails sometimes take a few minutes to arrive. If you did not receive the link, you can request a new one.')).toBeInTheDocument();
    expect(screen.getByTestId('details-component').outerHTML).toEqual('<details class="govuk-details" data-module="govuk-details" data-testid="details-component"><summary class="govuk-details__summary"><span class="govuk-details__summary-text">Change where the email was sent</span></summary><div class="govuk-details__text"><label class="govuk-label" for="emailAddress-input">Email address</label><div id="emailAddress-hint" class="govuk-hint"></div><p id="emailAddress-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> </p><input class="govuk-input" id="emailAddress-input" name="emailAddress" type="email" autocomplete="email" value=""></div></details>');
    expect(screen.getByRole('button', { name: 'Request a new link' })).toBeInTheDocument('');
  });

  it('should render page with content when email address is in state', () => {
    mockUseLocationState = { state: { dataToSubmit: { emailAddress: 'testemail@email.com' } } };
    render(<MemoryRouter><ResendRequestPasswordReset /></MemoryRouter>);
    expect(screen.getByText('Request a new verification link')).toBeInTheDocument();
    expect(screen.getByText('Emails sometimes take a few minutes to arrive. If you did not receive the link, you can request a new one.')).toBeInTheDocument();
    expect(screen.getByTestId('details-component').outerHTML).toEqual('<details class="govuk-details" data-module="govuk-details" data-testid="details-component"><summary class="govuk-details__summary"><span class="govuk-details__summary-text">Change where the email was sent</span></summary><div class="govuk-details__text"><label class="govuk-label" for="emailAddress-input">Email address</label><div id="emailAddress-hint" class="govuk-hint"></div><p id="emailAddress-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> </p><input class="govuk-input" id="emailAddress-input" name="emailAddress" type="email" autocomplete="email" value="testemail@email.com"></div></details>');
    expect(screen.getByRole('button', { name: 'Request a new link' })).toBeInTheDocument('');
  });

  // ================
  // ERROR
  // ================
  it('should display the Error Summary if there are errors', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ResendRequestPasswordReset /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: 'Request a new link' }));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
  });

  it('should display the email required error if there is no email address', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ResendRequestPasswordReset /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: 'Request a new link' }));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getAllByText('Enter your email address')).toHaveLength(2);
  });

  it('should scroll to email field and set focus on email input if user clicks on email required error link', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ResendRequestPasswordReset /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: 'Request a new link' }));
    await user.click(screen.getByRole('button', { name: 'Enter your email address' }));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(scrollIntoViewMock).toHaveBeenCalled();
    expect(screen.getAllByRole('textbox', { name: /email/i })[0]).toHaveFocus();
  });

  it('should display the email invalid error if the email address has no @', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ResendRequestPasswordReset /></MemoryRouter>);
    await user.type(screen.getAllByRole('textbox', { name: /email/i })[0], 'testemail');
    await user.click(screen.getByRole('button', { name: 'Request a new link' }));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getAllByText('Enter a real email address')).toHaveLength(2);
  });

  it('should display the email invalid error if the email address has no .xx', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ResendRequestPasswordReset /></MemoryRouter>);
    await user.type(screen.getAllByRole('textbox', { name: /email/i })[0], 'testemail@boo');
    await user.click(screen.getByRole('button', { name: 'Request a new link' }));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getAllByText('Enter a real email address')).toHaveLength(2);
  });

  it('should scroll to email field and set focus on email input if user clicks on email invalid format error link', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ResendRequestPasswordReset /></MemoryRouter>);
    await user.type(screen.getAllByRole('textbox', { name: /email/i })[0], 'testemail@boo');
    await user.click(screen.getByRole('button', { name: 'Request a new link' }));
    await screen.findByRole('heading', { name: 'There is a problem' });
    await user.click(screen.getByRole('button', { name: 'Enter a real email address' }));
    expect(scrollIntoViewMock).toHaveBeenCalled();
    expect(screen.getAllByRole('textbox', { name: /email/i })[0]).toHaveFocus();
  });

  // ================
  // POST
  // ================
  it('should navigate to confirmation page if successful POST to resend response', async () => {
    const user = userEvent.setup();
    mockUseLocationState = { state: { dataToSubmit: { emailAddress: 'testemail@email.com' } } };
    mockAxios
      .onPost(REQUEST_PASSSWORD_RESET_ENDPOINT)
      .reply(204);

    render(<MemoryRouter><ResendRequestPasswordReset /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: 'Request a new link' }));
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(REQUEST_PASSWORD_RESET_CONFIRMATION_URL, { state: { dataToSubmit: { emailAddress: 'testemail@email.com' } } });
    });
  });

  it('should navigate to confirmation page if invalid email address POST response', async () => {
    const user = userEvent.setup();
    mockAxios
      .onPost(REQUEST_PASSSWORD_RESET_ENDPOINT, { email: 'test@test.com' })
      .reply(401);

    render(<MemoryRouter><ResendRequestPasswordReset /></MemoryRouter>);
    await user.type(screen.getByRole('textbox', { name: 'Email address' }), 'test@test.com');
    await user.click(screen.getByTestId('submit-button'));
    expect(mockedUseNavigate).toHaveBeenCalledWith(REQUEST_PASSWORD_RESET_CONFIRMATION_URL, { state: { dataToSubmit: { emailAddress: 'test@test.com' } } });
  });

  it('should navigate to message page if error POST response', async () => {
    const user = userEvent.setup();
    mockAxios
      .onPost(REQUEST_PASSSWORD_RESET_ENDPOINT, { email: 'test@test.com' })
      .reply(400);

    render(<MemoryRouter><ResendRequestPasswordReset /></MemoryRouter>);
    await user.type(screen.getByRole('textbox', { name: 'Email address' }), 'test@test.com');
    await user.click(screen.getByTestId('submit-button'));
    expect(mockedUseNavigate).toHaveBeenCalledWith(MESSAGE_URL, { state: { title: 'Something has gone wrong', message: undefined, redirectURL: REQUEST_PASSWORD_RESET_URL } });
  });

  it('should navigate to message page if 500 POST response', async () => {
    const user = userEvent.setup();
    mockAxios
      .onPost(REQUEST_PASSSWORD_RESET_ENDPOINT, { email: 'test@test.com' })
      .reply(500);

    render(<MemoryRouter><ResendRequestPasswordReset /></MemoryRouter>);
    await user.type(screen.getByRole('textbox', { name: 'Email address' }), 'test@test.com');
    await user.click(screen.getByTestId('submit-button'));
    expect(mockedUseNavigate).toHaveBeenCalledWith(MESSAGE_URL, { state: { title: 'Something has gone wrong', message: undefined, redirectURL: REQUEST_PASSWORD_RESET_URL } });
  });
});
