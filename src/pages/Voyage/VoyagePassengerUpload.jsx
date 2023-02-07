import { useLocation, useNavigate } from 'react-router-dom';
import { VOYAGE_PASSENGER_CONFIRMATION_URL, YOUR_VOYAGES_URL } from '../../constants/AppUrlConstants';
import Message from '../../components/Message';

const VoyagePassengerUpload = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  document.title = 'Upload the passenger details (FAL 6)';

  if (!state?.declarationId) {
    return (
      <Message title="Something has gone wrong" redirectURL={YOUR_VOYAGES_URL} />
    );
  }

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
            onClick={() => navigate(VOYAGE_PASSENGER_CONFIRMATION_URL, { state: { fileType: 'Passenger details', declarationId: state?.declarationId } })}
          >
            Save and continue
          </button>
        </div>
      </div>
    </>
  );
};

export default VoyagePassengerUpload;
