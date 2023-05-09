import { DownloadFile } from '../utils/DownloadFile';

const DownloadTemplates = () => (
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
);

export default DownloadTemplates;
