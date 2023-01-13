import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { AXIOS_ERROR, REGISTER_ACCOUNT_ENDPOINT, USER_ALREADY_REGISTERED } from '../../../constants/AppAPIConstants';
import {
  MESSAGE_URL, ERROR_ACCOUNT_ALREADY_ACTIVE_URL, REGISTER_EMAIL_URL, REGISTER_EMAIL_CHECK_URL,
} from '../../../constants/AppUrlConstants';
import RegisterEmailAddress from '../RegisterEmailAddress';

const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

describe('Register email address POST tests', () => {
  const mockAxios = new MockAdapter(axios);

  beforeEach(() => {
    mockAxios.reset();
    window.sessionStorage.clear();
  });

  it('should render h1', () => {
    render(<MemoryRouter><RegisterEmailAddress /></MemoryRouter>);
    expect(screen.getByText('What is your email address')).toBeInTheDocument();
  });

  it('should navigate to register details page if successful POST response', async () => {
    const user = userEvent.setup();
    mockAxios
      .onPost(REGISTER_ACCOUNT_ENDPOINT)
      .reply(200, {
        email: 'testemail@email.com',
        id: 'e799cd36-9863-495b-9d6d-60132ea5abf5',
      });

    render(<MemoryRouter><RegisterEmailAddress /></MemoryRouter>);
    await user.type(screen.getAllByRole('textbox', { name: /email/i })[0], 'testemail@email.com');
    await user.type(screen.getAllByRole('textbox', { name: /email/i })[1], 'testemail@email.com');
    await user.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(REGISTER_EMAIL_CHECK_URL, { state: { dataToSubmit: { emailAddress: 'testemail@email.com' } } });
    });
  });

  it('should redirect to account already active page if account active response received', async () => {
    const user = userEvent.setup();
    mockAxios
      .onPost(REGISTER_ACCOUNT_ENDPOINT)
      .reply(400, {
        message: USER_ALREADY_REGISTERED,
      });

    render(<MemoryRouter><RegisterEmailAddress /></MemoryRouter>);
    await user.type(screen.getAllByRole('textbox', { name: /email/i })[0], 'testemail@email.com');
    await user.type(screen.getAllByRole('textbox', { name: /email/i })[1], 'testemail@email.com');
    await user.click(screen.getByTestId('submit-button'));
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(ERROR_ACCOUNT_ALREADY_ACTIVE_URL, { state: { dataToSubmit: { emailAddress: 'testemail@email.com' } } });
    });
  });

  it('should redirect to error page with message if a 4xx response received', async () => {
    const user = userEvent.setup();
    mockAxios
      .onPost(REGISTER_ACCOUNT_ENDPOINT)
      .reply(400, {
        message: 'I am an unexpected error message',
      });

    render(<MemoryRouter><RegisterEmailAddress /></MemoryRouter>);
    await user.type(screen.getAllByRole('textbox', { name: /email/i })[0], 'testemail@email.com');
    await user.type(screen.getAllByRole('textbox', { name: /email/i })[1], 'testemail@email.com');
    await user.click(screen.getByTestId('submit-button'));
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(MESSAGE_URL, { state: { title: 'Something has gone wrong', message: 'I am an unexpected error message', redirectURL: REGISTER_EMAIL_URL } }); // on error we redirect to error page
    });
  });

  it('should redirect to error page if axios response received', async () => {
    const user = userEvent.setup();
    mockAxios
      .onPost(REGISTER_ACCOUNT_ENDPOINT)
      .reply({ message: AXIOS_ERROR });

    render(<MemoryRouter><RegisterEmailAddress /></MemoryRouter>);
    await user.type(screen.getAllByRole('textbox', { name: /email/i })[0], 'testemail@email.com');
    await user.type(screen.getAllByRole('textbox', { name: /email/i })[1], 'testemail@email.com');
    await user.click(screen.getByTestId('submit-button'));
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(MESSAGE_URL, { state: { title: 'Something has gone wrong', redirectURL: REGISTER_EMAIL_URL } }); // on error we redirect to error page
    });
  });

  it('should redirect to error page if 500 response received', async () => {
    const user = userEvent.setup();
    mockAxios
      .onPost(REGISTER_ACCOUNT_ENDPOINT)
      .reply(500);

    render(<MemoryRouter><RegisterEmailAddress /></MemoryRouter>);
    await user.type(screen.getAllByRole('textbox', { name: /email/i })[0], 'testemail@email.com');
    await user.type(screen.getAllByRole('textbox', { name: /email/i })[1], 'testemail@email.com');
    await user.click(screen.getByTestId('submit-button'));
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(MESSAGE_URL, { state: { title: 'Something has gone wrong', redirectURL: REGISTER_EMAIL_URL } }); // on error we redirect to error page
    });
  });

  it('should redirect to error page if unknown error response received', async () => {
    const user = userEvent.setup();
    mockAxios
      .onPost(REGISTER_ACCOUNT_ENDPOINT)
      .reply(403, { message: 'unknown error' });

    render(<MemoryRouter><RegisterEmailAddress /></MemoryRouter>);
    await user.type(screen.getAllByRole('textbox', { name: /email/i })[0], 'testemail@email.com');
    await user.type(screen.getAllByRole('textbox', { name: /email/i })[1], 'testemail@email.com');
    await user.click(screen.getByTestId('submit-button'));
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(MESSAGE_URL, { state: { title: 'Something has gone wrong', message: 'unknown error', redirectURL: REGISTER_EMAIL_URL } }); // on error we redirect to error page
    });
  });
});
