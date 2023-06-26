import { Link } from 'react-router-dom';
import { SERVICE_CONTACT_EMAIL, SERVICE_NAME } from '../../constants/AppConstants';
import {
  YOUR_VOYAGES_URL,
  REGISTER_ACCOUNT_URL,
  SIGN_IN_URL,
} from '../../constants/AppUrlConstants';
import useUserIsPermitted from '../../hooks/useUserIsPermitted';
import DownloadTemplates from '../../components/DownloadTemplates';

const Landing = () => {
  const isAuthenticated = useUserIsPermitted();
  document.title = SERVICE_NAME;

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <h1 className="govuk-heading-l" data-testid="landing-h1">{SERVICE_NAME}</h1>
        <h2 className="govuk-heading-m">Who should use this service</h2>
        <p className="govuk-body">The NMSW service is for General Maritime commercial shipping on uncanalised international voyages.</p>
        <p className="govuk-body">Use this service to tell Border Force about your crew and passengers, each time your vessel will depart from or arrive in the UK.</p>
        <h2 className="govuk-heading-m">Before you start</h2>
        <p className="govuk-body">You can save a partially completed report. To complete a full report you’ll need:</p>
        <DownloadTemplates isLandingPage />
        <div className="govuk-inset-text">
          <p className="govuk-body">
            You do not need to submit any FAL forms that you send to other UK authorities, such as the Consolidated European Reporting System, CERS.
          </p>
        </div>
        <p className="govuk-body" data-testid="createAccountParagraph">You&apos;ll also need to sign in or <Link to={REGISTER_ACCOUNT_URL}>create an account</Link> to use this service</p>
        <Link
          to={isAuthenticated ? YOUR_VOYAGES_URL : SIGN_IN_URL}
          role="button"
          draggable="false"
          className="govuk-button govuk-button--start"
          data-module="govuk-button"
        >
          Start now
          <svg
            className="govuk-button__start-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="17.5"
            height="19"
            viewBox="0 0 33 40"
            aria-hidden="true"
            focusable="false"
          >
            <path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z" />
          </svg>
        </Link>
        <h2 className="govuk-heading-m">More help with this service</h2>
        <p className="govuk-body">
          {'If you need more support, email '}
          <a className="govuk-link" href={`mailto: ${SERVICE_CONTACT_EMAIL}`}>
            {SERVICE_CONTACT_EMAIL}
          </a>
        </p>
      </div>
    </div>
  );
};

export default Landing;
