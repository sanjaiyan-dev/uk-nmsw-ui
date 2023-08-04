import regionMap from '../assets/images/region-map.png';
import '../assets/css/regionMap.scss';

const BorderForceRegionContacts = () => {
  const centralEmail = 'BFCentralRCCGMteam@homeoffice.gov.uk';
  const northEmail = 'NorthGeneralAviationandMaritime@homeoffice.gov.uk';
  const southEmail = 'BorderForceSouthGMteam@homeoffice.gov.uk';
  const southEastEmail = 'BorderForceSouthEastGMteam@homeoffice.gov.uk';
  return (
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
  );
};

export default BorderForceRegionContacts;
