import { useNavigate } from 'react-router-dom';
import { VOYAGE_GENERAL_DECLARATION_CONFIRMATION_URL } from '../../constants/AppUrlConstants';

const ReportUploadGeneralDeclaration = () => {
  const navigate = useNavigate();
  document.title = 'Upload the General Declaration (FAL 1)';

  return (
    <>
      <h1 className="govuk-heading-xl">Upload the General Declaration (FAL 1)</h1>
      <button
        type="button"
        onClick={() => navigate(VOYAGE_GENERAL_DECLARATION_CONFIRMATION_URL, { state: { fileType: 'General Declaration' } })}
      >
        click
      </button>
    </>
  );
};

export default ReportUploadGeneralDeclaration;
