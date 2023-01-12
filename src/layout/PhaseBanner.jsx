import { FEEDBACK_URL } from '../constants/AppUrlConstants';

const PhaseBanner = () => (
  <div role="region" className="govuk-phase-banner">
    <p className="govuk-phase-banner__content">
      <strong className="govuk-tag govuk-phase-banner__content__tag">
        beta
      </strong>
      <span className="govuk-phase-banner__text" data-testid="phaseBannerText">
        This is a new service - your <a className="govuk-link" href={FEEDBACK_URL}>feedback</a> will help us to improve it.
      </span>
    </p>
  </div>
);

export default PhaseBanner;
