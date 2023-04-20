import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  PASSSWORD_RESET_ENDPOINT,
} from '../../../constants/AppAPIConstants';
import {
  MESSAGE_URL,
  REQUEST_PASSWORD_RESET_URL,
} from '../../../constants/AppUrlConstants';
import ResetPassword from '../ResetPassword';

let mockUseLocationState = { state: {} };
const mockedUseNavigate = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedUseNavigate,
  useLocation: jest.fn().mockImplementation(() => mockUseLocationState),
  useSearchParams: () => [new URLSearchParams({ token: '123' })],
}));

describe('Reset password tests', () => {
  const handleSubmit = jest.fn();
  const mockAxios = new MockAdapter(axios);
  const scrollIntoViewMock = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

  beforeEach(() => {
    mockAxios.reset();
    mockUseLocationState = { state: {} };
    window.sessionStorage.clear();
  });

  it('should render h1', async () => {
    render(<MemoryRouter><ResetPassword /></MemoryRouter>);
    expect(screen.getByText('Change your password')).toBeInTheDocument();
  });

  it('should render an intro', async () => {
    render(<MemoryRouter><ResetPassword /></MemoryRouter>);
    expect(screen.getByText('Your new password needs to be 10 or more characters. There is no restriction on the characters you use.')).toBeInTheDocument();
    /*
     * Because the text below is in a paragraph which has a link within it, RTL struggles to find the text in the render
     * We could test by adding a data-testId
     * but we can also test more easily with the Cypress tests
     * so leaving this line for the Cypress tests
     */
    // expect(screen.getByText('To create a long and strong password, the National Cyber Security Centre recommends using ')).toBeInTheDocument();
    expect(screen.getByText('3 random words (opens in new tab)')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://www.ncsc.gov.uk/collection/top-tips-for-staying-secure-online/three-random-words#:~:text=Why%20does%20the%20NCSC%20recommend,enough%20for%20you%20to%20remember');
  });

  it('should render two password questions', async () => {
    render(<MemoryRouter><ResetPassword /></MemoryRouter>);
    expect(screen.getByLabelText('New password')).toBeInTheDocument();
    expect(screen.getByLabelText('New password').outerHTML).toEqual('<input class="govuk-input" id="requirePassword-input" data-testid="requirePassword-passwordField" name="requirePassword" type="password" value="">');
    expect(screen.getByLabelText('Confirm new password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm new password').outerHTML).toEqual('<input class="govuk-input" id="repeatPassword-input" data-testid="repeatPassword-passwordField" name="repeatPassword" type="password" value="">');
  });

  it('should render a submit button', async () => {
    render(<MemoryRouter><ResetPassword /></MemoryRouter>);
    expect(screen.getByRole('button', { name: 'Reset password' }).outerHTML).toEqual('<button type="button" class="govuk-button" data-module="govuk-button" data-testid="submit-button">Reset password</button>');
  });

  it('should NOT call the handleSubmit function on button click if there ARE errors', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ResetPassword /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: 'Reset password' }));
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('should display the Error Summary if there are errors', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ResetPassword /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: 'Reset password' }));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
  });

  it('should display the required error messages if required fields are null', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ResetPassword /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: 'Reset password' }));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getAllByText('Enter a password')).toHaveLength(2);
    expect(screen.getAllByText('Confirm new password')).toHaveLength(3); // label & 2 error messages
  });

  it('should display the required error messages if just confirm password is null', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ResetPassword /></MemoryRouter>);
    await user.type(screen.getByLabelText('New password'), 'mypasswordis');
    await user.click(screen.getByRole('button', { name: 'Reset password' }));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getAllByText('Confirm new password')).toHaveLength(3);
  });

  it('should display the min length error messages if password value too short', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ResetPassword /></MemoryRouter>);
    await user.type(screen.getByLabelText('New password'), 'shortpwd');
    await user.click(screen.getByRole('button', { name: 'Reset password' }));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getAllByText('Password must be at least 10 characters long')).toHaveLength(2);
  });

  it('should display the error messages if password values do not match', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ResetPassword /></MemoryRouter>);
    await user.type(screen.getByLabelText('New password'), 'mypasswordis');
    await user.type(screen.getByLabelText('Confirm new password'), 'mypass');
    await user.click(screen.getByRole('button', { name: 'Reset password' }));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getAllByText('Passwords must match')).toHaveLength(2);
  });

  it('should display the error messages if password values do not match only due to capitalisation', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ResetPassword /></MemoryRouter>);
    await user.type(screen.getByLabelText('New password'), 'mypasswordis');
    await user.type(screen.getByLabelText('Confirm new password'), 'myPasswordIs');
    await user.click(screen.getByRole('button', { name: 'Reset password' }));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getAllByText('Passwords must match')).toHaveLength(2);
  });

  it('should display the error messages if password value has spaces', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ResetPassword state={{ dataToSubmit: { sampleField: 'field value', secondField: 'second value' } }} /></MemoryRouter>);
    await user.type(screen.getByLabelText('New password'), 'my password');
    await user.click(screen.getByRole('button', { name: 'Reset password' }));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getAllByText('Password must not contain spaces')).toHaveLength(2);
  });

  it('should display the error messages if password value has spaces at the start', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ResetPassword state={{ dataToSubmit: { sampleField: 'field value', secondField: 'second value' } }} /></MemoryRouter>);
    await user.type(screen.getByLabelText('New password'), ' mypassword');
    await user.click(screen.getByRole('button', { name: 'Reset password' }));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getAllByText('Password must not contain spaces')).toHaveLength(2);
  });

  it('should display the error messages if password value has spaces at the end', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ResetPassword state={{ dataToSubmit: { sampleField: 'field value', secondField: 'second value' } }} /></MemoryRouter>);
    await user.type(screen.getByLabelText('New password'), 'mypassword ');
    await user.click(screen.getByRole('button', { name: 'Reset password' }));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getAllByText('Password must not contain spaces')).toHaveLength(2);
  });

  it('should display the required error messages if password value is only spaces', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ResetPassword state={{ dataToSubmit: { sampleField: 'field value', secondField: 'second value' } }} /></MemoryRouter>);
    await user.type(screen.getByLabelText('New password'), '          ');
    await user.click(screen.getByRole('button', { name: 'Reset password' }));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getAllByText('Enter a password')).toHaveLength(2);
    expect(screen.queryByText('Password must not contain spaces')).not.toBeInTheDocument();
  });

  it('should display the min length error message if password has spaces and is fewer than 10 characters', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ResetPassword state={{ dataToSubmit: { sampleField: 'field value', secondField: 'second value' } }} /></MemoryRouter>);
    await user.type(screen.getByLabelText('New password'), '   s');
    await user.click(screen.getByRole('button', { name: 'Reset password' }));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getAllByText('Password must be at least 10 characters long')).toHaveLength(2);
    expect(screen.queryByText('Password must not contain spaces')).not.toBeInTheDocument();
  });

  it('should NOT display error messagess if fields are valid', async () => {
    const user = userEvent.setup();
    mockAxios
      .onPatch(PASSSWORD_RESET_ENDPOINT)
      .reply(204, {
        password: 'abc1234567',
        token: 'tokennumber',
      });

    render(<MemoryRouter><ResetPassword /></MemoryRouter>);
    await user.type(screen.getByLabelText('New password'), 'mypasswordis');
    await user.type(screen.getByLabelText('Confirm new password'), 'mypasswordis');
    await user.click(screen.getByRole('button', { name: 'Reset password' }));
    expect(screen.queryByText('There is a problem')).not.toBeInTheDocument();
    expect(screen.queryByText('Enter a password')).not.toBeInTheDocument();
    expect(screen.queryByText('Confirm new password')).not.toBeInTheDocument();
  });

  it('should show confirmation message on successful change', async () => {
    const user = userEvent.setup();
    mockAxios
      .onPatch(PASSSWORD_RESET_ENDPOINT)
      .reply(204, {
        password: 'abc1234567',
        token: 'tokennumber',
      });

    render(<MemoryRouter><ResetPassword /></MemoryRouter>);
    await user.type(screen.getByLabelText('New password'), 'mypasswordis');
    await user.type(screen.getByLabelText('Confirm new password'), 'mypasswordis');
    await user.click(screen.getByRole('button', { name: 'Reset password' }));
    expect(screen.getByRole('heading', { name: 'Your password has been reset' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Your password has been reset' }).outerHTML).toEqual('<h1 class="govuk-panel__title govuk-!-margin-bottom-6">Your password has been reset</h1>');
    expect(screen.getByRole('link', { name: 'Sign in to start using the service' })).toBeInTheDocument();
  });

  it('should navigate to link expired page if no token found', async () => {
    const user = userEvent.setup();
    mockAxios
      .onPatch(PASSSWORD_RESET_ENDPOINT)
      .reply(400, {
        password: 'abc1234567',
        token: null,
      });

    render(<MemoryRouter><ResetPassword /></MemoryRouter>);
    await user.type(screen.getByLabelText('New password'), 'mypasswordis');
    await user.type(screen.getByLabelText('Confirm new password'), 'mypasswordis');
    await user.click(screen.getByRole('button', { name: 'Reset password' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(MESSAGE_URL, { state: { button: { buttonLabel: 'Request a new link', buttonNavigateTo: '/forgotten-password' }, title: 'Password reset link has expired' } });
  });

  it('should navigate to link expired page if expired token found', async () => {
    const user = userEvent.setup();
    mockAxios
      .onPatch(PASSSWORD_RESET_ENDPOINT)
      .reply(401, {
        password: 'abc1234567',
        token: 'expiredToken',
      });

    render(<MemoryRouter><ResetPassword /></MemoryRouter>);
    await user.type(screen.getByLabelText('New password'), 'mypasswordis');
    await user.type(screen.getByLabelText('Confirm new password'), 'mypasswordis');
    await user.click(screen.getByRole('button', { name: 'Reset password' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(MESSAGE_URL, { state: { button: { buttonLabel: 'Request a new link', buttonNavigateTo: '/forgotten-password' }, title: 'Password reset link has expired' } });
  });

  it('should navigate to something went wrong page on other errors', async () => {
    const user = userEvent.setup();
    mockAxios
      .onPatch(PASSSWORD_RESET_ENDPOINT)
      .reply(500);

    render(<MemoryRouter><ResetPassword /></MemoryRouter>);
    await user.type(screen.getByLabelText('New password'), 'mypasswordis');
    await user.type(screen.getByLabelText('Confirm new password'), 'mypasswordis');
    await user.click(screen.getByRole('button', { name: 'Reset password' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(MESSAGE_URL, { state: { title: 'Something has gone wrong', message: undefined, redirectURL: REQUEST_PASSWORD_RESET_URL } });
  });
});
