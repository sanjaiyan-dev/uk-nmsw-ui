import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { SERVICE_NAME } from '../../constants/AppConstants';
import Header from '../Header';

describe('Header tests', () => {

  it('should render the header with GovUK logo text', async () => {
    await waitFor(() => { render(<MemoryRouter><Header /></MemoryRouter>); });
    expect(screen.getByText('GOV.UK')).toBeInTheDocument();
  });

  it('should render the service name text from the constants file', async () => {
    await waitFor(() => { render(<MemoryRouter><Header /></MemoryRouter>); });
    expect(screen.getByText(SERVICE_NAME)).toBeInTheDocument();
  });

  it('should render the expected Service name', async () => {
    await waitFor(() => { render(<MemoryRouter><Header /></MemoryRouter>); });
    expect(screen.getByText('National Maritime Single Window')).toBeInTheDocument();
  });

  it('should contain a skip link to allow screen reader users to easily skip to content element', async () => {
    const user = userEvent.setup();
    await waitFor(() => { render(<MemoryRouter><Header /></MemoryRouter>); });
    await user.keyboard('Tab');

    const checkSkipLink = screen.getByText('Skip to main content');
    expect(checkSkipLink).toBeInTheDocument();
    expect(checkSkipLink.outerHTML).toEqual('<a href="#content" class="govuk-skip-link">Skip to main content</a>');
  });
});
