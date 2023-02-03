import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import GenericConfirmation from '../GenericConfirmation';

const mockUseLocationState = { state: {} };
const mockedUsedNavigate = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedUsedNavigate,
  useLocation: jest.fn().mockImplementation(() => mockUseLocationState),
}));

describe('Generic confirmation page', () => {
  it('should render the confirmation page if state exists', () => {
    mockUseLocationState.state = {
      pageTitle: 'Generic Confirmation',
      confirmationMessage: 'Action was successful',
      nextPageLink: '/next-page',
      nextPageName: 'next page',
    };
    render(<MemoryRouter><GenericConfirmation /></MemoryRouter>);
    expect(screen.getByText('Action was successful')).toBeInTheDocument();
  });

  it('should show an error message if the page loads without form submitted details', () => {
    mockUseLocationState.state = '';
    render(<MemoryRouter><GenericConfirmation /></MemoryRouter>);
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong, please try again')).toBeInTheDocument();
    expect((screen.getByText('There is a problem')).outerHTML).toEqual('<h2 class="govuk-error-summary__title" id="error-summary-title">There is a problem</h2>');
  });

  it('should show an error message if the page loads with an empty object of form submitted details', () => {
    mockUseLocationState.state = {};
    render(<MemoryRouter><GenericConfirmation /></MemoryRouter>);
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong, please try again')).toBeInTheDocument();
    expect((screen.getByText('There is a problem')).outerHTML).toEqual('<h2 class="govuk-error-summary__title" id="error-summary-title">There is a problem</h2>');
  });

  it('should have confirmation message as the h1', () => {
    mockUseLocationState.state = {
      pageTitle: 'Generic Confirmation',
      confirmationMessage: 'Action was successful',
      nextPageLink: '/next-page',
      nextPageName: 'next page',
    };
    render(<MemoryRouter><GenericConfirmation /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Action was successful' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Action was successful' }).outerHTML).toEqual('<h1 class="govuk-panel__title govuk-!-margin-bottom-6">Action was successful</h1>');
  });

  it('should have a link to take you to the page specified', async () => {
    mockUseLocationState.state = {
      pageTitle: 'Generic Confirmation',
      confirmationMessage: 'Action was successful',
      nextPageLink: '/next-page',
      nextPageName: 'next page',
    };
    const user = userEvent.setup();

    render(<MemoryRouter><GenericConfirmation /></MemoryRouter>);
    expect(screen.getByRole('link', { name: 'Return to next page' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Return to next page' }).outerHTML).toEqual('<a href="/next-page">Return to next page</a>');
    await user.click(screen.getByRole('link', { name: 'Return to next page' }));
    expect(mockedUsedNavigate).toHaveBeenCalled();
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/next-page', {
      preventScrollReset: undefined, relative: undefined, replace: false, state: undefined,
    });
  });
});
