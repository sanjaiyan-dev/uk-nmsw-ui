import { render, screen, waitFor } from '@testing-library/react';
import { SERVICE_NAME } from '../../constants/AppConstants';
import Landing from './Landing';

describe('Landing page tests', () => {

  it('should render the page with the service name as a H1', async () => {
    await waitFor(() => { render(<Landing />); });
    expect(screen.getByText('National Maritime Single Window')).toBeInTheDocument();
  });

  it('should render the service name text from the constants file', async () => {
    await waitFor(() => { render(<Landing />); });
    expect(screen.getByText(SERVICE_NAME)).toBeInTheDocument();
  });

  it('should tell the user what the service is used for', async () => {
    await waitFor(() => {render(<Landing />); });
    expect(screen.getByText('Use this service to:')).toBeInTheDocument();
  });

});
