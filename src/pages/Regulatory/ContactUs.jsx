import { Link } from "react-router-dom";
import { SERVICE_CONTACT_EMAIL, SERVICE_NAME } from "../../constants/AppConstants";
import { LOGGED_IN_HELP } from "../../constants/AppUrlConstants";
import Auth from "../../utils/Auth";

const HelpFooter = () => {
  document.title = 'Help';
  return (
    <>
      <h1 className="govuk-heading-xl">Contact us</h1>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <p className="govuk-body">
            {`Check the `}
            <Link className="govuk-link" to={Auth.isAuthorized() ? `${LOGGED_IN_HELP}` : `${HELP_URL}`}>help section</Link>
            {` first, to see if that will answer your query`}
          </p>
          <h2 className="govuk-heading-m">General Maritime Commercial Ship reporting</h2>
          <p>
            {`You can get help from the support team for the ${SERVICE_NAME} (NMSW): `}
            <a className="govuk-link" href={`mailto: ${SERVICE_CONTACT_EMAIL}`}>{SERVICE_CONTACT_EMAIL}</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default HelpFooter;
