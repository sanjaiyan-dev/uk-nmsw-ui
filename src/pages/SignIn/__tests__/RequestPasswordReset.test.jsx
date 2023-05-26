import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import RequestPasswordReset from '../RequestPasswordReset';
import { PASSSWORD_RESET_ENDPOINT } from '../../../constants/AppAPIConstants';
import { MESSAGE_URL, REQUEST_PASSWORD_RESET_CONFIRMATION_URL, REQUEST_PASSWORD_RESET_URL } from '../../../constants/AppUrlConstants';

const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

describe('Request password reset tests', () => {
  const mockAxios = new MockAdapter(axios);
  const handleSubmit = jest.fn();
  const scrollIntoViewMock = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

  beforeEach(() => {
    mockAxios.reset();
    window.sessionStorage.clear();
  });

  it('should render h1', async () => {
    render(<MemoryRouter><RequestPasswordReset /></MemoryRouter>);
    expect(screen.getByText('Forgot password')).toBeInTheDocument();
  });

  it('should render an intro inset', async () => {
    render(<MemoryRouter><RequestPasswordReset /></MemoryRouter>);
    expect(screen.getByText("We'll email you a link to reset your password.")).toBeInTheDocument();
  });

  it('should render an email address field', async () => {
    render(<MemoryRouter><RequestPasswordReset /></MemoryRouter>);
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Email address' }).outerHTML).toEqual('<input class="govuk-input" id="emailAddress-input" name="emailAddress" type="email" autocomplete="email" value="">');
  });

  it('should display a primary styled submit button', () => {
    render(<MemoryRouter><RequestPasswordReset /></MemoryRouter>);
    expect((screen.getByTestId('submit-button')).outerHTML).toEqual('<button type="submit" class="govuk-button" data-module="govuk-button" data-testid="submit-button">Send the link</button>');
  });

  it('should NOT call the handleSubmit function on button click if there ARE errors', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RequestPasswordReset /></MemoryRouter>);
    await user.click(screen.getByTestId('submit-button'));
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('should display the Error Summary if there are errors', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RequestPasswordReset /></MemoryRouter>);
    await user.click(screen.getByTestId('submit-button'));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
  });

  it('should display the email required error if there is no email address', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RequestPasswordReset /></MemoryRouter>);
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getAllByText('Enter a real email address')).toHaveLength(2);
  });

  it('should scroll to email field and set focus on email input if user clicks on email required error link', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RequestPasswordReset /></MemoryRouter>);
    await user.click(screen.getByTestId('submit-button'));
    await user.click(screen.getByRole('button', { name: 'Enter a real email address' }));
    expect(scrollIntoViewMock).toHaveBeenCalled();
    expect(screen.getByRole('textbox', { name: 'Email address' })).toHaveFocus();
  });

  it('should display the email invalid error if the email address has no @', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RequestPasswordReset /></MemoryRouter>);
    await user.type(screen.getByRole('textbox', { name: 'Email address' }), 'testemail');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getAllByText('Enter a real email address')).toHaveLength(2);
  });

  it('should display the email invalid error if the email address has no .xx', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RequestPasswordReset /></MemoryRouter>);
    await user.type(screen.getByRole('textbox', { name: 'Email address' }), 'testemail@boo');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getAllByText('Enter a real email address')).toHaveLength(2);
  });

  it('should scroll to email field and set focus on email input if user clicks on email invalid format error link', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RequestPasswordReset /></MemoryRouter>);
    await user.type(screen.getByRole('textbox', { name: 'Email address' }), 'testemail@boo');
    await user.click(screen.getByTestId('submit-button'));
    await user.click(screen.getByRole('button', { name: 'Enter a real email address' }));
    expect(scrollIntoViewMock).toHaveBeenCalled();
    expect(screen.getByRole('textbox', { name: 'Email address' })).toHaveFocus();
  });

  it('should navigate to confirmation page if successful POST response', async () => {
    const user = userEvent.setup();
    mockAxios
      .onPost(PASSSWORD_RESET_ENDPOINT, { email: 'test@test.com' })
      .reply(204);

    render(<MemoryRouter><RequestPasswordReset /></MemoryRouter>);
    await user.type(screen.getByRole('textbox', { name: 'Email address' }), 'test@test.com');
    await user.click(screen.getByTestId('submit-button'));
    expect(mockedUseNavigate).toHaveBeenCalledWith(REQUEST_PASSWORD_RESET_CONFIRMATION_URL, { state: { dataToSubmit: { emailAddress: 'test@test.com' } } });
  });

  it('should navigate to confirmation page if invalid email address POST response', async () => {
    const user = userEvent.setup();
    mockAxios
      .onPost(PASSSWORD_RESET_ENDPOINT, { email: 'test@test.com' })
      .reply(401, {
        message: 'User is not registered',
      });

    render(<MemoryRouter><RequestPasswordReset /></MemoryRouter>);
    await user.type(screen.getByRole('textbox', { name: 'Email address' }), 'test@test.com');
    await user.click(screen.getByTestId('submit-button'));
    expect(mockedUseNavigate).toHaveBeenCalledWith(REQUEST_PASSWORD_RESET_CONFIRMATION_URL, { state: { dataToSubmit: { emailAddress: 'test@test.com' } } });
  });

  it('should show instructions to send verification email if user not yet activated', async () => {
    const user = userEvent.setup();
    mockAxios
      .onPost(PASSSWORD_RESET_ENDPOINT, { email: 'test@test.com' })
      .reply(400, {
        message: [
          {
            error: 'BadRequestError',
            message: 'Missing personalisation: user',
          },
        ],
      });

    render(<MemoryRouter><RequestPasswordReset /></MemoryRouter>);
    await user.type(screen.getByRole('textbox', { name: 'Email address' }), 'test@test.com');
    await user.click(screen.getByTestId('submit-button'));
    screen.findByRole('heading', { name: 'Email address not verified' });
    expect(screen.getByRole('heading', { name: 'Email address not verified' })).toBeInTheDocument();
    expect(screen.getByText('We can send you a verification link so you can continue creating your account.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send confirmation email' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send confirmation email' }).outerHTML).toEqual('<button class="govuk-button" data-module="govuk-button" type="button">Send confirmation email</button>');
  });

  it('should navigate to message page if other error POST response', async () => {
    const user = userEvent.setup();
    mockAxios
      .onPost(PASSSWORD_RESET_ENDPOINT, { email: 'test@test.com' })
      .reply(404);

    render(<MemoryRouter><RequestPasswordReset /></MemoryRouter>);
    await user.type(screen.getByRole('textbox', { name: 'Email address' }), 'test@test.com');
    await user.click(screen.getByTestId('submit-button'));
    expect(mockedUseNavigate).toHaveBeenCalledWith(MESSAGE_URL, { state: { title: 'Something has gone wrong', message: undefined, redirectURL: REQUEST_PASSWORD_RESET_URL } });
  });

  it('should navigate to message page if 500 POST response', async () => {
    const user = userEvent.setup();
    mockAxios
      .onPost(PASSSWORD_RESET_ENDPOINT, { email: 'test@test.com' })
      .reply(500);

    render(<MemoryRouter><RequestPasswordReset /></MemoryRouter>);
    await user.type(screen.getByRole('textbox', { name: 'Email address' }), 'test@test.com');
    await user.click(screen.getByTestId('submit-button'));
    expect(mockedUseNavigate).toHaveBeenCalledWith(MESSAGE_URL, { state: { title: 'Something has gone wrong', message: undefined, redirectURL: REQUEST_PASSWORD_RESET_URL } });
  });
});
