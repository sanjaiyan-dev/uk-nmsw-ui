import BorderForceRegionContacts from '../../components/BorderForceRegionContacts';
import DownloadTemplates from '../../components/DownloadTemplates';
import { SERVICE_NAME } from '../../constants/AppConstants';

const SiteMaintenance = () => {
  document.title = SERVICE_NAME;

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-full">
        <h1 className="govuk-heading-xl" data-testid="landing-h1">Sorry, the service is unavailable</h1>
        <h2 className="govuk-heading-m">If you need to submit your voyage report urgently</h2>
        <p className="govuk-body">
          Send the completed forms to the Border Force team that covers the region of the UK where your vessel will arrive or depart.
        </p>
        <p className="govuk-body">Use the templates provided:</p>
        <DownloadTemplates />
        <BorderForceRegionContacts />
      </div>
    </div>
  );
};

export default SiteMaintenance;
