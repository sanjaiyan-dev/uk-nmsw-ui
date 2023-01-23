import React from 'react';
import { useLocation } from 'react-router-dom';

const VoyageCheckYourAnswers = () => {
  const { state } = useLocation();
  console.log(state?.voyageId);

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
          label: 'Name of departure port',
          item: '',
        },
        {
          label: 'Date of departure',
          item: '',
        },
        {
          label: 'Time of departure',
          item: '',
        },
      ],
    },
    {
      title: 'Arrival details',
      value: [
        {
          label: 'Name of arrival port',
          item: '',
        },
        {
          label: 'Date of arrival',
          item: '',
        },
        {
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

  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <h1 className="govuk-heading-xl">Check your answers</h1>
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <dl className="govuk-summary-list">
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">
                <h2 className="govuk-heading-m">Voyage details</h2>
              </dt>
              <dd className="govuk-summary-list__value" />
              <dd className="govuk-summary-list__actions">
                Change<span className="govuk-visually-hidden"> change voyage details</span>
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
                        <React.Fragment key={subItem.title}>
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
        </div>
      </div>
    </>
  );
};

export default VoyageCheckYourAnswers;
