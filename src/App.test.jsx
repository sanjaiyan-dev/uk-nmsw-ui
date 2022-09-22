import { render, screen, waitFor } from '@testing-library/react';
import { SERVICE_NAME } from './constants/AppConstants.js';
import App from './App.jsx';

describe('App tests', () => {

  // adding this test here on the assumption we form the page container in App, 
  // if we move that to another file then should move this render heading, phase banner and footer tests too
  it('should render the heading on the page', async () => {
    await waitFor(() => { render(<App />); });
    expect(screen.getByText('GOV.UK')).toBeInTheDocument();
    expect(screen.getByText(SERVICE_NAME)).toBeInTheDocument();
  });

  it('should render the phase banner on the page', async () => {
    await waitFor(() => { render(<App />); });
    const checkPhaseBannerText = screen.getByTestId('phaseBannerText');
    const checkPhaseBannerLink = screen.getByText('feedback');
    expect(checkPhaseBannerText).toHaveTextContent('This is a new service - your ');
    expect(checkPhaseBannerLink).toBeInTheDocument();
    expect(checkPhaseBannerText).toHaveTextContent(' will help us to improve it.');
  });

  it('should render the footer on the page', async () => {
    await waitFor(() => { render(<App />); });
    const checkCrownCopyrightLogo = screen.getByText('© Crown copyright');
    expect(checkCrownCopyrightLogo).toBeInTheDocument();
    expect(checkCrownCopyrightLogo.outerHTML).toEqual('<a class="govuk-footer__link govuk-footer__copyright-logo" href="/">© Crown copyright</a>');
  });
});
