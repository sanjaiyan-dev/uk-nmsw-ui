import { FEEDBACK_URL } from '../constants/AppUrlConstants';

const FeedbackBanner = () => (
  <div role="region" aria-label="Feedback banner" className="feedback-banner--container">
    <div className="feedback-banner-text--container">
      <h2 className="govuk-body-m feedback-banner--heading govuk-!-margin-bottom-1 govuk-!-font-weight-bold">We welcome your feedback</h2>
      <p className="govuk-body-s govuk-!-margin-bottom-0" data-testid="feedbackText">Help us improve this service by completing a <a className="govuk-link" href={FEEDBACK_URL} target="_blank" rel="noreferrer">short survey (opens in new tab)</a>.</p>
    </div>
  </div>
);

export default FeedbackBanner;
