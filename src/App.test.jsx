import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SERVICE_NAME } from './constants/AppConstants.js';
import App from './App.jsx';

describe('App tests', () => {
  it('should render the heading on the page', async () => {
    await waitFor(() => { render(<BrowserRouter><App /></BrowserRouter>); });
    expect(screen.getByText('GOV.UK')).toBeInTheDocument();
    expect(screen.getByTestId('serviceName').textContent).toEqual(SERVICE_NAME);
  });

  it('should render the phase banner on the page', async () => {
    await waitFor(() => { render(<BrowserRouter><App /></BrowserRouter>); });
    const checkPhaseBannerText = screen.getByTestId('phaseBannerText');
    const checkPhaseBannerLink = screen.getByText('feedback');
    expect(checkPhaseBannerText).toHaveTextContent('This is a new service - your ');
    expect(checkPhaseBannerLink).toBeInTheDocument();
    expect(checkPhaseBannerText).toHaveTextContent(' will help us to improve it.');
  });

  it('should render the footer on the page', async () => {
    await waitFor(() => { render(<BrowserRouter><App /></BrowserRouter>); });
    const checkCrownCopyrightLogo = screen.getByText('© Crown copyright');
    expect(checkCrownCopyrightLogo).toBeInTheDocument();
    expect(checkCrownCopyrightLogo.outerHTML).toEqual('<a class="govuk-footer__link govuk-footer__copyright-logo" href="/">© Crown copyright</a>');
  });
});
