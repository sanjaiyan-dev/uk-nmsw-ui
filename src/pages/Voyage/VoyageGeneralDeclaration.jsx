import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DownloadFile } from '../../utils/DownloadFile';
import {
  MESSAGE_URL, SIGN_IN_URL, VOYAGE_GENERAL_DECLARATION_CONFIRMATION_URL, VOYAGE_GENERAL_DECLARATION_UPLOAD_URL, YOUR_VOYAGES_URL,
} from '../../constants/AppUrlConstants';
import { TOKEN_INVALID } from '../../constants/AppAPIConstants';

const VoyageUploadGeneralDeclaration = () => {
  const navigate = useNavigate();
  document.title = 'Upload the General Declaration (FAL 1)';

  const declarationId = '123';

  const handleSubmit = async () => {
    try {
      const response = await axios.post('SOME-END-POINT');
      // TODO: set correct response when BE is ready
      if (response.status === 200) {
        navigate(VOYAGE_GENERAL_DECLARATION_CONFIRMATION_URL, { state: { fileType: 'General Declaration' } });
      }
    } catch (err) {
      if (err?.response?.data?.message === TOKEN_INVALID) {
        navigate(SIGN_IN_URL, { state: { declarationID: declarationId, redirectURL: VOYAGE_GENERAL_DECLARATION_UPLOAD_URL } });
      } else {
        navigate(MESSAGE_URL, { state: { title: 'Something has gone wrong', message: err.response?.data?.message, redirectURL: YOUR_VOYAGES_URL } });
      }
    }
  };

  // TODO: If state?.declarationId then set declarationId somewhere

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
          <hr />
          <button
            type="button"
            className="govuk-button"
            data-module="govuk-button"
            onClick={() => navigate(VOYAGE_GENERAL_DECLARATION_CONFIRMATION_URL, { state: { fileType: 'General Declaration' } })}
          >
            Bypass fake API call
          </button>
        </div>
      </div>
    </>
  );
};

export default VoyageUploadGeneralDeclaration;
