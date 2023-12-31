import { SERVICE_CONTACT_EMAIL, SERVICE_NAME, UPT_CONTACT_EMAIL } from '../../constants/AppConstants';
import DownloadTemplates from '../../components/DownloadTemplates';
import BorderForceRegionContacts from '../../components/BorderForceRegionContacts';

const Help = () => {
  document.title = 'Help';
  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <h1 className="govuk-heading-xl">{`Help and support for the ${SERVICE_NAME}`}</h1>
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <div className="govuk-inset-text govuk-!-margin-top-0">
            <p className="govuk-body">
              {'For support with providing the correct information to Border Force, email: '}
              <a className="govuk-link" href={`mailto: ${SERVICE_CONTACT_EMAIL}`}>
                {SERVICE_CONTACT_EMAIL}
              </a>
            </p>
            <p className="govuk-body">
              {'For support with passenger permission to travel status, email:  '}
              <a className="govuk-link" href={`mailto: ${UPT_CONTACT_EMAIL}`}>
                {UPT_CONTACT_EMAIL}
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-three-quarters">
          <h2 className="govuk-heading-m">Send FAL forms by email</h2>
          <p className="govuk-body">If you cannot sign into the NMSW service, you can still submit the required forms using email.</p>
          <p className="govuk-body">Use the templates provided:</p>
          <DownloadTemplates />
          <p className="govuk-body">Send the completed forms to the Border Force team that covers the region of the UK where your vessel will arrive or depart.</p>
        </div>
      </div>
      <BorderForceRegionContacts />
    </>
  );
};

export default Help;
