import { render, screen, waitFor } from '@testing-library/react';
import { FEEDBACK_URL } from '../../constants/AppUrlConstants';
import PhaseBanner from '../PhaseBanner';

describe('Phase Banner tests', () => {
  it('should render the PhaseBanner with the feedback sentence', async () => {
    await waitFor(() => { render(<PhaseBanner />); });
    const checkPhaseBannerText = screen.getByTestId('phaseBannerText');
    const checkPhaseBannerLink = screen.getByText('feedback');
    expect(checkPhaseBannerText).toHaveTextContent('This is a new service - your ');
    expect(checkPhaseBannerLink).toBeInTheDocument();
    expect(checkPhaseBannerText).toHaveTextContent(' will help us to improve it.');
  });

  it('should create the feedback url based on the constant', async () => {
    await waitFor(() => { render(<PhaseBanner />); });
    const checkPhaseBannerLink = screen.getByText('feedback');
    expect(checkPhaseBannerLink.outerHTML).toEqual(`<a class="govuk-link" href="${FEEDBACK_URL}">feedback</a>`);
  });

  it('should contain this feedback url', async () => {
    await waitFor(() => { render(<PhaseBanner />); });
    const checkPhaseBannerLink = screen.getByText('feedback');
    expect(checkPhaseBannerLink.outerHTML).toEqual('<a class="govuk-link" href="/">feedback</a>');
  });
});
