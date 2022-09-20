import { render, screen, waitFor } from '@testing-library/react';
import App from '../App.jsx';

describe('App tests', () => {

  it('should render the page with a h1', async () => {
    await waitFor(() => { render(<App />); });
    const checkHeading = screen.getByText('Basic setup');
    expect(checkHeading).toBeInTheDocument();
    expect(checkHeading.outerHTML).toEqual('<h1 class="govuk-heading-l">Basic setup</h1>');
  });
});
