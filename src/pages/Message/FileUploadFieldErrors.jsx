import { useLocation, useNavigate } from 'react-router-dom';
import { YOUR_VOYAGES_URL } from '../../constants/AppUrlConstants';
import '../../assets/css/fileUploadFieldErrors.scss';

const FileUploadFieldErrors = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const returnURL = state?.returnURL ? state.returnURL : YOUR_VOYAGES_URL; // if missing return URL return user to your voyages page as a default
  const errorStatement = `${state?.errorList ? state.errorList.length : ''} errors found ${state?.fileName ? `in ${state.fileName}` : ''}`;

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <h1 className="govuk-heading-xl govuk-!-margin-bottom-3">Errors found</h1>
        <p className="govuk-body-l govuk-!-font-weight-bold">Your file has errors. Check the file to fix any errors and re-upload your file.</p>
        <div className="govuk-form-group--error">
          <table className="govuk-table">
            <caption className="govuk-table__caption govuk-table__caption--s govuk-border-bottom">{errorStatement}</caption>
            <thead className="govuk-table__head">
              <tr className="govuk-table__row" role="row">
                <th scope="col" className="govuk-table__header govuk-!-width-one-third">Cell number</th>
                <th scope="col" className="govuk-table__header">Error</th>
              </tr>
            </thead>
            <tbody className="govuk-table__body">
              {state?.errorList?.map((error) => (
                <tr key={error.cell} className="govuk-table__row" role="row">
                  <td className="govuk-table__cell govuk-table__cell--bold">
                    <span className="responsive-table__heading" aria-hidden="true">
                      Cell number
                    </span>
                    {error.cell}
                  </td>
                  <td className="govuk-table__cell">
                    <span className="responsive-table__heading" aria-hidden="true">
                      Error
                    </span>
                    <div className="text-align-right">
                      <span className="govuk-error-message govuk-inline">{error.message}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          className="govuk-button"
          data-module="govuk-button"
          type="button"
          onClick={() => navigate(returnURL)}
        >
          Re-upload file
        </button>
      </div>
    </div>
  );
};

export default FileUploadFieldErrors;
