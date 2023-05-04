import React from 'react';
import { Link } from 'react-router-dom';
import { DECLARATION_STATUS_DRAFT } from '../../../constants/AppConstants';
import { URL_DECLARATIONID_IDENTIFIER, VOYAGE_GENERAL_DECLARATION_UPLOAD_URL } from '../../../constants/AppUrlConstants';
import StatusTag from '../../../components/StatusTag';

const CYAGeneralDeclaration = ({ declarationId, declarationStatus, voyageDetails }) => {
  console.log('gendec');

  return (
    <dl className="govuk-summary-list govuk-!-margin-bottom-9">
      <div className="govuk-summary-list__row">
        <dt className="govuk-summary-list__key">
          <h2 id="voyageDetails" className="govuk-heading-m">Voyage details</h2>
        </dt>
        <dd className="govuk-summary-list__value" />
        <dd className="govuk-summary-list__actions">
          {declarationStatus?.status === DECLARATION_STATUS_DRAFT
            && (
              <Link
                className="govuk-link"
                to={`${VOYAGE_GENERAL_DECLARATION_UPLOAD_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`}
                aria-describedby="voyageDetails"
              >
                Change<span className="govuk-visually-hidden"> change voyage details</span>
              </Link>
            )}
        </dd>
      </div>

      {declarationStatus?.status !== DECLARATION_STATUS_DRAFT
        && (
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">
              Status
            </dt>
            <dd className="govuk-summary-list__value">
              <StatusTag status={declarationStatus?.status} /> {declarationStatus?.submissionDate}
            </dd>
          </div>
        )}

      {voyageDetails.map((item) => (
        <div key={item.title} className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">
            {item.title}
          </dt>
          <dd className="govuk-summary-list__value">
            {
              Array.isArray(item.value)
                ? item.value.map((subItem) => (
                  <React.Fragment key={subItem.label}>
                    <span>{subItem.label}</span>
                    <p className="govuk-!-margin-bottom-2 govuk-!-margin-top-0">{subItem.item}</p>
                  </React.Fragment>
                ))
                : item.value
            }
          </dd>
          <dd className="govuk-summary-list__actions" />
        </div>
      ))}
    </dl>
  );
};

export default CYAGeneralDeclaration;
