import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { DECLARATION_STATUS_DRAFT } from '../../../constants/AppConstants';
import {
  URL_DECLARATIONID_IDENTIFIER,
  VOYAGE_CREW_UPLOAD_URL,
  VOYAGE_PASSENGERS_URL,
  VOYAGE_SUPPORTING_DOCS_UPLOAD_URL,
} from '../../../constants/AppUrlConstants';

const CYAUploadedDocs = ({
  declarationId,
  declarationStatus,
  fal5Details,
  fal6Details,
  supportingDocs,
}) => {
  const uploadedFalDocuments = [
    {
      id: 'crewDetails',
      title: 'Crew details',
      value: fal5Details?.filename ? fal5Details?.filename : '',
      fileLink: fal5Details?.url ? fal5Details?.url : '',
      changeLink: `${VOYAGE_CREW_UPLOAD_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`,
    },
    {
      id: 'passengerDetails',
      title: 'Passenger details including supernumeraries',
      value: fal6Details?.filename ? fal6Details?.filename : '',
      fileLink: fal6Details?.url ? fal6Details?.url : '',
      changeLink: `${VOYAGE_PASSENGERS_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`,
      noFileText: 'No passenger details including supernumeraries provided',
    },
  ];

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
    status: PropTypes.string,
    submissionDate: PropTypes.string,
  }).isRequired,
  fal5Details: PropTypes.shape({
    filename: PropTypes.string,
    url: PropTypes.string,
  }),
  fal6Details: PropTypes.shape({
    filename: PropTypes.string,
    url: PropTypes.string,
  }),
  supportingDocs: PropTypes.array,
};
