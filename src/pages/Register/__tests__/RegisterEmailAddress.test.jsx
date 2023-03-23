import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import RegisterEmailAddress from '../RegisterEmailAddress';

describe('Register email address tests', () => {
  const handleSubmit = jest.fn();
  const scrollIntoViewMock = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('should render h1', async () => {
    render(<MemoryRouter><RegisterEmailAddress /></MemoryRouter>);
    expect(screen.getByText('What is your email address?')).toBeInTheDocument();
  });

  it('should render an intro inset', async () => {
    render(<MemoryRouter><RegisterEmailAddress /></MemoryRouter>);
    expect(screen.getByText('We may use these details to contact you if we have questions about reports that you submit.')).toBeInTheDocument();
  });

  it('should render two email address fields', async () => {
    render(<MemoryRouter><RegisterEmailAddress /></MemoryRouter>);
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getAllByRole('textbox', { name: /email/i })[0].outerHTML).toEqual('<input class="govuk-input" id="emailAddress-input" name="emailAddress" type="email" autocomplete="email" value="">');
    expect(screen.getByLabelText('Confirm email address')).toBeInTheDocument();
    expect(screen.getAllByRole('textbox', { name: /email/i })[1].outerHTML).toEqual('<input class="govuk-input" id="repeatEmailAddress-input" name="repeatEmailAddress" type="email" autocomplete="email" value="">');
  });

  it('should display a primary styled continue button', () => {
    render(<MemoryRouter><RegisterEmailAddress /></MemoryRouter>);
    expect((screen.getByTestId('submit-button')).outerHTML).toEqual('<button type="button" class="govuk-button" data-module="govuk-button" data-testid="submit-button">Send confirmation email</button>');
  });

  it('should NOT call the handleSubmit function on button click if there ARE errors', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterEmailAddress /></MemoryRouter>);
    await user.click(screen.getByTestId('submit-button'));
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('should display the Error Summary if there are errors', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterEmailAddress /></MemoryRouter>);
    await user.click(screen.getByTestId('submit-button'));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
  });

  it('should display the email required error if there is no email address', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterEmailAddress /></MemoryRouter>);
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getAllByText('Enter a real email address')).toHaveLength(2);
  });

  it('should scroll to email field and set focus on email input if user clicks on email required error link', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterEmailAddress /></MemoryRouter>);
    await user.click(screen.getByTestId('submit-button'));
    await user.click(screen.getByRole('button', { name: 'Enter a real email address' }));
    expect(scrollIntoViewMock).toHaveBeenCalled();
    expect(screen.getAllByRole('textbox', { name: /email/i })[0]).toHaveFocus();
  });

  it('should display the email invalid error if the email address has no @', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterEmailAddress /></MemoryRouter>);
    await user.type(screen.getAllByRole('textbox', { name: /email/i })[0], 'testemail');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getAllByText('Enter a real email address')).toHaveLength(2);
  });

  it('should display the email invalid error if the email address has no .xx', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterEmailAddress /></MemoryRouter>);
    await user.type(screen.getAllByRole('textbox', { name: /email/i })[0], 'testemail@boo');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getAllByText('Enter a real email address')).toHaveLength(2);
  });

  it('should scroll to email field and set focus on email input if user clicks on email invalid format error link', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterEmailAddress /></MemoryRouter>);
    await user.type(screen.getAllByRole('textbox', { name: /email/i })[0], 'testemail@boo');
    await user.click(screen.getByTestId('submit-button'));
    await user.click(screen.getByRole('button', { name: 'Enter a real email address' }));
    expect(scrollIntoViewMock).toHaveBeenCalled();
    expect(screen.getAllByRole('textbox', { name: /email/i })[0]).toHaveFocus();
  });

  it('should display the emails must match error if the repeat email field value is null', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterEmailAddress /></MemoryRouter>);
    await user.type(screen.getAllByRole('textbox', { name: /email/i })[0], 'testemail@boo.com');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getAllByText('Confirm your email address')).toHaveLength(2);
  });

  it('should scroll to repeat email field and set focus on repeat email input if user clicks on repeat email required link', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterEmailAddress /></MemoryRouter>);
    await user.type(screen.getAllByRole('textbox', { name: /email/i })[0], 'testemail@boo.com');
    await user.click(screen.getByTestId('submit-button'));
    await user.click(screen.getByRole('button', { name: 'Confirm your email address' }));
    expect(scrollIntoViewMock).toHaveBeenCalled();
    expect(screen.getAllByRole('textbox', { name: /email/i })[1]).toHaveFocus();
  });

  it('should display the emails must match error if the repeat email field value does not match the email value', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterEmailAddress /></MemoryRouter>);
    await user.type(screen.getAllByRole('textbox', { name: /email/i })[0], 'testemail@boo.com');
    await user.type(screen.getAllByRole('textbox', { name: /email/i })[1], 'testemail@boo');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.getAllByText('Email addresses must match')).toHaveLength(2);
  });

  it('should scroll to repeat email field and set focus on repeat email input if user clicks on emails dont match error link', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterEmailAddress /></MemoryRouter>);
    await user.type(screen.getAllByRole('textbox', { name: /email/i })[0], 'testemail@boo.com');
    await user.type(screen.getAllByRole('textbox', { name: /email/i })[1], 'testemail@boo');
    await user.click(screen.getByTestId('submit-button'));
    await user.click(screen.getByRole('button', { name: 'Email addresses must match' }));
    expect(scrollIntoViewMock).toHaveBeenCalled();
    expect(screen.getAllByRole('textbox', { name: /email/i })[1]).toHaveFocus();
  });

  it('should NOT display the email errors if the email address is a valid format & emails match (case insensitive)', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterEmailAddress /></MemoryRouter>);
    await user.type(screen.getAllByRole('textbox', { name: /email/i })[0], 'testemail@email.com');
    await user.type(screen.getAllByRole('textbox', { name: /email/i })[1], 'testEMAIL@email.COM');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.queryByText('Enter your email address')).not.toBeInTheDocument();
    expect(screen.queryByText('Enter a real email address')).not.toBeInTheDocument();
    expect(screen.queryByText('Confirm your email address')).not.toBeInTheDocument();
    expect(screen.queryByText('Email addresses must match')).not.toBeInTheDocument();
  });
});
