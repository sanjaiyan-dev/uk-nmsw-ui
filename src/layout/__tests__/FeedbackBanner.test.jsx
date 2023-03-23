import { render, screen, waitFor } from '@testing-library/react';
import { FEEDBACK_URL } from '../../constants/AppUrlConstants';
import FeedbackBanner from '../FeedbackBanner';

describe('feedback Banner tests', () => {
  it('should render the FeedbackBanner with the feedback sentence', async () => {
    await waitFor(() => { render(<FeedbackBanner />); });
    const checkFeedbackBannerText = screen.getByTestId('feedbackText');
    expect(screen.getByRole('heading', { name: 'We welcome your feedback' })).toBeInTheDocument();
    expect(checkFeedbackBannerText).toHaveTextContent('Help us improve this service by completing a short survey (opens in new tab).');
  });

  it('should create the feedback url based on the constant', async () => {
    await waitFor(() => { render(<FeedbackBanner />); });
    const checkFeedbackBannerLink = screen.getByRole('link', { name: 'short survey (opens in new tab)' });
    expect(checkFeedbackBannerLink.outerHTML).toEqual(`<a class="govuk-link" href="${FEEDBACK_URL}" target="_blank" rel="noreferrer">short survey (opens in new tab)</a>`);
  });

  it('should contain this feedback url', async () => {
    await waitFor(() => { render(<FeedbackBanner />); });
    const checkFeedbackBannerLink = screen.getByRole('link', { name: 'short survey (opens in new tab)' });
    expect(checkFeedbackBannerLink.outerHTML).toEqual('<a class="govuk-link" href="https://www.homeofficesurveys.homeoffice.gov.uk/s/6MBWPJ/" target="_blank" rel="noreferrer">short survey (opens in new tab)</a>');
  });
});
