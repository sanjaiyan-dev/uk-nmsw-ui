import { useSearchParams } from 'react-router-dom';
import Message from '../../components/Message';
import MultiFileUploadForm from '../../components/MultiFileUploadForm';
import { API_URL, ENDPOINT_DECLARATION_PATH, ENDPOINT_FILE_UPLOAD_SUPPORTING_DOCUMENTS_PATH } from '../../constants/AppAPIConstants';
import {
  URL_DECLARATIONID_IDENTIFIER,
  VOYAGE_SUPPORTING_DOCS_UPLOAD_URL,
  VOYAGE_TASK_LIST_URL,
  YOUR_VOYAGES_URL,
} from '../../constants/AppUrlConstants';

const VoyageSupportingDocsUpload = () => {
  const [searchParams] = useSearchParams();
  const declarationId = searchParams.get(URL_DECLARATIONID_IDENTIFIER);
  document.title = 'Upload any supporting documents';

  if (!declarationId) {
    return (
      <Message title="Something has gone wrong" redirectURL={YOUR_VOYAGES_URL} />
    );
  }
  return (
    <MultiFileUploadForm
      endpoint={`${API_URL}${ENDPOINT_DECLARATION_PATH}/${declarationId}${ENDPOINT_FILE_UPLOAD_SUPPORTING_DOCUMENTS_PATH}`}
      pageHeading="Upload supporting documents"
      submitButtonLabel="Save and continue"
      urlNextPage={`${VOYAGE_TASK_LIST_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`}
      urlThisPage={`${VOYAGE_SUPPORTING_DOCS_UPLOAD_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`}
    />
  );
};

export default VoyageSupportingDocsUpload;
