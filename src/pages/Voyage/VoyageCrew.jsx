import { useNavigate } from 'react-router-dom';
import { VOYAGE_CREW_CONFIRMATION_URL } from '../../constants/AppUrlConstants';

const VoyageCrew = () => {
  const navigate = useNavigate();
  document.title = 'Upload the crew details including supernumeraries (FAL 5)';

  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <h1 className="govuk-heading-xl">Upload the crew details including supernumeraries (FAL 5)</h1>
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <button
            type="button"
            className="govuk-button"
            data-module="govuk-button"
            onClick={() => navigate(VOYAGE_CREW_CONFIRMATION_URL, { state: { fileType: 'Crew details' } })}
          >
            Save and continue
          </button>
        </div>
      </div>
    </>
  );
};

export default VoyageCrew;
