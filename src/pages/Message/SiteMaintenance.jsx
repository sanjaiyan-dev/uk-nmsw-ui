import { SERVICE_NAME } from '../../constants/AppConstants';

const SiteMaintenance = () => {
  document.title = SERVICE_NAME;

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <h1 className="govuk-heading-xl" data-testid="landing-h1">{SERVICE_NAME}</h1>
      </div>
    </div>
  );
};

export default SiteMaintenance;
