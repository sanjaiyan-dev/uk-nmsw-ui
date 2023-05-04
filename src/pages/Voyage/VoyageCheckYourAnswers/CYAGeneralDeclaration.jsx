import React from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { DECLARATION_STATUS_DRAFT } from '../../../constants/AppConstants';
import { URL_DECLARATIONID_IDENTIFIER, VOYAGE_GENERAL_DECLARATION_UPLOAD_URL } from '../../../constants/AppUrlConstants';
import StatusTag from '../../../components/StatusTag';
import formatCountry from '../../../utils/Formatters/formatCountry';
import formatUnlocode from '../../../utils/Formatters/formatUnlocode';

const CYAGeneralDeclaration = ({ declarationId, generalDeclarationData }) => {
  const data = ([
    {
      title: 'Voyage type',
      value: generalDeclarationData.departureFromUk ? 'Departure from the UK' : 'Arrival to the UK',
    },
    {
      title: 'Ship name',
      value: generalDeclarationData.nameOfShip,
    },
    {
      title: 'IMO number',
      value: generalDeclarationData.imoNumber,
    },
    {
      title: 'Call sign',
      value: generalDeclarationData.callSign,
    },
    {
      title: 'Flag state of ship',
      value: formatCountry(generalDeclarationData.flagState),
    },
    {
      title: 'Departure details',
      value: [
        {
          label: 'Departure port LOCODE',
          item: formatUnlocode(generalDeclarationData.departurePortUnlocode),
        },
        {
          label: 'Date of departure',
          item: dayjs(generalDeclarationData.departureDate).format('DD MMMM YYYY'),
        },
        {
          label: 'Time of departure',
          item: dayjs(generalDeclarationData.departureTime, 'HH:mm:ss').format('HH:mm'),
        },
      ],
    },
    {
      title: 'Arrival details',
      value: [
        {
          label: 'Arrival port LOCODE',
          item: formatUnlocode(generalDeclarationData.arrivalPortUnlocode),
        },
        {
          label: 'Date of arrival',
          item: dayjs(generalDeclarationData.arrivalDate).format('DD MMMM YYYY'),
        },
        {
          label: 'Time of arrival',
          item: dayjs(generalDeclarationData.arrivalTime, 'HH:mm:ss').format('HH:mm'),
        },
      ],
    },
    {
      title: 'Next port of call',
      value: formatUnlocode(generalDeclarationData.nextPortUnlocode),
    },
    {
      title: 'Brief description of the cargo',
      value: generalDeclarationData.cargo,
    },
  ]);

  return (
    <dl className="govuk-summary-list govuk-!-margin-bottom-9">
      <div className="govuk-summary-list__row">
        <dt className="govuk-summary-list__key">
          <h2 id="voyageDetails" className="govuk-heading-m">Voyage details</h2>
        </dt>
        <dd className="govuk-summary-list__value" />
        <dd className="govuk-summary-list__actions">
          {generalDeclarationData?.status === DECLARATION_STATUS_DRAFT
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

      {generalDeclarationData?.status !== DECLARATION_STATUS_DRAFT
        && (
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">
              Status
            </dt>
            <dd className="govuk-summary-list__value">
              <StatusTag status={generalDeclarationData?.status} /> {generalDeclarationData?.submissionDate ? dayjs(generalDeclarationData?.submissionDate).format('DD MMMM YYYY') : null}
            </dd>
          </div>
        )}

      {data.map((item) => (
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

CYAGeneralDeclaration.propTypes = {
  declarationId: PropTypes.string.isRequired,
  generalDeclarationData: PropTypes.shape({
    status: PropTypes.string,
    departureFromUk: PropTypes.bool.isRequired,
    nameOfShip: PropTypes.string.isRequired,
    imoNumber: PropTypes.string.isRequired,
    callSign: PropTypes.string.isRequired,
    flagState: PropTypes.string.isRequired,
    departurePortUnlocode: PropTypes.string.isRequired,
    departureDate: PropTypes.string.isRequired,
    departureTime: PropTypes.string.isRequired,
    arrivalPortUnlocode: PropTypes.string.isRequired,
    arrivalDate: PropTypes.string.isRequired,
    arrivalTime: PropTypes.string.isRequired,
    nextPortUnlocode: PropTypes.string.isRequired,
    cargo: PropTypes.string.isRequired,
    submissionDate: PropTypes.string,
  }).isRequired,
};
