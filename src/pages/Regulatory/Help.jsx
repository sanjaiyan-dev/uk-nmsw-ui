import { SERVICE_CONTACT_EMAIL, SERVICE_NAME } from '../../constants/AppConstants';
import { DownloadFile } from '../../utils/DownloadFile';
import regionMap from '../../assets/images/region-map.png';

const Help = () => {
  const centralEmail = 'BFCentralRCCGMteam@homeoffice.gov.uk';
  const northEmail = 'NorthGeneralAviationandMaritime@homeoffice.gov.uk';
  const southEmail = 'BorderForceSouthGMteam@homeoffice.gov.uk';
  const southEastEmail = 'BorderForceSouthEastGMteam@homeoffice.gov.uk';
  document.title = 'Help';
  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <h1 className="govuk-heading-xl">{`Help and support for the ${SERVICE_NAME}`}</h1>
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <div className="govuk-inset-text govuk-!-margin-top-0">
            {'For support for commercial shipping with providing the correct information to Border Force, email: '}
            <a className="govuk-link" href={`mailto: ${SERVICE_CONTACT_EMAIL}`}>
              {SERVICE_CONTACT_EMAIL}
            </a>
          </div>
          <h2 className="govuk-heading-m">Send FAL forms by email</h2>
          <p className="govuk-body">If you cannot sign into the NMSW service, you can still submit the required forms using email.</p>
          <p className="govuk-body">Use the templates provided:</p>
          <ul className="govuk-list govuk-list--bullet govuk-!-margin-bottom-7">
            <li>
              <button className="govuk-button--text text-align--left" type="button" onClick={() => DownloadFile('assets/files/General declaration FAL 1.xlsx', 'General declaration FAL 1.xlsx')}>General Declaration (FAL 1) template (xlsx, 31kb)</button>
            </li>
            <li>
              <button className="govuk-button--text text-align--left" type="button" onClick={() => DownloadFile('assets/files/Crew details including supernumeraries FAL 5.xlsx', 'Crew details including supernumeraries FAL 5.xlsx')}>Crew details including supernumeraries (FAL 5) template (xlsx, 118kb)</button>
            </li>
            <li>
              <button className="govuk-button--text text-align--left" type="button" onClick={() => DownloadFile('assets/files/Passenger details FAL 6.xlsx', 'Passenger details FAL 6.xlsx')}>Passenger details (FAL 6) template (xlsx, 90kb)</button>
            </li>
          </ul>
          <p className="govuk-body">Send the completed forms to the Border Force team that covers the region of the UK where your vessel will arrive or depart.</p>
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-half">
          <h2 className="govuk-heading-s">Central region</h2>
          <p className="govuk-body">
            <a className="govuk-link" href={`mailto: ${centralEmail}`}>{centralEmail}</a>
          </p>
          <h2 className="govuk-heading-s">North region</h2>
          <p className="govuk-body">
            <a className="govuk-link" href={`mailto: ${northEmail}`}>{northEmail}</a>
          </p>
          <h2 className="govuk-heading-s">South region</h2>
          <p className="govuk-body">
            <a className="govuk-link" href={`mailto: ${southEmail}`}>{southEmail}</a>
          </p>
          <h2 className="govuk-heading-s">South East region</h2>
          <p className="govuk-body">
            <a className="govuk-link" href={`mailto: ${southEastEmail}`}>{southEastEmail}</a>
          </p>
        </div>
        <div className="govuk-grid-column-one-half">
          <img className="region-map" src={regionMap} alt="Colour coded map of the UK showing the different region boundaries" />
        </div>
      </div>
    </>
  );
};

export default Help;
