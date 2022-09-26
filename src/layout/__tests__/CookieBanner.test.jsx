import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CookieBanner from '../CookieBanner';

// For when more than just the cookiePreference cookie exists 
const extractPreferenceCookie = (cookieName) => {
  const cookieArray = document.cookie.split(';');

  for (let i = 0; i < cookieArray.length; i++) {
    let cookiePair = cookieArray[i].split('=');
    if (cookieName == cookiePair[0].trim()) {
      return cookieArray[i];
    }
  }
};

describe('CookieBanner tests', () => {

  it('should render the CookieBanner with cookie text', async () => {
    await waitFor(() => { render(<CookieBanner />); });
    expect(screen.getByText('Cookies on National Maritime Single Window')).toBeInTheDocument();
    expect(screen.getByText('We use some essential cookies to make this service work.')).toBeInTheDocument();
    expect(screen.getByText('We\'d also like to use analytics cookies so we can understand how you use the service and make improvements.')).toBeInTheDocument();
  });

  it('should render an accept and a reject button', async () => {
    await waitFor(() => { render(<CookieBanner />); });
    const acceptButton = screen.getByRole('button', { name: 'Accept analytics cookies' });
    const rejectButton = screen.getByRole('button', { name: 'Reject analytics cookies' });

    expect(acceptButton).toBeInTheDocument();
    expect(rejectButton).toBeInTheDocument();
  });

  it('should set cookiePreference to true when Accept analytics cookies is clicked', async () => {
    const user = userEvent.setup();
    await waitFor(() => { render(<CookieBanner />); });

    const acceptButton = screen.getByRole('button', { name: 'Accept analytics cookies' });
    user.click(acceptButton);
    await waitFor(() => { expect(extractPreferenceCookie('cookiePreference')).toEqual('cookiePreference=true'); });
  });

  it('should set cookiePreference to false when Reject analytics cookies is clicked', async () => {
    const user = userEvent.setup();
    await waitFor(() => { render(<CookieBanner />); });

    const rejectButton = screen.getByRole('button', { name: 'Reject analytics cookies' });
    user.click(rejectButton);
    await waitFor(() => { expect(extractPreferenceCookie('cookiePreference')).toEqual('cookiePreference=false'); });
  });
});
