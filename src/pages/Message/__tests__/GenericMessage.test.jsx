import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { LANDING_URL, SIGN_IN_URL } from '../../../constants/AppUrlConstants';
import GenericMessage from '../GenericMessage';

const mockUseLocationState = { state: {} };
const mockedUseNavigate = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedUseNavigate,
  useLocation: jest.fn().mockImplementation(() => mockUseLocationState),
}));

describe('Error page tests', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    mockUseLocationState.state = {};
  });

  it('should render h1 as the title that was passed in', () => {
    mockUseLocationState.state = { title: 'Page title', redirectURL: SIGN_IN_URL };
    render(<MemoryRouter><GenericMessage /></MemoryRouter>);
    expect(screen.getByText('Page title')).toBeInTheDocument();
  });

  it('should render paragraph if a message was passed in', () => {
    mockUseLocationState.state = { title: 'Page title', message: 'This is the page message', redirectURL: SIGN_IN_URL };
    render(<MemoryRouter><GenericMessage /></MemoryRouter>);
    expect(screen.getByText('This is the page message')).toBeInTheDocument();
  });

  it('should render a click here to continue link to the URL passed to this page', async () => {
    const user = userEvent.setup();
    mockUseLocationState.state = { redirectURL: SIGN_IN_URL };
    render(<MemoryRouter><GenericMessage /></MemoryRouter>);
    expect(screen.getByText('Click here to continue')).toBeInTheDocument();
    await user.click(screen.getByText('Click here to continue'));

    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(SIGN_IN_URL, {
        preventScrollReset: undefined, relative: undefined, replace: false, state: undefined,
      }); // params on Link generated links by default
    });
  });

  it('should render a click here to continue link to the Landing page if no url passed to this page', async () => {
    const user = userEvent.setup();
    mockUseLocationState.state = {};
    render(<MemoryRouter><GenericMessage /></MemoryRouter>);
    expect(screen.getByText('Click here to continue')).toBeInTheDocument();
    await user.click(screen.getByText('Click here to continue'));

    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(LANDING_URL, {
        preventScrollReset: undefined, relative: undefined, replace: true, state: undefined,
      }); // params on Link generated links by default
    });
  });
});
