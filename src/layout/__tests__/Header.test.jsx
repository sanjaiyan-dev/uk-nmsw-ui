import { render, screen, waitFor } from '@testing-library/react';
import { SERVICE_NAME } from '../../constants/AppConstants';
import Header from '../Header';

describe('Header tests', () => {

  it('should render the header with GovUK logo text', async () => {
    await waitFor(() => { render(<Header />); });
    expect(screen.getByText('GOV.UK')).toBeInTheDocument();
  });

  it('should render the service name text from the constants file', async () => {
    await waitFor(() => { render(<Header />); });
    expect(screen.getByText(SERVICE_NAME)).toBeInTheDocument();
  });

  it('should render the expected Service name', async () => {
    await waitFor(() => { render(<Header />); });
    expect(screen.getByText('National Maritime Single Window')).toBeInTheDocument();
  });
});
