import PropTypes from 'prop-types';
import { DownloadFile } from '../utils/DownloadFile';

const DownloadTemplates = ({ isLandingPage }) => (
  <ul className="govuk-list govuk-list--bullet govuk-!-margin-bottom-7">
    <li>
      <button className="govuk-button--text text-align--left" type="button" onClick={() => DownloadFile('assets/files/General declaration (FAL 1).xlsx', 'General declaration (FAL 1).xlsx')}>General Declaration (FAL 1) template (xlsx, 31kb)</button>
    </li>
    <li>
      {isLandingPage && 'passport or other travel document details for all crew entered on a '}
      <button className="govuk-button--text text-align--left" type="button" onClick={() => DownloadFile('assets/files/Crew details (FAL 5).xlsx', 'Crew details (FAL 5).xlsx')}>Crew details (FAL 5) template (xlsx, 118kb)</button>
    </li>
    <li>
      {isLandingPage && 'passport or other travel document details for all crew entered on a '}
      <button className="govuk-button--text text-align--left" type="button" onClick={() => DownloadFile('assets/files/Passenger details including supernumeraries (FAL 6).xlsx', 'Passenger details including supernumeraries (FAL 6).xlsx')}>Passenger details including supernumeraries (FAL 6) template (xlsx, 90kb)</button>
    </li>
  </ul>
);

export default DownloadTemplates;

DownloadTemplates.propTypes = {
  isLandingPage: PropTypes.bool,
};
