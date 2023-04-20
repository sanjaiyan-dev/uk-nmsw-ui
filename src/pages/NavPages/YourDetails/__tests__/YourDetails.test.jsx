import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import YourDetails from '../YourDetails';

const mockedUseNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedUseNavigate,
}));

describe('Your details tests', () => {
  it('should render the YourDetails page', () => {
    render(<MemoryRouter><YourDetails /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: 'Your details' })).toBeInTheDocument();
    expect(screen.getByText('Email address')).toBeInTheDocument();
    expect(screen.getByText('Full name')).toBeInTheDocument();
    expect(screen.getByText('Your company name')).toBeInTheDocument();
    expect(screen.getByText('Phone number')).toBeInTheDocument();
    expect(screen.getByText('Country')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Change your details' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Account details' })).toBeInTheDocument();
    expect(screen.getByText('Type of account')).toBeInTheDocument();
    expect(screen.getByText('Company type')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Change your password' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete your account' })).toBeInTheDocument();
  });

  it('should redirect user to change your details page if link is clicked', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><YourDetails /></MemoryRouter>);

    await user.click(screen.getByRole('link', { name: 'Change your details' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith('/change-your-details', {
      preventScrollReset: undefined, relative: undefined, replace: false, state: undefined,
    });
  });

  it('should redirect user to change your password page if link is clicked', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><YourDetails /></MemoryRouter>);

    await user.click(screen.getByRole('link', { name: 'Change your password' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith('/forgotten-password', {
      preventScrollReset: undefined, relative: undefined, replace: false, state: { title: 'Change your password' },
    });
  });
});
