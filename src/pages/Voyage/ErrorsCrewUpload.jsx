import { useEffect, useState } from 'react';

// const errors1 = [
//   { id: '1', cell: 'C4', cellValue: 'M@ry', errorMessage: 'No special characters' }
// ];

// const errors5 = [
//   { id: '1', cell: 'C4', cellValue: 'M@ry', errorMessage: 'No special characters' },
//   { id: '2', cell: 'B4', cellValue: '12/31/1991 ', errorMessage: 'Date of birth must be in dd/mm/yyyy format' },
//   { id: '3', cell: 'F12', cellValue: 'INDIA', errorMessage: 'These cells have an invalid country code' },
//   { id: '4', cell: 'D6', cellValue: 'rsdfsdfsdf', errorMessage: 'is not a valid document type' },
//   { id: '5', cell: 'C4', cellValue: 'M@ry', errorMessage: 'No special characters' },
// ];

const errors50 = [
  {
    id: '1', cell: 'C4', cellValue: 'M@ry', errorMessage: 'No special characters',
  },
  {
    id: '2', cell: 'B4', cellValue: '12/31/1991 ', errorMessage: 'Date of birth must be in dd/mm/yyyy format',
  },
  {
    id: '3', cell: 'F12', cellValue: 'INDIA', errorMessage: 'These cells have an invalid country code',
  },
  {
    id: '4', cell: 'D6', cellValue: 'rsdfsdfsdf', errorMessage: 'is not a valid document type',
  },
  {
    id: '5', cell: 'C4', cellValue: 'M@ry', errorMessage: 'No special characters',
  },
  {
    id: '6', cell: 'B4', cellValue: '12/31/1991 ', errorMessage: 'Date of birth must be in dd/mm/yyyy format',
  },
  {
    id: '7', cell: 'F12', cellValue: 'INDIA', errorMessage: 'These cells have an invalid country code',
  },
  {
    id: '8', cell: 'D6', cellValue: 'rsdfsdfsdf', errorMessage: 'is not a valid document type',
  },
  {
    id: '9', cell: 'C4', cellValue: 'M@ry', errorMessage: 'No special characters',
  },
  {
    id: '10', cell: 'B4', cellValue: '12/31/1991 ', errorMessage: 'Date of birth must be in dd/mm/yyyy format',
  },
  {
    id: '11', cell: 'F12', cellValue: 'INDIA', errorMessage: 'These cells have an invalid country code',
  },
  {
    id: '12', cell: 'D6', cellValue: 'rsdfsdfsdf', errorMessage: 'is not a valid document type',
  },
  {
    id: '13', cell: 'C4', cellValue: 'M@ry', errorMessage: 'No special characters',
  },
  {
    id: '14', cell: 'B4', cellValue: '12/31/1991 ', errorMessage: 'Date of birth must be in dd/mm/yyyy format',
  },
  {
    id: '15', cell: 'F12', cellValue: 'INDIA', errorMessage: 'These cells have an invalid country code',
  },
  {
    id: '16', cell: 'D6', cellValue: 'rsdfsdfsdf', errorMessage: 'is not a valid document type',
  },
  {
    id: '17', cell: 'C4', cellValue: 'M@ry', errorMessage: 'No special characters',
  },
  {
    id: '18', cell: 'B4', cellValue: '12/31/1991 ', errorMessage: 'Date of birth must be in dd/mm/yyyy format',
  },
  {
    id: '19', cell: 'F12', cellValue: 'INDIA', errorMessage: 'These cells have an invalid country code',
  },
  {
    id: '20', cell: 'D6', cellValue: 'rsdfsdfsdf', errorMessage: 'is not a valid document type',
  },
  {
    id: '21', cell: 'C4', cellValue: 'M@ry', errorMessage: 'No special characters',
  },
  {
    id: '22', cell: 'B4', cellValue: '12/31/1991 ', errorMessage: 'Date of birth must be in dd/mm/yyyy format',
  },
  {
    id: '23', cell: 'F12', cellValue: 'INDIA', errorMessage: 'These cells have an invalid country code',
  },
  {
    id: '24', cell: 'D6', cellValue: 'rsdfsdfsdf', errorMessage: 'is not a valid document type',
  },
  {
    id: '25', cell: 'C4', cellValue: 'M@ry', errorMessage: 'No special characters',
  },
  {
    id: '26', cell: 'B4', cellValue: '12/31/1991 ', errorMessage: 'Date of birth must be in dd/mm/yyyy format',
  },
  {
    id: '27', cell: 'F12', cellValue: 'INDIA', errorMessage: 'These cells have an invalid country code',
  },
  {
    id: '28', cell: 'D6', cellValue: 'rsdfsdfsdf', errorMessage: 'is not a valid document type',
  },
  {
    id: '29', cell: 'C4', cellValue: 'M@ry', errorMessage: 'No special characters',
  },
  {
    id: '30', cell: 'B4', cellValue: '12/31/1991 ', errorMessage: 'Date of birth must be in dd/mm/yyyy format',
  },
  {
    id: '31', cell: 'F12', cellValue: 'INDIA', errorMessage: 'These cells have an invalid country code',
  },
  {
    id: '32', cell: 'D6', cellValue: 'rsdfsdfsdf', errorMessage: 'is not a valid document type',
  },
  {
    id: '33', cell: 'C4', cellValue: 'M@ry', errorMessage: 'No special characters',
  },
  {
    id: '34', cell: 'B4', cellValue: '12/31/1991 ', errorMessage: 'Date of birth must be in dd/mm/yyyy format',
  },
  {
    id: '35', cell: 'F12', cellValue: 'INDIA', errorMessage: 'These cells have an invalid country code',
  },
  {
    id: '36', cell: 'D6', cellValue: 'rsdfsdfsdf', errorMessage: 'is not a valid document type',
  },
  {
    id: '37', cell: 'C4', cellValue: 'M@ry', errorMessage: 'No special characters',
  },
  {
    id: '38', cell: 'B4', cellValue: '12/31/1991 ', errorMessage: 'Date of birth must be in dd/mm/yyyy format',
  },
  {
    id: '39', cell: 'F12', cellValue: 'INDIA', errorMessage: 'These cells have an invalid country code',
  },
  {
    id: '40', cell: 'D6', cellValue: 'rsdfsdfsdf', errorMessage: 'is not a valid document type',
  },
  {
    id: '41', cell: 'C4', cellValue: 'M@ry', errorMessage: 'No special characters',
  },
  {
    id: '42', cell: 'B4', cellValue: '12/31/1991 ', errorMessage: 'Date of birth must be in dd/mm/yyyy format',
  },
  {
    id: '43', cell: 'F12', cellValue: 'INDIA', errorMessage: 'These cells have an invalid country code',
  },
  {
    id: '44', cell: 'D6', cellValue: 'rsdfsdfsdf', errorMessage: 'is not a valid document type',
  },
  {
    id: '45', cell: 'C4', cellValue: 'M@ry', errorMessage: 'No special characters',
  },
  {
    id: '46', cell: 'B4', cellValue: '12/31/1991 ', errorMessage: 'Date of birth must be in dd/mm/yyyy format',
  },
  {
    id: '47', cell: 'F12', cellValue: 'INDIA', errorMessage: 'These cells have an invalid country code',
  },
  {
    id: '48', cell: 'D6', cellValue: 'rsdfsdfsdf', errorMessage: 'is not a valid document type',
  },
  {
    id: '49', cell: 'C4', cellValue: 'M@ry', errorMessage: 'No special characters',
  },
  {
    id: '50', cell: 'B4', cellValue: '12/31/1991 ', errorMessage: 'Date of birth must be in dd/mm/yyyy format',
  },
];

