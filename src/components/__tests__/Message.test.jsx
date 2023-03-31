import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { LANDING_URL } from '../../constants/AppUrlConstants';
import Message from '../Message';

const mockUseLocationState = { state: {} };
const mockedUseNavigate = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedUseNavigate,
  useLocation: jest.fn().mockImplementation(() => mockUseLocationState),
}));

describe('Message component tests', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('should render the page with only the required props', () => {
    render(
      <MemoryRouter>
        <Message
          title="Title from props"
          redirectURL="/url-from-props"
        />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: 'Title from props' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Click here to continue' }).outerHTML).toEqual('<a class="govuk-link" href="/url-from-props">Click here to continue</a>');
  });

  it('should render title, button, and message (but not link) when message and button props passed', () => {
    const buttonProp = {
      buttonLabel: 'Button label from props',
      buttonNavigateTo: '/url-for-button',
      buttonState: { state: { dataToSubmit: { emailAddress: 'testemail@email.com' } } },
    };

    render(
      <MemoryRouter>
        <Message
          button={buttonProp}
          message="Message from props"
          title="Title when all props exist"
        />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: 'Title when all props exist' })).toBeInTheDocument();
    expect(screen.getByText('Message from props')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Button label from props' }).outerHTML).toEqual('<button class="govuk-button" data-module="govuk-button" type="button">Button label from props</button>');
  });

  it('should render a click here to continue link to the URL passed to this page', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Message
          title="Title from props"
          redirectURL="/url-from-props"
        />
      </MemoryRouter>,
    );
    expect(screen.getByText('Click here to continue')).toBeInTheDocument();
    await user.click(screen.getByText('Click here to continue'));
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith('/url-from-props', {
        preventScrollReset: undefined, relative: undefined, replace: false, state: undefined,
      }); // params on Link generated links by default
    });
  });

  it('should render a click here to continue link to the Landing page if no url passed passed to this page', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Message
          title="Title from props"
        />
      </MemoryRouter>,
    );
    expect(screen.getByText('Click here to continue')).toBeInTheDocument();
    await user.click(screen.getByText('Click here to continue'));
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(LANDING_URL, {
        preventScrollReset: undefined, relative: undefined, replace: true, state: undefined,
      }); // params on Link generated links by default
    });
  });

  it('should include state on button click when state exists', async () => {
    const user = userEvent.setup();
    const buttonProp = {
      buttonLabel: 'Button label from props',
      buttonNavigateTo: '/url-for-button',
      buttonState: { state: { dataToSubmit: { emailAddress: 'testemail@email.com' } } },
    };

    render(
      <MemoryRouter>
        <Message
          button={buttonProp}
          message="Message from props"
          title="Title when all props exist"
        />
      </MemoryRouter>,
    );
    expect(screen.getByRole('button', { name: 'Button label from props' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Button label from props' }));
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith('/url-for-button', { state: { dataToSubmit: { emailAddress: 'testemail@email.com' } } });
    });
  });
});
