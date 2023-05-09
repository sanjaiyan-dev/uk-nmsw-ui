import DownloadTemplates from '../../components/DownloadTemplates';
import { SERVICE_NAME } from '../../constants/AppConstants';

const Templates = () => {
  document.title = SERVICE_NAME;
  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <h1 className="govuk-heading-xl">Templates</h1>
        <p className="govuk-body">Use the templates provided:</p>
        <DownloadTemplates />
        <details className="govuk-details" data-module="govuk-details">
          <summary className="govuk-details__summary">
            <span className="govuk-details__summary-text">
              What about other templates?
            </span>
          </summary>
          <div className="govuk-details__text">
            These templates replace the old NMSW templates for FAL 1 and FAL 5&amp;6. Other templates for these FAL forms such as the IMO Word documents will not work on the new service.
          </div>
        </details>
      </div>
    </div>
  );
};

export default Templates;
