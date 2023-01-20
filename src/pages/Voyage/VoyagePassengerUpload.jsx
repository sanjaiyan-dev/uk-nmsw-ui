import { useNavigate } from 'react-router-dom';
import { VOYAGE_PASSENGER_CONFIRMATION_URL } from '../../constants/AppUrlConstants';

const VoyagePassengerUpload = () => {
  const navigate = useNavigate();
  document.title = 'Upload the passenger details (FAL 6)';

  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <h1 className="govuk-heading-xl">Upload the passenger details (FAL 6)</h1>
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <button
            type="button"
            className="govuk-button"
            data-module="govuk-button"
            onClick={() => navigate(VOYAGE_PASSENGER_CONFIRMATION_URL, { state: { fileType: 'Passenger details' } })}
          >
            Save and continue
          </button>
        </div>
      </div>
    </>
  );
};

export default VoyagePassengerUpload;
