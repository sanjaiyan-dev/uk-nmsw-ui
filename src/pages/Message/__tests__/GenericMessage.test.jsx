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
    expect(screen.getByRole('heading', { name: 'Page title' })).toBeInTheDocument();
  });

  it('should render paragraph if a message of type string was passed in', () => {
    mockUseLocationState.state = { title: 'Page title', message: 'This is the page message', redirectURL: SIGN_IN_URL };
    render(<MemoryRouter><GenericMessage /></MemoryRouter>);
    expect(screen.getByText('This is the page message')).toBeInTheDocument();
  });

  it('should NOT render paragraph if a message of type other than string was passed in', () => {
    mockUseLocationState.state = { title: 'Page title', message: [{ error: 'There is an error', message: 'There is a nested message' }], redirectURL: SIGN_IN_URL };
    render(<MemoryRouter><GenericMessage /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Page title' })).toBeInTheDocument(); // testing page renders
  });

  it('should render link text if it was passed in', () => {
    mockUseLocationState.state = {
      title: 'Page title',
      linkText: 'Link text to show',
      message: 'This is the page message',
      redirectURL: SIGN_IN_URL,
    };
    render(<MemoryRouter><GenericMessage /></MemoryRouter>);
    expect(screen.getByRole('link', { name: 'Link text to show' })).toBeInTheDocument();
  });

  it('should render click here to continue as the link text if none was passed in', () => {
    mockUseLocationState.state = { title: 'Page title', message: 'This is the page message', redirectURL: SIGN_IN_URL };
    render(<MemoryRouter><GenericMessage /></MemoryRouter>);
    expect(screen.getByRole('link', { name: 'Click here to continue' })).toBeInTheDocument();
  });

  it('should render a link to the URL passed to this page', async () => {
    const user = userEvent.setup();
    mockUseLocationState.state = { redirectURL: SIGN_IN_URL };
    render(<MemoryRouter><GenericMessage /></MemoryRouter>);
    expect(screen.getByRole('link', { name: 'Click here to continue' })).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Click here to continue' }));

    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(SIGN_IN_URL, {
        preventScrollReset: undefined, relative: undefined, replace: false, state: { redirectURL: SIGN_IN_URL },
      }); // params on Link generated links by default
    });
  });

  it('should render a click here to continue link to the Landing page if no url passed to this page', async () => {
    const user = userEvent.setup();
    mockUseLocationState.state = {};
    render(<MemoryRouter><GenericMessage /></MemoryRouter>);
    expect(screen.getByRole('link', { name: 'Click here to continue' })).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Click here to continue' }));

    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(LANDING_URL, {
        preventScrollReset: undefined, relative: undefined, replace: true, state: {},
      }); // params on Link generated links by default
    });
  });
});
