import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import RegisterEmailAddress from '../RegisterEmailAddress';
import { SERVICE_CONTACT_EMAIL } from '../../../constants/AppConstants';

describe('Restricted emails attempting to register', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('should error on submit click if a registration email matches a restricted pattern - gov.uk', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterEmailAddress /></MemoryRouter>);

    // .gov.uk
    await user.type(screen.getAllByRole('textbox', { name: /email/i })[0], 'testemail@homeoffice.gov.uk');
    await user.type(screen.getAllByRole('textbox', { name: /email/i })[1], 'testemail@homeoffice.gov.uk');
    await user.click(screen.getByTestId('submit-button'));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getByRole('heading', { name: 'There is a problem' })).toBeInTheDocument();
    expect(screen.getByTestId('restrictedEmailText')).toHaveTextContent('You cannot register with testemail@homeoffice.gov.uk to use this service');
    expect(screen.getByText('If you need to view National Maritime Single Window reports')).toBeInTheDocument();
    expect(screen.getByText('You can request access by contacting the support desk at')).toBeInTheDocument();
    expect(screen.getByText(SERVICE_CONTACT_EMAIL)).toBeInTheDocument();
  });

  it('should error on submit click if a registration email matches a restricted pattern - police.uk', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterEmailAddress /></MemoryRouter>);

    // .police.uk
    await user.type(screen.getAllByRole('textbox', { name: /email/i })[0], 'testemail@test.police.uk');
    await user.type(screen.getAllByRole('textbox', { name: /email/i })[1], 'testemail@test.police.uk');
    await user.click(screen.getByTestId('submit-button'));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getByRole('heading', { name: 'There is a problem' })).toBeInTheDocument();
    expect(screen.getByTestId('restrictedEmailText')).toHaveTextContent('You cannot register with testemail@test.police.uk to use this service');
    expect(screen.getByText('If you need to view National Maritime Single Window reports')).toBeInTheDocument();
    expect(screen.getByText('You can request access by contacting the support desk at')).toBeInTheDocument();
    expect(screen.getByText(SERVICE_CONTACT_EMAIL)).toBeInTheDocument();
  });

  it('should NOT error on submit click email DOES NOT match a restricted pattern', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegisterEmailAddress /></MemoryRouter>);

    await user.type(screen.getAllByRole('textbox', { name: /email/i })[0], 'testemail@thisisok.com');
    await user.type(screen.getAllByRole('textbox', { name: /email/i })[1], 'testemail@thisisok.com');
    await user.click(screen.getByTestId('submit-button'));
    expect(screen.queryByRole('heading', { name: 'There is a problem' })).not.toBeInTheDocument();
    expect(screen.queryByText('You cannot register with testemail@thisisok.com to use this service')).not.toBeInTheDocument();
    expect(screen.queryByText('If you need to view National Maritime Single Window reports')).not.toBeInTheDocument();
    expect(screen.queryByText('You can request access by contacting the support desk at')).not.toBeInTheDocument();
    expect(screen.queryByText(SERVICE_CONTACT_EMAIL)).not.toBeInTheDocument();
  });
});
