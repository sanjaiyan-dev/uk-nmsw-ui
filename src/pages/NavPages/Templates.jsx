import { SERVICE_NAME } from '../../constants/AppConstants';
import { DownloadFile } from '../../utils/DownloadFile';

const Templates = () => {
  document.title = SERVICE_NAME;
  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <h1 className="govuk-heading-xl">Templates</h1>
        <p className="govuk-body">Use the templates provided:</p>
        <ul className="govuk-list govuk-list--bullet govuk-!-margin-bottom-7">
          <li>
            <button className="govuk-button--text" type="button" onClick={() => DownloadFile('assets/files/General declaration FAL 1.xlsx', 'General declaration FAL 1.xlsx')}>General Declaration (FAL 1) template (xlsx, 31kb)</button>
          </li>
          <li>
            <button className="govuk-button--text" type="button" onClick={() => DownloadFile('assets/files/Crew details including supernumeraries FAL 5.xlsx', 'Crew details including supernumeraries FAL 5.xlsx')}>Crew details including supernumeraries (FAL 5) template (xlsx, 118kb)</button>
          </li>
          <li>
            <button className="govuk-button--text" type="button" onClick={() => DownloadFile('assets/files/Passenger details FAL 6.xlsx', 'Passenger details FAL 6.xlsx')}>Passenger details (FAL 6) template (xlsx, 90kb)</button>
          </li>
        </ul>
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
