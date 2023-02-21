import { useLocation } from 'react-router-dom';
import { DownloadFile } from '../../utils/DownloadFile';
import {
  API_URL,
  ENDPOINT_DECLARATION_PATH,
  ENDPOINT_FILE_UPLOAD_GENERAL_DECLARATION_PATH,
} from '../../constants/AppAPIConstants';
import {
  VOYAGE_GENERAL_DECLARATION_CONFIRMATION_URL,
  VOYAGE_GENERAL_DECLARATION_UPLOAD_URL,
  YOUR_VOYAGES_URL,
} from '../../constants/AppUrlConstants';
import FileUploadForm from '../../components/FileUploadForm';
import Message from '../../components/Message';

const SupportingText = () => (
  <p className="govuk-body" data-testid="paragraph">You must use the new excel spreadsheet version of the <button className="govuk-button--text" type="button" onClick={() => DownloadFile('/assets/files/NMSW-FAL-1.xlsx', 'FAL1.xlsx')}>FAL 1 general declaration</button>.</p>
);

const VoyageUploadGeneralDeclaration = () => {
  const { state } = useLocation();
  document.title = 'Upload the General Declaration (FAL 1)';

  if (!state?.declarationId) {
    return (
      <Message title="Something has gone wrong" redirectURL={YOUR_VOYAGES_URL} />
    );
  }

  return (
    <FileUploadForm
      declarationId={state?.declarationId}
      endpoint={`${API_URL}${ENDPOINT_DECLARATION_PATH}/${state?.declarationId}${ENDPOINT_FILE_UPLOAD_GENERAL_DECLARATION_PATH}`}
      fileNameRequired="FAL 1 - General Declaration"
      fileTypesAllowed="csv or xlsx"
      formId="uploadGeneralDeclaration"
      pageHeading="Upload the General Declaration (FAL 1)"
      submitButtonLabel="Check for errors"
      urlSuccessPage={VOYAGE_GENERAL_DECLARATION_CONFIRMATION_URL}
      urlThisPage={VOYAGE_GENERAL_DECLARATION_UPLOAD_URL}
    >
      <SupportingText />
    </FileUploadForm>
  );
};

export default VoyageUploadGeneralDeclaration;
