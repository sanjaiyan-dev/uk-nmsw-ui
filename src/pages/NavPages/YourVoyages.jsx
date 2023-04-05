import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CREATE_VOYAGE_ENDPOINT, TOKEN_EXPIRED } from '../../constants/AppAPIConstants';
import {
  SIGN_IN_URL,
  VOYAGE_GENERAL_DECLARATION_UPLOAD_URL,
  YOUR_VOYAGES_URL,
} from '../../constants/AppUrlConstants';
import { SERVICE_NAME } from '../../constants/AppConstants';
import Message from '../../components/Message';
import Auth from '../../utils/Auth';

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
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [voyageData, setVoyageData] = useState();

  document.title = SERVICE_NAME;
  console.log('confbanner', state?.confirmationBanner);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(CREATE_VOYAGE_ENDPOINT, {}, {
        headers: { Authorization: `Bearer ${Auth.retrieveToken()}` },
      });
      if (response.status === 200) {
        console.log('declaration id', response.data.id);
        navigate(`${VOYAGE_GENERAL_DECLARATION_UPLOAD_URL}?report=${response.data.id}`);
      }
    } catch (err) {
      // 422 missing segments = missing bearer token for this endpoint
      if (err?.response?.status === 422) {
        Auth.removeToken();
        navigate(SIGN_IN_URL, { state: { redirectURL: YOUR_VOYAGES_URL } });
      } else if (err?.response?.data?.msg === TOKEN_EXPIRED) {
        Auth.removeToken();
        navigate(SIGN_IN_URL, { state: { redirectURL: YOUR_VOYAGES_URL } });
      } else {
        setIsError(true);
      }
    }
  };

  useEffect(() => {
    setVoyageData(voyageList);
  }, []);

  if (isError) {
    return (
      <Message title="Something has gone wrong" redirectURL={YOUR_VOYAGES_URL} />
    );
  }

  return (
    <>
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
            data-module="govuk-button"
            disabled={isLoading}
            type="button"
            onClick={() => { handleClick(); }}
          >
            Report a voyage
          </button>
        </div>
      </div>

      {voyageData?.length > 0 && (
        <>
          <hr />
          <br />

          <div className="govuk-grid-row your-voyages__flex">
            {/* We are removing filtering for MVP  */}
            {/* <div className="govuk-grid-column-one-quarter">
              <div className="light-grey__border">
                <fieldset className="govuk-fieldset">
                  <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">

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
                    <div className="govuk-radios__item">
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
                  </div>
                </fieldset>
              </div>
            </div> */}

            <div className="govuk-grid-column-full">
              <div className="govuk-grid-row">
                <div className="govuk-grid-column-full">
                  <h2 className="govuk-heading-s govuk-!-margin-bottom-1 reported-voyages-margin--top">{`${voyageData.length} reported voyages`}</h2>
                  <div className="facet-tags__container dark-grey__border">
                    <div className="facet-tags__group">
                      <div className="facet-tags__wrapper">
                        <span id="allTag" className="facet-tag govuk-!-padding-1">
                          <span>All report types</span>
                        </span>
                      </div>
                      {/* <div className="facet-tags__wrapper">
                        <span id="draftTag" className="facet-tag govuk-!-padding-1">
                          <span>All drafts</span>
                        </span>
                      </div>
                      <div className="facet-tags__wrapper">
                        <span id="submittedTag" className="facet-tag  govuk-!-padding-1">
                          <span>All submitted reports</span>
                        </span>
                      </div>
                      <div className="facet-tags__wrapper">
                        <span id="cancelledTag" className="facet-tag  govuk-!-padding-1">
                          <span>All cancelled reports</span>
                        </span>
                      </div> */}
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
                  <div key={voyage.id} className="govuk-!-margin-top-5 light-grey__border">
                    <div className="govuk-grid-row">

                      <div className="govuk-grid-column-one-quarter reported-voyages__columns reported-voyages__text">
                        <p className="govuk-body-s govuk-!-font-weight-bold">{voyage.shipName}</p>
                      </div>

                      <div className="govuk-grid-column-one-quarter reported-voyages__columns reported-voyages__text">
                        <p className="govuk-body-s">
                          Voyage type:
                          <br />
                          {voyage.voyageType}
                        </p>
                      </div>

                      <div className="govuk-grid-column-one-quarter reported-voyages__columns reported-voyages__text">
                        <p className="govuk-body-s">
                          Date:
                          <br />
                          {voyage.voyageType === 'Arrival to the UK' ? voyage.arrivalDate : voyage.departureDate}
                        </p>
                      </div>

                      <div className="govuk-grid-column-one-quarter reported-voyages__columns reported-voyages__text">
                        <span className="govuk-body-s">Status</span> <br />
                        <strong className={statusTagClass}>{statusType}</strong>
                      </div>

                      <div className="govuk-grid-column-one-quarter reported-voyages__columns reported-voyages__text">
                        <span className="govuk-body-s">Actions</span> <br />
                        <a href="#change" className="govuk-link small-link-text">{statusLinkText}</a>
                      </div>
                    </div>
                    {/* Commenting out this code due to it creating more complications for MVP - needs more discussion*/}
                    {/* {statusType === 'submitted' && voyage.submissionDate && <p className="govuk-!-font-size-16">{`Submitted: ${dayjs(voyage.submissionDate).format('DD MMMM YYYY')} by ${voyage.signatory}`}</p>}
                    {statusType !== 'submitted' && voyage.creationDate && <p className="govuk-!-font-size-16">{`Created: ${dayjs(voyage.creationDate).format('DD MMMM YYYY')} by ${voyage.signatory}`}</p>} */}

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
    </>
  );
};

export default YourVoyages;
