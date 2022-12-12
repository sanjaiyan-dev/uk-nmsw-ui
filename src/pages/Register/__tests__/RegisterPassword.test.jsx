import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import RegisterYourPassword from '../RegisterYourPassword';

describe('Register password tests', () => {
  const handleSubmit = jest.fn();
  let scrollIntoViewMock = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('should render h1', async () => {
    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    expect(screen.getByText('Create a password')).toBeInTheDocument();
  });

  it('should render an intro', async () => {
    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    expect(screen.getByText('Your password must be at least 10 characters long. There is no restriction on the characters you use.')).toBeInTheDocument();
    expect(screen.getByText('To create a long and strong password, the National Cyber Security Centre recommends using.')).toBeInTheDocument();
    expect(screen.getByText('3 random words')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://www.ncsc.gov.uk/collection/top-tips-for-staying-secure-online/three-random-words#:~:text=Why%20does%20the%20NCSC%20recommend,enough%20for%20you%20to%20remember');
  });

  it('should render two password questions', async () => {
    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Password').outerHTML).toEqual('<input class="govuk-input" id="passwordInput" name="password" type="password"">');
    expect(screen.getByLabelText('Confirm your password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm your password').outerHTML).toEqual('<input class="govuk-input" id="confirmPasswordInput" name="confirmPassword" type="password"">');
  });

  it('should render a continue button', async () => {
    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    expect(screen.getByRole('button', {name: 'Continue'}).outerHTML).toEqual('<button type="button" class="govuk-button" data-module="govuk-button" data-testid="submit-button">Continue</button>');
  });

  it('should NOT call the handleSubmit function on button click if there ARE errors', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    await user.click(screen.getByTestId('submit-button'));
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('should display the Error Summary if there are errors', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
  });

  it('should display the required error messages if required fields are null', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getAllByText('Enter a password')).toHaveLength(2);
    expect(screen.getAllByText('Confirm your password')).toHaveLength(2);
  });

  it('should display the required error messages if just confirm password is null', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    await user.type(screen.getByLabelText('Password'), 'mypasswordis');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getAllByText('Enter a password')).toHaveLength(2);
    expect(screen.getAllByText('Confirm your password')).toHaveLength(2);
  });

  it('should display the error messages if password fields do not match', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    await user.type(screen.getByLabelText('Password'), 'mypasswordis');
    await user.type(screen.getByLabelText('Confirm your password'), 'mypass');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getAllByText('Passwords must match')).toHaveLength(2);
  });

  it('should NOT display error messagess if fields are valid', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterYourPassword /></MemoryRouter>);
    await user.type(screen.getByLabelText('Password'), 'mypasswordis');
    await user.type(screen.getByLabelText('Confirm your password'), 'mypasswordis');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.queryByText('There is a problem')).not.toBeInTheDocument();
    expect(screen.queryByText('Enter a password')).not.toBeInTheDocument();
    expect(screen.queryByText('Confirm your password')).not.toBeInTheDocument();
  });
});
