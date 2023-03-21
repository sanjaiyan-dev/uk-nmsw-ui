import { useParams } from 'react-router-dom';
import Message from '../../components/Message';
import FileUploadForm from '../../components/FileUploadForm';
import { API_URL, ENDPOINT_DECLARATION_PATH, ENDPOINT_FILE_UPLOAD_PASSENGER_DETAILS_PATH } from '../../constants/AppAPIConstants';
import { PASSENGER_DETAILS_TEMPLATE_NAME } from '../../constants/AppConstants';
import { VOYAGE_PASSENGER_CONFIRMATION_URL, VOYAGE_PASSENGER_UPLOAD_URL, YOUR_VOYAGES_URL } from '../../constants/AppUrlConstants';

const VoyagePassengerUpload = () => {
  const { declarationId } = useParams();
  document.title = 'Upload the passenger details (FAL 6)';

  if (!declarationId) {
    return (
      <Message title="Something has gone wrong" redirectURL={YOUR_VOYAGES_URL} />
    );
  }

  return (
    <FileUploadForm
      endpoint={`${API_URL}${ENDPOINT_DECLARATION_PATH}/${declarationId}${ENDPOINT_FILE_UPLOAD_PASSENGER_DETAILS_PATH}`}
      // errorMessageMapFile={}
      fileNameRequired={PASSENGER_DETAILS_TEMPLATE_NAME}
      fileTypesAllowed="csv or xlsx"
      formId="uploadPassengerDetails"
      pageHeading={`Upload the ${PASSENGER_DETAILS_TEMPLATE_NAME}`}
      submitButtonLabel="Check for errors"
      urlSuccessPage={`${VOYAGE_PASSENGER_CONFIRMATION_URL}/${declarationId}`}
      urlThisPage={`${VOYAGE_PASSENGER_UPLOAD_URL}/${declarationId}`}
    />
  );
};

export default VoyagePassengerUpload;