const ErrorsCrewUpload = () => {
  const [uploadErrors, setUploadErrors] = useState();
  const fileName = 'CrewDetails.xls';

  const getUploadErrors = () => {
    setUploadErrors(errors50);
  };

  useEffect(() => {
    getUploadErrors();
  }, []);

  // NOTE: add roles to rows and cells

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <h1 className="govuk-heading-xl govuk-!-margin-bottom-3">Errors found</h1>
        <p className="govuk-body-l govuk-!-font-weight-bold">Your file has errors. Check the file to fix any errors and re-upload your file.</p>
        <div className="govuk-form-group--error">
          <table className="govuk-table">
            <caption className="govuk-table__caption govuk-table__caption--s govuk-border-bottom">{`${uploadErrors?.length} errors found in ${fileName}`}</caption>
            <thead className="govuk-table__head">
              <tr className="govuk-table__row" role="row">
                <th scope="col" className="govuk-table__header govuk-!-width-one-third">Cell number</th>
                <th scope="col" className="govuk-table__header">Error</th>
              </tr>
            </thead>
            <tbody className="govuk-table__body">
              {uploadErrors?.map((error) => (
                <tr key={error.id} className="govuk-table__row" role="row">
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
                      {`${error.cellValue} - `}
                      <span className="govuk-error-message govuk-inline">{error.errorMessage}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="govuk-button" data-module="govuk-button" type="button">
          Re-upload file
        </button>
      </div>
    </div>
  );
};

export default ErrorsCrewUpload;
