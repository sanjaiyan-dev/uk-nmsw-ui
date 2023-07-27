import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { SERVICE_NAME } from '../../constants/AppConstants';
import App from '../../App';
import Nav from '../Nav';
import { SIGN_OUT_ENDPOINT } from '../../constants/AppAPIConstants';
import { SIGN_IN_URL } from '../../constants/AppUrlConstants';

let mockedUserIsPermitted = false;
jest.mock('../../hooks/useUserIsPermitted', () => jest.fn(() => (mockedUserIsPermitted)));

const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

describe('Navigation within header tests', () => {
  const mockAxios = new MockAdapter(axios);

  beforeEach(() => {
    mockAxios.reset();
    window.sessionStorage.clear();
  });

  it('should render the header with GovUK logo text', () => {
    render(<MemoryRouter><Nav /></MemoryRouter>);
    expect(screen.getByText('GOV.UK')).toBeInTheDocument();
  });

  it('should render the service name text from the constants file', () => {
    render(<MemoryRouter><Nav /></MemoryRouter>);
    expect(screen.getByText(SERVICE_NAME)).toBeInTheDocument();
  });

  it('should render the expected Service name', () => {
    render(<MemoryRouter><Nav /></MemoryRouter>);
    expect(screen.getByText('National Maritime Single Window')).toBeInTheDocument();
  });

  it('should NOT render nav items when user DOES NOT have permission to view them', () => {
    mockedUserIsPermitted = false;
    render(<MemoryRouter><Nav /></MemoryRouter>);
    expect(screen.queryByText('Your voyages')).not.toBeInTheDocument();
    expect(screen.queryByText('Templates')).not.toBeInTheDocument();
    expect(screen.queryByText('Your details')).not.toBeInTheDocument();
  });

  it('should render nav items when user has permission to view them', () => {
    mockedUserIsPermitted = true;
    render(<MemoryRouter><Nav /></MemoryRouter>);
    expect(screen.getByText('Your voyages')).toBeInTheDocument();
    expect(screen.getByText('Templates')).toBeInTheDocument();
    expect(screen.getByText('Your details')).toBeInTheDocument();
  });

  it('should load the Your voyages component and set its nav item to active when nav item clicked, and other nav items to not have active class', async () => {
    mockedUserIsPermitted = true;
    const user = userEvent.setup();
    render(<MemoryRouter><App /></MemoryRouter>);
    expect(screen.getByRole('link', { name: 'Your voyages' })).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Your voyages' }));
    expect(screen.getByTestId('listitem-YourVoyages').outerHTML).toEqual('<li class="govuk-header__navigation-item govuk-header__navigation-item--active" data-testid="listitem-YourVoyages"><a class="govuk-header__link" href="/your-voyages">Your voyages</a></li>');
    expect(screen.getByTestId('listitem-Templates').outerHTML).toEqual('<li class="govuk-header__navigation-item" data-testid="listitem-Templates"><a class="govuk-header__link" href="/templates">Templates</a></li>');
    expect(screen.getByTestId('listitem-YourDetails').outerHTML).toEqual('<li class="govuk-header__navigation-item" data-testid="listitem-YourDetails"><a class="govuk-header__link" href="/your-details">Your details</a></li>');
  });

  it('should load the Templates component and set its nav item to active when nav item clicked, and other nav items to not have active class', async () => {
    mockedUserIsPermitted = true;
    const user = userEvent.setup();
    render(<MemoryRouter><App /></MemoryRouter>);
    expect(screen.getByRole('link', { name: 'Templates' })).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Templates' }));
    expect(screen.getByTestId('listitem-YourVoyages').outerHTML).toEqual('<li class="govuk-header__navigation-item" data-testid="listitem-YourVoyages"><a class="govuk-header__link" href="/your-voyages">Your voyages</a></li>');
    expect(screen.getByTestId('listitem-Templates').outerHTML).toEqual('<li class="govuk-header__navigation-item govuk-header__navigation-item--active" data-testid="listitem-Templates"><a class="govuk-header__link" href="/templates">Templates</a></li>');
  });

  it('should set all nav items to inactive class when service name is clicked', async () => {
    mockedUserIsPermitted = true;
    const user = userEvent.setup();
    render(<MemoryRouter><App /></MemoryRouter>);
    await user.click(screen.getByTestId('serviceName'));
    expect(screen.getByTestId('listitem-YourVoyages').outerHTML).toEqual('<li class="govuk-header__navigation-item" data-testid="listitem-YourVoyages"><a class="govuk-header__link" href="/your-voyages">Your voyages</a></li>');
    expect(screen.getByTestId('listitem-Templates').outerHTML).toEqual('<li class="govuk-header__navigation-item" data-testid="listitem-Templates"><a class="govuk-header__link" href="/templates">Templates</a></li>');
    expect(screen.getByTestId('listitem-YourDetails').outerHTML).toEqual('<li class="govuk-header__navigation-item" data-testid="listitem-YourDetails"><a class="govuk-header__link" href="/your-details">Your details</a></li>');
  });

  it('should set all nav items to inactive class when logo is clicked', async () => {
    mockedUserIsPermitted = true;
    const user = userEvent.setup();
    render(<MemoryRouter><App /></MemoryRouter>);
    await user.click(screen.getByText('GOV.UK'));
    expect(screen.getByTestId('listitem-YourVoyages').outerHTML).toEqual('<li class="govuk-header__navigation-item" data-testid="listitem-YourVoyages"><a class="govuk-header__link" href="/your-voyages">Your voyages</a></li>');
    expect(screen.getByTestId('listitem-Templates').outerHTML).toEqual('<li class="govuk-header__navigation-item" data-testid="listitem-Templates"><a class="govuk-header__link" href="/templates">Templates</a></li>');
    expect(screen.getByTestId('listitem-YourDetails').outerHTML).toEqual('<li class="govuk-header__navigation-item" data-testid="listitem-YourDetails"><a class="govuk-header__link" href="/your-details">Your details</a></li>');
  });

  it('should set highlight NO nav items if a new url is rendered and it does not relate to any of them', () => {
    mockedUserIsPermitted = true;
    render(<MemoryRouter><App /></MemoryRouter>);
    expect(screen.getByTestId('listitem-YourVoyages').outerHTML).toEqual('<li class="govuk-header__navigation-item" data-testid="listitem-YourVoyages"><a class="govuk-header__link" href="/your-voyages">Your voyages</a></li>');
    expect(screen.getByTestId('listitem-Templates').outerHTML).toEqual('<li class="govuk-header__navigation-item" data-testid="listitem-Templates"><a class="govuk-header__link" href="/templates">Templates</a></li>');
    expect(screen.getByTestId('listitem-YourDetails').outerHTML).toEqual('<li class="govuk-header__navigation-item" data-testid="listitem-YourDetails"><a class="govuk-header__link" href="/your-details">Your details</a></li>');
  });

  it('should toggle menu state when menu button is clicked (small screen functionality)', async () => {
    mockedUserIsPermitted = true;
    const user = userEvent.setup();
    render(<MemoryRouter><Nav /></MemoryRouter>);
    expect(screen.getByText('Menu')).toBeInTheDocument();
    // closed by default
    expect(screen.getByRole('button').outerHTML).toEqual('<button type="button" class="govuk-header__menu-button govuk-js-header-toggle" aria-controls="navigation" aria-label="Show or hide navigation menu" aria-expanded="false">Menu</button>');
    // click to toggle it to open
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('button').outerHTML).toEqual('<button type="button" class="govuk-header__menu-button govuk-js-header-toggle govuk-header__menu-button--open" aria-controls="navigation" aria-label="Show or hide navigation menu" aria-expanded="true">Menu</button>');
    // click to toggle it back to closed
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('button').outerHTML).toEqual('<button type="button" class="govuk-header__menu-button govuk-js-header-toggle" aria-controls="navigation" aria-label="Show or hide navigation menu" aria-expanded="false">Menu</button>');
  });

  it('should clear formData when a nav item is clicked', async () => {
    window.sessionStorage.setItem('formData', JSON.stringify({
      testField: 'Hello Test Field', radioButtonSet: 'radioOne', radioWithConditional: 'optionWithConditional', conditionalTextInput: 'world', testPhoneField: '(123)12345',
    }));
    mockedUserIsPermitted = true;
    const user = userEvent.setup();
    render(<MemoryRouter><App /></MemoryRouter>);
    await user.click(screen.getByText('Templates'));
    expect(window.sessionStorage.getItem('formData')).toStrictEqual(null);
  });

  it('should clear token from session and redirect to sign in page on successful sign out', async () => {
    window.sessionStorage.setItem('token', '123');
    window.sessionStorage.setItem('refreshToken', '321');
    mockedUserIsPermitted = true;
    const user = userEvent.setup();
    mockAxios
      .onPost(SIGN_OUT_ENDPOINT, {})
      .reply(200, {
        message: 'Sign out successful',
      });

    render(<MemoryRouter><App /></MemoryRouter>);
    await user.click(screen.getByText('Sign out'));
    expect(window.sessionStorage.getItem('token')).toStrictEqual(null);
    expect(mockedUseNavigate).toHaveBeenCalledWith(SIGN_IN_URL);
  });

  // Error case will usually be when a user clicks sign out but token is already expired
  it('should clear token from session and redirect to sign in page on sign out', async () => {
    window.sessionStorage.setItem('token', '123');
    window.sessionStorage.setItem('refreshToken', '321');
    mockedUserIsPermitted = true;
    const user = userEvent.setup();
    mockAxios
      .onPost(SIGN_OUT_ENDPOINT, {})
      .reply(401, {
        message: 'Sign out unsuccessful',
      });

    render(<MemoryRouter><App /></MemoryRouter>);
    await user.click(screen.getByText('Sign out'));
    expect(window.sessionStorage.getItem('token')).toStrictEqual(null);
    expect(mockedUseNavigate).toHaveBeenCalledWith(SIGN_IN_URL);
  });
});
