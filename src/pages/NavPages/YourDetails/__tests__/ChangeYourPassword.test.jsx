import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { GENERIC_CONFIRMATION_URL, YOUR_DETAILS_PAGE_URL } from '../../../../constants/AppUrlConstants';
import ChangeYourPassword from '../ChangeYourPassword';

let mockUseLocationState = {};
const mockedUseNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedUseNavigate,
  useLocation: jest.fn().mockImplementation(() => mockUseLocationState),
}));

describe('Change your password tests', () => {
  const handleSubmit = jest.fn();

  beforeEach(() => {
    mockUseLocationState = {};
    window.sessionStorage.clear();
  });

  it('should render h1', () => {
    render(<MemoryRouter><ChangeYourPassword /></MemoryRouter>);
    expect(screen.getByText('Change your password')).toBeInTheDocument();
  });

  it('should render a current password question', () => {
    render(<MemoryRouter><ChangeYourPassword /></MemoryRouter>);
    expect(screen.getByLabelText('Enter your current password')).toBeInTheDocument();
    expect(screen.getByLabelText('Enter your current password').outerHTML).toEqual('<input class="govuk-input" id="currentPassword-input" data-testid="currentPassword-passwordField" name="currentPassword" type="password" value="">');
  });

  it('should render a new password question', () => {
    render(<MemoryRouter><ChangeYourPassword /></MemoryRouter>);
    expect(screen.getByLabelText('New password')).toBeInTheDocument();
    expect(screen.getByLabelText('New password').outerHTML).toEqual('<input class="govuk-input" id="requirePassword-input" data-testid="requirePassword-passwordField" name="requirePassword" type="password" value="">');
  });

  it('should render repeat new password question', () => {
    render(<MemoryRouter><ChangeYourPassword /></MemoryRouter>);
    expect(screen.getByLabelText('Confirm new password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm new password').outerHTML).toEqual('<input class="govuk-input" id="repeatPassword-input" data-testid="repeatPassword-passwordField" name="repeatPassword" type="password" value="">');
  });

  it('should render a change password button', () => {
    render(<MemoryRouter><ChangeYourPassword /></MemoryRouter>);
    expect(screen.getByRole('button', { name: 'Change password' }).outerHTML).toEqual('<button type="button" class="govuk-button" data-module="govuk-button" data-testid="submit-button">Change password</button>');
  });

  it('should NOT call the handleSubmit function on button click if there ARE errors', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ChangeYourPassword /></MemoryRouter>);
    await user.click(screen.getByTestId('submit-button'));
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('should display the Error Summary if there are errors', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ChangeYourPassword /></MemoryRouter>);
    await user.click(screen.getByTestId('submit-button'));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
  });

  it('should display the required error messages if required fields are null', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ChangeYourPassword /></MemoryRouter>);
    await user.click(screen.getByTestId('submit-button'));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getAllByText('Enter a password')).toHaveLength(2);
    // This text is also in the 'hint' text so occurs 3 times
    expect(screen.getAllByText('Enter a new password')).toHaveLength(3);
    expect(screen.getAllByText('Confirm your new password')).toHaveLength(2);
  });

  it('should display error message if fields are formatted incorrectly', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ChangeYourPassword /></MemoryRouter>);
    await user.type(screen.getByLabelText('New password'), 'Password123');
    await user.type(screen.getByLabelText('Confirm new password'), 'Password1234');
    await user.click(screen.getByTestId('submit-button'));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getAllByText('Passwords must match')).toHaveLength(2);
  });

  it('should display error message if password too short', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ChangeYourPassword /></MemoryRouter>);
    await user.type(screen.getByLabelText('New password'), 'Password');
    await user.type(screen.getByLabelText('Confirm new password'), 'Password');
    await user.click(screen.getByTestId('submit-button'));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getAllByText('Password must be at least 10 characters long')).toHaveLength(2);
  });

  it('should display error message if password contains spaces', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ChangeYourPassword /></MemoryRouter>);
    await user.type(screen.getByLabelText('New password'), 'Password12 34');
    await user.click(screen.getByTestId('submit-button'));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getAllByText('Password must not contain spaces')).toHaveLength(2);
  });

  it('should NOT display error messagess if fields are valid', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ChangeYourPassword /></MemoryRouter>);
    await user.type(screen.getByLabelText('Enter your current password'), 'Password123');
    await user.type(screen.getByLabelText('New password'), 'AnotherPassword');
    await user.type(screen.getByLabelText('Confirm new password'), 'AnotherPassword');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.queryByText('There is a problem')).not.toBeInTheDocument();
    expect(screen.queryByText('Enter a password')).not.toBeInTheDocument();
    expect(screen.queryByText('Confirm your new password')).not.toBeInTheDocument();
    expect(screen.queryByText('Passwords must match')).not.toBeInTheDocument();
    expect(screen.queryByText('Password must be at least 10 characters long')).not.toBeInTheDocument();
    expect(screen.queryByText('Password must not contain spaces')).not.toBeInTheDocument();
  });

  it('should take user to a confirmation page is there are no errors', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ChangeYourPassword /></MemoryRouter>);

    await user.type(screen.getByLabelText('Enter your current password'), 'Password123');
    await user.type(screen.getByLabelText('New password'), 'AnotherPassword');
    await user.type(screen.getByLabelText('Confirm new password'), 'AnotherPassword');
    await user.click(screen.getByTestId('submit-button'));

    expect(mockedUseNavigate).toHaveBeenCalledWith(
      GENERIC_CONFIRMATION_URL,
      {
        state: {
          pageTitle: 'Change your details confirmation',
          nextPageLink: YOUR_DETAILS_PAGE_URL,
          nextPageName: 'your details',
          confirmationMessage: 'Your details have been saved',
        },
      },
    );
  });
});
