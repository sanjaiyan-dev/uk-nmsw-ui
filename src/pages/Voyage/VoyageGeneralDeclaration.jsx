import { useSearchParams } from 'react-router-dom';
import FileUploadForm from '../../components/FileUploadForm';
import Message from '../../components/Message';
import { API_URL, ENDPOINT_DECLARATION_PATH, ENDPOINT_FILE_UPLOAD_GENERAL_DECLARATION_PATH } from '../../constants/AppAPIConstants';
import { GENERAL_DECLARATION_TEMPLATE_NAME } from '../../constants/AppConstants';
import {
  URL_DECLARATIONID_IDENTIFIER,
  VOYAGE_GENERAL_DECLARATION_CONFIRMATION_URL,
  VOYAGE_GENERAL_DECLARATION_UPLOAD_URL,
  YOUR_VOYAGES_URL,
} from '../../constants/AppUrlConstants';
import ErrorMappingFal1 from '../../constants/ErrorMappingFal1';
import { DownloadFile } from '../../utils/DownloadFile';

const SupportingText = () => (
  <p className="govuk-body" data-testid="paragraph">You must use the <button className="govuk-button--text" type="button" onClick={() => DownloadFile('/assets/files/General declaration FAL 1.xlsx', 'General declaration FAL 1.xlsx')}>General Declaration (FAL 1) template</button> to submit a report to NMSW.</p>
);

const VoyageUploadGeneralDeclaration = () => {
  const [searchParams] = useSearchParams();
  const declarationId = searchParams.get(URL_DECLARATIONID_IDENTIFIER);
  document.title = `Upload the ${GENERAL_DECLARATION_TEMPLATE_NAME}`;

  if (!declarationId) {
    return (
      <Message title="Something has gone wrong" redirectURL={YOUR_VOYAGES_URL} />
    );
  }

  return (
    <FileUploadForm
      endpoint={`${API_URL}${ENDPOINT_DECLARATION_PATH}/${declarationId}${ENDPOINT_FILE_UPLOAD_GENERAL_DECLARATION_PATH}`}
      errorMessageMapFile={ErrorMappingFal1}
      fileNameRequired={GENERAL_DECLARATION_TEMPLATE_NAME}
      fileTypesAllowed="csv or xlsx"
      formId="uploadGeneralDeclaration"
      pageHeading={`Upload the ${GENERAL_DECLARATION_TEMPLATE_NAME}`}
      submitButtonLabel="Check for errors"
      urlSuccessPage={`${VOYAGE_GENERAL_DECLARATION_CONFIRMATION_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`}
      urlThisPage={`${VOYAGE_GENERAL_DECLARATION_UPLOAD_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`}
    >
      <SupportingText />
    </FileUploadForm>
  );
};

export default VoyageUploadGeneralDeclaration;
