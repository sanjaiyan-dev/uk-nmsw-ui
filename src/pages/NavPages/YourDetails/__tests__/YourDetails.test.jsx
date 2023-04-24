import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import YourDetails from '../YourDetails';
import { TOKEN_EXPIRED, USER_ENDPOINT } from '../../../../constants/AppAPIConstants';
import { MESSAGE_URL, SIGN_IN_URL, YOUR_DETAILS_PAGE_URL } from '../../../../constants/AppUrlConstants';

const mockedUseNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedUseNavigate,
}));

describe('Your details tests', () => {
  const mockAxios = new MockAdapter(axios);

  beforeEach(() => {
    mockAxios.reset();
  });

  it('should render the YourDetails page titles', async () => {
    render(<MemoryRouter><YourDetails /></MemoryRouter>);
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.getByRole('heading', { name: 'Your details' })).toBeInTheDocument();
    expect(screen.getByText('Email address')).toBeInTheDocument();
    expect(screen.getByText('Full name')).toBeInTheDocument();
    expect(screen.getByText('Your company name')).toBeInTheDocument();
    expect(screen.getByText('Phone number')).toBeInTheDocument();
    expect(screen.getByText('Country')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Account details' })).toBeInTheDocument();
    expect(screen.getByText('Type of account')).toBeInTheDocument();
    expect(screen.getByText('Company type')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Change your password' })).toBeInTheDocument();
  });

  it('should render user details if success response', async () => {
    mockAxios
      .onGet(USER_ENDPOINT)
      .reply(200, {
        userId: '123',
        email: 'useremail@test.com',
        fullName: 'Bob Doe',
        phoneNumber: '(44)123456789',
        countryCode: 'GBR',
        verified: true,
        dateCreated: '2023-02-06T16:21:09.958032',
        lastUpdated: '2023-04-18T09:09:54.759977',
        userType: {
          userTypeId: '321',
          name: 'Admin',
        },
        groupId: '456',
      });

    render(<MemoryRouter><YourDetails /></MemoryRouter>);
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.getByText('useremail@test.com')).toBeInTheDocument();
    expect(screen.getByText('Bob Doe')).toBeInTheDocument();
    expect(screen.getByText('(44)123456789')).toBeInTheDocument();
    expect(screen.getByText('GBR')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('should redirect to sign in if getting the declarations returns a 422', async () => {
    mockAxios
      .onGet(USER_ENDPOINT)
      .reply(422, { msg: 'Not enough segments' });
    render(<MemoryRouter><YourDetails /></MemoryRouter>);

    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(SIGN_IN_URL, { state: { redirectURL: YOUR_DETAILS_PAGE_URL } });
    });
  });

  it('should redirect to sign in if getting the declarations returns a 401 token expired', async () => {
    mockAxios
      .onGet(USER_ENDPOINT)
      .reply(401, { msg: TOKEN_EXPIRED });
    render(<MemoryRouter><YourDetails /></MemoryRouter>);

    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(SIGN_IN_URL, { state: { redirectURL: YOUR_DETAILS_PAGE_URL } });
    });
  });

  it('should redirect to message page on other errors', async () => {
    mockAxios
      .onGet(USER_ENDPOINT)
      .reply(500);
    render(<MemoryRouter><YourDetails /></MemoryRouter>);

    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(MESSAGE_URL, { state: { title: 'Something has gone wrong', undefined, redirectURL: YOUR_DETAILS_PAGE_URL } });
    });
  });

  it('should redirect user to change your password page if link is clicked', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><YourDetails /></MemoryRouter>);

    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    await user.click(screen.getByRole('link', { name: 'Change your password' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith('/forgotten-password', {
      preventScrollReset: undefined, relative: undefined, replace: false, state: { title: 'Change your password' },
    });
  });
});
