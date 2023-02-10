import { useLocation, useNavigate } from 'react-router-dom';
import { DownloadFile } from '../../utils/DownloadFile';
import {
  SIGN_IN_URL,
  VOYAGE_GENERAL_DECLARATION_CONFIRMATION_URL,
  VOYAGE_GENERAL_DECLARATION_UPLOAD_URL,
  YOUR_VOYAGES_URL,
} from '../../constants/AppUrlConstants';
import Message from '../../components/Message';

const VoyageUploadGeneralDeclaration = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  document.title = 'Upload the General Declaration (FAL 1)';

  const handleSubmit = async () => {
    console.log('Gen Dec', state?.declarationId);
    // this will be refactored once we have the upload file component
    // for now it just takes the declaration ID and passes it to the next page

    // for testing the sign in flow returning declaration ID, adding a redirect to sign in if no token
    if (!sessionStorage.getItem('token')) {
      navigate(SIGN_IN_URL, { state: { redirectURL: VOYAGE_GENERAL_DECLARATION_UPLOAD_URL, fileType: 'General Declaration', declarationId: state?.declarationId } });
    } else {
      navigate(VOYAGE_GENERAL_DECLARATION_CONFIRMATION_URL, { state: { fileType: 'General Declaration', declarationId: state?.declarationId } });
    }
  };

  if (!state?.declarationId) {
    return (
      <Message title="Something has gone wrong" redirectURL={YOUR_VOYAGES_URL} />
    );
  }

  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <h1 className="govuk-heading-xl">Upload the General Declaration (FAL 1)</h1>
          <p className="govuk-body" data-testid="paragraph">You must use the new excel spreadsheet version of the <button className="govuk-button--text" type="button" onClick={() => DownloadFile('/assets/files/NMSW-FAL-1.xlsx', 'FAL1.xlsx')}>FAL 1 general declaration</button>.</p>
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <button
            type="button"
            className="govuk-button"
            data-module="govuk-button"
            onClick={handleSubmit}
          >
            Save and continue
          </button>
        </div>
      </div>
    </>
  );
};

export default VoyageUploadGeneralDeclaration;
