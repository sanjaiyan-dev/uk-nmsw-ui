import { render, screen, waitFor } from '@testing-library/react';
import { SERVICE_NAME } from './constants/AppConstants.js';
import App from './App.jsx';
import Header from './layout/Header';

describe('App tests', () => {

  // adding this test here on the assumption we form the page container in App, 
  // if we move that to another file then should move this render heading test too
  it('should render the heading on the page', async () => {
    await waitFor(() => { render(<Header />); });
    expect(screen.getByText('GOV.UK')).toBeInTheDocument();
    expect(screen.getByText(SERVICE_NAME)).toBeInTheDocument();
  });

  it('should render the page with a h1', async () => {
    await waitFor(() => { render(<App />); });
    const checkHeading = screen.getByText('Basic setup');
    expect(checkHeading).toBeInTheDocument();
    expect(checkHeading.outerHTML).toEqual('<h1 class="govuk-heading-l">Basic setup</h1>');
  });
});
