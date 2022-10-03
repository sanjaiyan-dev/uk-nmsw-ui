import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SERVICE_NAME } from './constants/AppConstants.js';
import App from './App.jsx';

describe('App tests', () => {
  it('should render the heading on the page', async () => {
    render(<BrowserRouter><App /></BrowserRouter>);
    expect(screen.getByText('GOV.UK')).toBeInTheDocument();
    expect(screen.getByTestId('serviceName').textContent).toEqual(SERVICE_NAME);
  });

  it('should render the phase banner on the page', async () => {
    render(<BrowserRouter><App /></BrowserRouter>);
    expect(screen.getByTestId('phaseBannerText')).toHaveTextContent('This is a new service - your ');
    expect(screen.getByText('feedback')).toBeInTheDocument();
    expect(screen.getByTestId('phaseBannerText')).toHaveTextContent(' will help us to improve it.');
  });

  it('should render the footer on the page', async () => {
    render(<BrowserRouter><App /></BrowserRouter>);
    expect(screen.getByText('© Crown copyright')).toBeInTheDocument();
    expect(screen.getByText('© Crown copyright').outerHTML).toEqual('<a class="govuk-footer__link govuk-footer__copyright-logo" target="_blank" rel="noreferrer noopener" href="https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/">© Crown copyright</a>');
    expect(screen.getByText('Cookies')).toBeInTheDocument();
    expect(screen.getByText('Cookies').outerHTML).toEqual('<a class="govuk-footer__link" href="/cookies">Cookies</a>');
    expect(screen.getByText('Accessibility')).toBeInTheDocument();
    expect(screen.getByText('Accessibility').outerHTML).toEqual('<a class="govuk-footer__link" href="/accessibility-statement">Accessibility</a>');
  });
});
