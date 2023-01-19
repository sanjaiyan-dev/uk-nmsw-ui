import { useNavigate } from 'react-router-dom';
import { DownloadFile } from '../../utils/DownloadFile';
import { VOYAGE_GENERAL_DECLARATION_CONFIRMATION_URL } from '../../constants/AppUrlConstants';

const ReportUploadGeneralDeclaration = () => {
  const navigate = useNavigate();
  document.title = 'Upload the General Declaration (FAL 1)';

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
            onClick={() => navigate(VOYAGE_GENERAL_DECLARATION_CONFIRMATION_URL, { state: { fileType: 'General Declaration' } })}
          >
            Save and continue
          </button>
        </div>
      </div>
    </>
  );
};

export default ReportUploadGeneralDeclaration;
