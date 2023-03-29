import { useSearchParams } from 'react-router-dom';
import Message from '../../components/Message';
import FileUploadForm from '../../components/FileUploadForm';
import { API_URL, ENDPOINT_DECLARATION_PATH, ENDPOINT_FILE_UPLOAD_CREW_DETAILS_PATH } from '../../constants/AppAPIConstants';
import { CREW_DETAILS_TEMPLATE_NAME } from '../../constants/AppConstants';
import {
  URL_DECLARATIONID_IDENTIFIER,
  VOYAGE_CREW_CONFIRMATION_URL,
  VOYAGE_CREW_UPLOAD_URL,
  YOUR_VOYAGES_URL,
} from '../../constants/AppUrlConstants';
import ErrorMappingFal5 from '../../constants/ErrorMappingFal5';

const VoyageCrew = () => {
  const [searchParams] = useSearchParams();
  const declarationId = searchParams.get(URL_DECLARATIONID_IDENTIFIER);
  document.title = 'Upload the crew details including supernumeraries (FAL 5)';

  if (!declarationId) {
    return (
      <Message title="Something has gone wrong" redirectURL={YOUR_VOYAGES_URL} />
    );
  }

  return (
    <FileUploadForm
      endpoint={`${API_URL}${ENDPOINT_DECLARATION_PATH}/${declarationId}${ENDPOINT_FILE_UPLOAD_CREW_DETAILS_PATH}`}
      errorMessageMapFile={ErrorMappingFal5}
      fileNameRequired={CREW_DETAILS_TEMPLATE_NAME}
      fileTypesAllowed="csv or xlsx"
      formId="uploadCrewDetails"
      pageHeading={`Upload the ${CREW_DETAILS_TEMPLATE_NAME}`}
      submitButtonLabel="Check for errors"
      urlSuccessPage={`${VOYAGE_CREW_CONFIRMATION_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`}
      urlThisPage={`${VOYAGE_CREW_UPLOAD_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`}
    />
  );
};

export default VoyageCrew;
