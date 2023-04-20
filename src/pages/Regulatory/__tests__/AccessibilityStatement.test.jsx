import { render, screen } from '@testing-library/react';
import AccessibilityStatement from '../AccessibilityStatement';

describe('Accessibility statement tests', () => {
  it('should render accessibility statement title', async () => {
    render(<AccessibilityStatement />);
    expect(screen.getByText('Accessibility statement for National Maritime Single Window')).toBeInTheDocument();
  });

  it('should render link to site title', async () => {
    render(<AccessibilityStatement />);
    expect(screen.getByRole('link', { name: 'National Maritime Single Window' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'National Maritime Single Window' }).outerHTML).toBe('<a class="govuk-link" href="https://nmsw.homeoffice.gov.uk" target="_blank" rel="noopener noreferrer">National Maritime Single Window</a>');
  });

  it('should render link to service email', async () => {
    render(<AccessibilityStatement />);
    expect(screen.getByRole('link', { name: 'spcr@homeoffice.gov.uk' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'spcr@homeoffice.gov.uk' }).outerHTML).toBe('<a class="govuk-link" href="mailto: spcr@homeoffice.gov.uk">spcr@homeoffice.gov.uk</a>');
  });

  it('should render link to email to request alternative format as stated in page constants', async () => {
    render(<AccessibilityStatement />);
    expect(screen.getByRole('link', { name: 'alternativeformats@homeoffice.gov.uk' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'alternativeformats@homeoffice.gov.uk' }).outerHTML).toBe('<a class="govuk-link" href="mailto: alternativeformats@homeoffice.gov.uk">alternativeformats@homeoffice.gov.uk</a>');
  });

  it('should render link to AbilityNet as stated in page constants', async () => {
    render(<AccessibilityStatement />);
    expect(screen.getByRole('link', { name: 'AbilityNet' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'AbilityNet' }).outerHTML).toBe('<a class="govuk-link" href="https://mcmw.abilitynet.org.uk" target="_blank" rel="noopener noreferrer">AbilityNet</a>');
  });

  it('should render link to a complaint escalation site as stated in page constants', async () => {
    render(<AccessibilityStatement />);
    expect(screen.getByRole('link', { name: 'contact the Equality Advisory and Support Website (EASS)' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'contact the Equality Advisory and Support Website (EASS)' }).outerHTML).toBe('<a class="govuk-link" href="https://www.equalityadvisoryservice.com" target="_blank" rel="noopener noreferrer">contact the Equality Advisory and Support Website (EASS)</a>');
  });

  it('should render link ta complaint escalation site for Northern Ireland as stated in page constants', async () => {
    render(<AccessibilityStatement />);
    expect(screen.getByRole('link', { name: 'Equalities Commission for Northern Ireland' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Equalities Commission for Northern Ireland' }).outerHTML).toBe('<a class="govuk-link" href="https://www.equalityni.org/Home" target="_blank" rel="noopener noreferrer">Equalities Commission for Northern Ireland</a>');
  });

  it('should render link to WCAG as stated in page constants', async () => {
    render(<AccessibilityStatement />);
    expect(screen.getByRole('link', { name: 'Web Content Accessibility Guidelines version 2.1' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Web Content Accessibility Guidelines version 2.1' }).outerHTML).toBe('<a class="govuk-link" href="https://www.w3.org/TR/WCAG21" target="_blank" rel="noopener noreferrer">Web Content Accessibility Guidelines version 2.1</a>');
  });
});
