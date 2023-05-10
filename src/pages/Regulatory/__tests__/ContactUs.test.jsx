import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ContactUs from '../ContactUs';

describe('Contact us page tests', () => {
  it('should render a title of Contact us page', async () => {
    render(<MemoryRouter><ContactUs /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Contact us' })).toBeInTheDocument();
  });

  it('should link to /help if user is not signed in', () => {
    render(<MemoryRouter><ContactUs /></MemoryRouter>);
    expect(screen.getByRole('link', { name: 'help section' }).outerHTML).toBe('<a class="govuk-link" href="/help">help section</a>');
  });

  it('should link to /help-page if user is signed in', () => {
    sessionStorage.setItem('token', '123');
    render(<MemoryRouter><ContactUs /></MemoryRouter>);
    expect(screen.getByRole('link', { name: 'help section' }).outerHTML).toBe('<a class="govuk-link" href="/help-page">help section</a>');
  });

  it('should render link to service email', async () => {
    render(<MemoryRouter><ContactUs /></MemoryRouter>);
    expect(screen.getByRole('link', { name: 'nmswsupport@digital.homeoffice.gov.uk' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'nmswsupport@digital.homeoffice.gov.uk' }).outerHTML).toBe('<a class="govuk-link" href="mailto: nmswsupport@digital.homeoffice.gov.uk">nmswsupport@digital.homeoffice.gov.uk</a>');
  });
});
