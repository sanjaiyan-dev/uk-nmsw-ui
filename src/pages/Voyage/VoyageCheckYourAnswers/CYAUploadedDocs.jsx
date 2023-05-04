import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { DECLARATION_STATUS_DRAFT } from '../../../constants/AppConstants';
import { URL_DECLARATIONID_IDENTIFIER, VOYAGE_SUPPORTING_DOCS_UPLOAD_URL } from '../../../constants/AppUrlConstants';

const CYAUploadedDocs = ({
  declarationId,
  declarationStatus,
  supportingDocs,
  uploadedFalDocuments,
}) => {
  console.log('sd', uploadedFalDocuments);

  return (
    <dl className="govuk-summary-list govuk-!-margin-bottom-9">
      {uploadedFalDocuments.map((item) => (
        <div key={item.id} className="govuk-summary-list__row">
          <dt id={item.id} className="govuk-summary-list__key">
            {item.title}
          </dt>
          <dd className="govuk-summary-list__value">
            {item.fileLink ? <a className="govuk-link" href={item.fileLink} download>{item.value}</a> : item.noFileText}
          </dd>
          <dd className="govuk-summary-list__actions">
            {declarationStatus?.status === DECLARATION_STATUS_DRAFT
              && (
                <Link
                  className="govuk-link"
                  to={item.changeLink}
                  aria-describedby={item.id}
                >
                  Change<span className="govuk-visually-hidden">{` change ${item.title}`}</span>
                </Link>
              )}
          </dd>
        </div>
      ))}

      <div className="govuk-summary-list__row">
        <dt id="supportingDocuments" className="govuk-summary-list__key">
          Supporting documents
        </dt>
        <dd className="govuk-summary-list__value">
          {supportingDocs.length < 1 && <span>No supporting documents provided</span>}
          {
            supportingDocs.length > 0 && supportingDocs.map((doc) => (
              <div key={doc.id}>
                <a className="govuk-link" href={doc.url} download>{doc.filename}</a>
              </div>
            ))
          }
        </dd>
        <dd className="govuk-summary-list__actions">
          {declarationStatus?.status === DECLARATION_STATUS_DRAFT
            && (
              <Link
                className="govuk-link"
                to={`${VOYAGE_SUPPORTING_DOCS_UPLOAD_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`}
                aria-describedby="supportingDocuments"
              >
                Change<span className="govuk-visually-hidden">{' change Supporting documents'}</span>
              </Link>
            )}
        </dd>
      </div>
    </dl>
  );
};

export default CYAUploadedDocs;

CYAUploadedDocs.propTypes = {
  declarationId: PropTypes.string.isRequired,
  declarationStatus: PropTypes.shape({
    status: PropTypes.string.isRequired,
    submissionDate: PropTypes.string,
  }).isRequired,
  supportingDocs: PropTypes.array.isRequired,
  uploadedFalDocuments: PropTypes.array.isRequired,
};
