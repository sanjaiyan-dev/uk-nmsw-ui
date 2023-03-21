import { useParams } from 'react-router-dom';
import Message from '../../components/Message';
import MultiFileUploadForm from '../../components/MultiFileUploadForm';
import { API_URL, ENDPOINT_DECLARATION_PATH, ENDPOINT_FILE_UPLOAD_GENERAL_DECLARATION_PATH } from '../../constants/AppAPIConstants';
import { VOYAGE_SUPPORTING_DOCS_UPLOAD_URL, VOYAGE_TASK_LIST_URL, YOUR_VOYAGES_URL } from '../../constants/AppUrlConstants';

const VoyageSupportingDocsUpload = () => {
  const { declarationId } = useParams();
  document.title = 'Upload any supporting documents';

  if (!declarationId) {
    return (
      <Message title="Something has gone wrong" redirectURL={YOUR_VOYAGES_URL} />
    );
  }
  return (
    <MultiFileUploadForm
      endpoint={`${API_URL}${ENDPOINT_DECLARATION_PATH}/${declarationId}${ENDPOINT_FILE_UPLOAD_GENERAL_DECLARATION_PATH}`}
      pageHeading="Upload supporting documents"
      submitButtonLabel="Save and continue"
      urlNextPage={`${VOYAGE_TASK_LIST_URL}/${declarationId}`}
      urlThisPage={`${VOYAGE_SUPPORTING_DOCS_UPLOAD_URL}/${declarationId}`}
    />
  );
};

export default VoyageSupportingDocsUpload;
