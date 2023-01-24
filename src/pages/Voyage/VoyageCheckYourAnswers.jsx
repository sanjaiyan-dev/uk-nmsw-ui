import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  VOYAGE_CREW_UPLOAD_URL,
  VOYAGE_GENERAL_DECLARATION_UPLOAD_URL,
  VOYAGE_PASSENGERS_URL,
  VOYAGE_SUPPORTING_DOCS_UPLOAD_URL,
} from '../../constants/AppUrlConstants';

const VoyageCheckYourAnswers = () => {
  const { state } = useLocation();

  // values of this array will be populated by GET request when available
  const voyageDetails = [
    {
      title: 'Voyage type',
      value: '',
    },
    {
      title: 'Ship name',
      value: '',
    },
    {
      title: 'IMO number',
      value: '',
    },
    {
      title: 'Call sign',
      value: '',
    },
    {
      title: 'Flag state of ship',
      value: '',
    },
    {
      title: 'Departure details',
      value: [
        {
          id: 1, // adding ID to ensure we have a unique key for mapping between here and arrival details
          label: 'Name of departure port',
          item: '',
        },
        {
          id: 2,
          label: 'Date of departure',
          item: '',
        },
        {
          id: 3,
          label: 'Time of departure',
          item: '',
        },
      ],
    },
    {
      title: 'Arrival details',
      value: [
        {
          id: 4,
          label: 'Name of arrival port',
          item: '',
        },
        {
          id: 5,
          label: 'Date of arrival',
          item: '',
        },
        {
          id: 6,
          label: 'Time of arrival',
          item: '',
        },
      ],
    },
    {
      title: 'Next port of call',
      value: '',
    },
    {
      title: 'Brief description of the cargo',
      value: '',
    },
  ];
  const uploadedDocuments = [
    {
      id: 'crewDetails',
      title: 'Crew details',
      value: '',
      fileLink: '',
      changeLink: VOYAGE_CREW_UPLOAD_URL,
    },
    {
      id: 'passengerDetails',
      title: 'Passenger details',
      value: '',
      fileLink: '',
      changeLink: VOYAGE_PASSENGERS_URL,
    },
    {
      id: 'supportingDocuments',
      title: 'Supporting documents',
      value: '',
      fileLink: '',
      changeLink: VOYAGE_SUPPORTING_DOCS_UPLOAD_URL,
    },
  ];

  const handleSubmit = () => {
    console.log('submit clicked for id', state?.voyageId);
  };

  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <h1 className="govuk-heading-xl">Check your answers</h1>
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <dl className="govuk-summary-list govuk-!-margin-bottom-9">
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">
                <h2 id="voyageDetails" className="govuk-heading-m">Voyage details</h2>
              </dt>
              <dd className="govuk-summary-list__value" />
              <dd className="govuk-summary-list__actions">
                <Link to={VOYAGE_GENERAL_DECLARATION_UPLOAD_URL} aria-describedby="voyageDetails" data-testid="changeGeneralDeclarationLink">
                  Change<span className="govuk-visually-hidden"> change voyage details</span>
                </Link>
              </dd>
            </div>
            {voyageDetails.map((item) => (
              <div key={item.title} className="govuk-summary-list__row">
                <dt className="govuk-summary-list__key">
                  {item.title}
                </dt>
                <dd className="govuk-summary-list__value">
                  {
                    Array.isArray(item.value)
                      ? item.value.map((subItem) => (
                        <React.Fragment key={subItem.id}>
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

          <h2 className="govuk-heading-m">Uploaded documents</h2>
          <dl className="govuk-summary-list govuk-!-margin-bottom-9">
            {uploadedDocuments.map((item) => (
              <div key={item.id} className="govuk-summary-list__row">
                <dt id={item.id} className="govuk-summary-list__key">
                  {item.title}
                </dt>
                <dd className="govuk-summary-list__value">
                  {item.value}
                </dd>
                <dd className="govuk-summary-list__actions">
                  <Link to={item.changeLink} aria-describedby={item.id} data-testid={`change${item.id}`}>
                    Change<span className="govuk-visually-hidden">{` change ${item.title}`}</span>
                  </Link>
                </dd>
              </div>
            ))}
          </dl>

          <h2 className="govuk-heading-m">Now send your application</h2>
          <p className="govuk-body">By submitting this application you are confirming that, to the best of your knowledge, the details you are providing are correct.</p>

          <button
            type="button"
            className="govuk-button"
            data-module="govuk-button"
            onClick={() => handleSubmit()}
          >
            Save and submit
          </button>
        </div>
      </div>
    </>
  );
};

export default VoyageCheckYourAnswers;
