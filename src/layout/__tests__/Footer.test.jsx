import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from '../Footer';

describe('Footer tests', () => {
  it('should render the footer with Crown Copyright text', async () => {
    await waitFor(() => { render(<MemoryRouter><Footer /></MemoryRouter>); });
    expect(screen.getByText('© Crown copyright')).toBeInTheDocument();
  });

  it('should render the Crown Copyright element with the class that contains the image & link to external page in new tab', async () => {
    await waitFor(() => { render(<MemoryRouter><Footer /></MemoryRouter>); });
    expect(screen.getByText('© Crown copyright')).toBeInTheDocument();
    expect(screen.getByText('© Crown copyright').outerHTML).toEqual('<a class="govuk-footer__link govuk-footer__copyright-logo" target="_blank" rel="noreferrer noopener" href="https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/">© Crown copyright</a>');
  });

  it('should render the Cookie link', async () => {
    await waitFor(() => { render(<MemoryRouter><Footer /></MemoryRouter>); });
    const cookieLink = screen.getByText('Cookies');
    expect(cookieLink).toBeInTheDocument();
    expect(cookieLink.outerHTML).toEqual('<a class="govuk-footer__link" href="/cookies">Cookies</a>');
  });

  it('should render the AccessibilityStatement link', async () => {
    await waitFor(() => { render(<MemoryRouter><Footer /></MemoryRouter>); });
    const AccessibilityStatementLink = screen.getByText('Accessibility');
    expect(AccessibilityStatementLink).toBeInTheDocument();
    expect(AccessibilityStatementLink.outerHTML).toEqual('<a class="govuk-footer__link" href="/accessibility-statement">Accessibility</a>');
  });

  it('should render the Privacy link', async () => {
    await waitFor(() => { render(<MemoryRouter><Footer /></MemoryRouter>); });
    const privacyNoticeLink = screen.getByText('Privacy');
    expect(privacyNoticeLink).toBeInTheDocument();
    expect(privacyNoticeLink.outerHTML).toEqual('<a class="govuk-footer__link" href="/privacy-notice">Privacy</a>');
  });
});
