import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { SERVICE_NAME } from '../../constants/AppConstants';
import App from '../../App';
import Nav from '../Nav';

let mockedUserIsPermitted = false;
jest.mock('../../hooks/useUserIsPermitted', () => jest.fn(() => (mockedUserIsPermitted)));

describe('Navigation within header tests', () => {

  beforeEach(() => {
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
    expect(screen.queryByText('Second page')).not.toBeInTheDocument();
  });

  it('should render nav items when user has permission to view them', () => {
    mockedUserIsPermitted = true;
    render(<MemoryRouter><Nav /></MemoryRouter>);
    expect(screen.getByText('Your voyages')).toBeInTheDocument();
    expect(screen.getByText('Second page')).toBeInTheDocument();
  });

  it('should load the Your voyages component and set its nav item to active when nav item clicked, and other nav items to not have active class', async () => {
    mockedUserIsPermitted = true;
    const user = userEvent.setup();
    render(<MemoryRouter><App /></MemoryRouter>);
    await user.click(screen.getByText('Your voyages'));
    expect(screen.getAllByText('Your voyages')).toHaveLength(2); // h1 & nav item
    expect(screen.getByTestId('listitem-YourVoyages').outerHTML).toEqual('<li class="govuk-header__navigation-item govuk-header__navigation-item--active" data-testid="listitem-YourVoyages"><a class="govuk-header__link" href="/your-voyages">Your voyages</a></li>');
    expect(screen.getByTestId('listitem-SecondPage').outerHTML).toEqual('<li class="govuk-header__navigation-item" data-testid="listitem-SecondPage"><a class="govuk-header__link" href="/second-page">Second page</a></li>');
  });

  it('should load the Second page component and set its nav item to active when nav item clicked, and other nav items to not have active class', async () => {
    mockedUserIsPermitted = true;
    const user = userEvent.setup();
    render(<MemoryRouter><App /></MemoryRouter>);
    await user.click(screen.getByText('Second page'));
    expect(screen.getAllByText('Second page')).toHaveLength(2); // h1 & nav item
    expect(screen.getByTestId('listitem-YourVoyages').outerHTML).toEqual('<li class="govuk-header__navigation-item" data-testid="listitem-YourVoyages"><a class="govuk-header__link" href="/your-voyages">Your voyages</a></li>');
    expect(screen.getByTestId('listitem-SecondPage').outerHTML).toEqual('<li class="govuk-header__navigation-item govuk-header__navigation-item--active" data-testid="listitem-SecondPage"><a class="govuk-header__link" href="/second-page">Second page</a></li>');
  });

  it('should set all nav items to inactive class when service name is clicked', async () => {
    mockedUserIsPermitted = true;
    const user = userEvent.setup();
    render(<MemoryRouter><App /></MemoryRouter>);
    await user.click(screen.getByTestId('serviceName'));
    expect(screen.getByTestId('listitem-YourVoyages').outerHTML).toEqual('<li class="govuk-header__navigation-item" data-testid="listitem-YourVoyages"><a class="govuk-header__link" href="/your-voyages">Your voyages</a></li>');
    expect(screen.getByTestId('listitem-SecondPage').outerHTML).toEqual('<li class="govuk-header__navigation-item" data-testid="listitem-SecondPage"><a class="govuk-header__link" href="/second-page">Second page</a></li>');
  });

  it('should set all nav items to inactive class when logo is clicked', async () => {
    mockedUserIsPermitted = true;
    const user = userEvent.setup();
    render(<MemoryRouter><App /></MemoryRouter>);
    await user.click(screen.getByText('GOV.UK'));
    expect(screen.getByTestId('listitem-YourVoyages').outerHTML).toEqual('<li class="govuk-header__navigation-item" data-testid="listitem-YourVoyages"><a class="govuk-header__link" href="/your-voyages">Your voyages</a></li>');
    expect(screen.getByTestId('listitem-SecondPage').outerHTML).toEqual('<li class="govuk-header__navigation-item" data-testid="listitem-SecondPage"><a class="govuk-header__link" href="/second-page">Second page</a></li>');
  });

  it('should set highlight NO nav items if a new url is rendered and it does not relate to any of them', () => {
    mockedUserIsPermitted = true;
    render(<MemoryRouter><App /></MemoryRouter>);
    expect(screen.getByTestId('listitem-YourVoyages').outerHTML).toEqual('<li class="govuk-header__navigation-item" data-testid="listitem-YourVoyages"><a class="govuk-header__link" href="/your-voyages">Your voyages</a></li>');
    expect(screen.getByTestId('listitem-SecondPage').outerHTML).toEqual('<li class="govuk-header__navigation-item" data-testid="listitem-SecondPage"><a class="govuk-header__link" href="/second-page">Second page</a></li>');
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
    mockedUserIsPermitted = true;
    const user = userEvent.setup();
    render(<MemoryRouter><App /></MemoryRouter>);
    await user.click(screen.getByText('Second page'));
    await user.type(screen.getByLabelText('First name'), 'Bob');
    
    expect(window.sessionStorage.getItem('formData')).toStrictEqual('{"firstName":"Bob"}');

    await user.click(screen.getByText('Your voyages'));
    expect(window.sessionStorage.getItem('formData')).toStrictEqual(null);
  });
});
