import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SERVICE_NAME } from '../../constants/AppConstants';

const voyageList = [
  {
    id: '1', voyageType: 'Arrival to the UK', shipName: 'Disney Cruises', arrivalDate: '11th July 2023', departureDate: '15th July 2023', status: 'Submitted',
  },
  {
    id: '2', voyageType: 'Departure from the UK', shipName: 'The Queen Mary', arrivalDate: '11th September 2023', departureDate: '15th September 2023', status: 'Draft',
  },
  // {
  //   id: '3', voyageType: 'Departure from the UK', shipName: 'The Black Pearl', arrivalDate: '15th May 2023', departureDate: '27th May 2023', status: 'Cancelled',
  // },
  // {
  //   id: '4', voyageType: 'Arrival to the UK', shipName: 'The Golden Hind', arrivalDate: '15th March 2023', departureDate: '27th March 2023', status: 'Failed',
  // },
];

// NOTES:
// - The filter buttons do nothing
// - There is commented out code for when/if we need to display in cancelled/failed voyages in the future
// - There is commented out code for when the filter is working but there are no voyages relating to the filter

const YourVoyages = () => {
  const { state } = useLocation();
  const [voyageData, setVoyageData] = useState();

  document.title = SERVICE_NAME;
  console.log(state?.confirmationBanner);

  useEffect(() => {
    setVoyageData(voyageList);
  }, []);

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-full">
        <h1 className="govuk-heading-xl govuk-!-margin-bottom-4">Your voyages</h1>
        {voyageData?.length === 0 && (
          <div className="govuk-inset-text">
            <p className="govuk-body">You have not reported any voyages yet</p>
          </div>
        )}
        <button
          className="govuk-button"
          type="button"
        >
          Report a voyage
        </button>
        {voyageData?.length > 0 && (
          <>
            <hr />
            <div className="declaration-filter__flex">
              <div className="govuk-grid-column-one-quarter declaration-filter__container">
                <div className="govuk-form-group declaration-filter__border">
                  <fieldset className="govuk-fieldset">
                    <legend id="filter-legend-ratified_by" className="govuk-fieldset__legend govuk-fieldset__legend--s">

                      Select report type
                    </legend>
                    <div className="govuk-radios govuk-radios--small" data-module="govuk-radios">
                      <div className="govuk-radios__item">
                        <input
                          className="govuk-radios__input"
                          id="all"
                          name="reports"
                          type="radio"
                          value="all"
                          onChange={() => { }}
                          defaultChecked
                        />
                        <label className="govuk-label govuk-radios__label" htmlFor="all">
                          All
                        </label>
                      </div>
                      <div className="govuk-radios__item">
                        <input
                          className="govuk-radios__input"
                          id="draft"
                          name="reports"
                          type="radio"
                          value="draft"
                          onChange={() => { }}
                        />
                        <label className="govuk-label govuk-radios__label" htmlFor="draft">
                          Drafts
                        </label>
                      </div>
                      <div className="govuk-radios__item">
                        <input
                          className="govuk-radios__input"
                          id="submitted"
                          name="reports"
                          type="radio"
                          value="submitted"
                          onChange={() => { }}
                        />
                        <label className="govuk-label govuk-radios__label" htmlFor="submitted">
                          Submitted
                        </label>
                      </div>
                      {/* <div className="govuk-radios__item">
                        <input
                          className="govuk-radios__input"
                          id="cancelled"
                          name="reports"
                          type="radio"
                          value="cancelled"
                          onChange={() => {}}
                        />
                        <label className="govuk-label govuk-radios__label" htmlFor="cancelled">
                          Cancelled
                        </label>
                      </div>

                      <div className="govuk-radios__item">
                        <input
                          className="govuk-radios__input"
                          id="failed"
                          name="reports"
                          type="radio"
                          value="failed"
                          onChange={() => { }}
                        />
                        <label className="govuk-label govuk-radios__label" htmlFor="failed">
                          Failed
                        </label>
                      </div> */}
                    </div>

                  </fieldset>
                </div>
              </div>

              <div className=" declaration-spacing govuk-grid-column-three-quarters">
                <div className=" filter-results__border govuk-!-margin-bottom-0">
                  <div className="govuk-grid-row">
                    <div className="govuk-grid-column-full">
                      <h2 className="govuk-heading-s govuk-!-padding-top-2 govuk-!-margin-bottom-2 ">{`${voyageData.length} reported voyages`}</h2>
                      <div className="facet-tags__container">
                        <div className="facet-tags__group">
                          <div className="facet-tags__wrapper">
                            <span className="facet-tag govuk-!-padding-1">
                              <span>All report types</span>
                            </span>
                          </div>
                          {/* <div className="facet-tags__wrapper">
      <span id="draftstag" className="facet-tag govuk-!-padding-1" style="display: none;">
        <span className="facet-tag__text govuk-body govuk-!-margin-bottom-0" style="display: none;">All drafts</span>
      </span>
    </div>
    <div className="facet-tags__wrapper">
      <span id="submittedtag" className="facet-tag  govuk-!-padding-1" style="display: none;">
        <span className="facet-tag__text govuk-body govuk-!-margin-bottom-0 " style="display: none;">All submitted reports</span>
      </span>
    </div>
    <div className="facet-tags__wrapper">
      <span id="cancelledtag" className="facet-tag  govuk-!-padding-1" style="display: none;">
        <span className="facet-tag__text govuk-body govuk-!-margin-bottom-0 " style="display: none;">All cancelled reports</span>
      </span>
    </div> */}

                        </div>
                      </div>
                    </div>

                  </div>

                </div>
                {/* TODO: See if there is a cleaner way to set these attributes for diffrerent statuses */}
                {voyageData?.map((voyage) => {
                  let statusTagClass;
                  let statusLinkText;
                  let statusType;
                  if (voyage.status === 'Submitted' || voyage.status === 'PreSubmitted') {
                    statusTagClass = 'govuk-tag govuk-tag--green';
                    statusLinkText = 'Review or cancel';
                    statusType = 'submitted';
                  }
                  if (voyage.status === 'Draft') {
                    statusTagClass = 'govuk-tag govuk-tag--grey';
                    statusLinkText = 'Continue';
                    statusType = 'draft';
                  }
                  // This is for if/when we implement showing cancelled/failed reports
                  // } else if (voyage.status === 'Draft') {
                  //   statusTagClass = 'govuk-tag govuk-tag--grey';
                  //   statusLinkText = 'Continue';
                  //   statusType = 'draft';
                  // } else if (voyage.status === 'Cancelled' || voyage.status === 'PreCancelled') {
                  //   statusTagClass = 'govuk-tag govuk-tag--red';
                  //   statusLinkText = 'Review';
                  //   statusType = 'cancelled';
                  // } else {
                  //   statusTagClass = 'govuk-tag govuk-tag--red';
                  //   statusLinkText = 'Review and re-submit';
                  //   statusType = 'failed';
                  // }
                  return (
                    <div key={voyage.id} className="filter-results__layout govuk-!-margin-bottom-5">
                      <div className="govuk-grid-row govuk-!-margin-top-5">
                        <div className="filter-results__text govuk-grid-column-one-quarter">
                          <strong className="govuk-label--s ">
                            {voyage.shipName}
                          </strong>
                        </div>

                        <div className="filter-results__text govuk-grid-column-one-quarter">
                          <p className="govuk-body-s">
                            Voyage type :
                            <br />
                            {voyage.voyageType}
                          </p>
                        </div>

                        <div className="filter-results__text govuk-grid-column-one-quarter">
                          <p className="govuk-body-s">
                            Date:
                            <br />
                            {voyage.voyageType === 'Arrival to the UK' ? voyage.arrivalDate : voyage.departureDate}
                          </p>
                        </div>

                        <div className="filter-results__text govuk-grid-column-one-quarter">
                          <span className="govuk-body-s">Status</span> <br />
                          <strong className={statusTagClass}>{statusType}</strong>
                        </div>

                        <div className="filter-results__text govuk-grid-column-one-quarter">
                          <span className="govuk-body-s">Actions</span> <br />
                          <a href="#change" className="govuk-link govuk-body-s">{statusLinkText}</a>
                        </div>
                      </div>

                      <p className="govuk-!-font-size-16 govuk-!-margin-top-0">Submitted: 3 January 2023 by John Smith</p>

                    </div>
                  );
                })}
                {/* To be implemented when the filter is working and there are no voyages relating to the filter */}
                {/* <div className="no-results govuk-!-font-size-19" style="display: none;">
    <p className="govuk-body govuk-inset-text govuk-!-font-weight-bold">There are no matching results.</p>
    <p className="govuk-body">Improve your search results by:</p>
    <ul className="govuk-list govuk-list--bullet">
      <li>removing filters</li>
      <li>double-checking your spelling</li>
      <li>using fewer keywords</li>
      <li>searching for something less specific</li>
    </ul>
    </div> */}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default YourVoyages;
