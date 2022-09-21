import { render, screen, waitFor } from '@testing-library/react';
import CookieBanner from '../CookieBanner';

describe('CookieBanner tests', () => {

  it('should render the CookieBanner with cookie text', async () => {
    await waitFor(() => { render(<CookieBanner />); });
    expect(screen.getByText('Cookies on National Maritime Single Window')).toBeInTheDocument();
    expect(screen.getByText('We use some essential cookies to make this service work.')).toBeInTheDocument();
    expect(screen.getByText('We\'d also like to use analytics cookies so we can understand how you use the service and make improvements.')).toBeInTheDocument();
  });
});
