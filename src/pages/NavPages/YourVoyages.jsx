import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { CREATE_VOYAGE_ENDPOINT, TOKEN_EXPIRED } from '../../constants/AppAPIConstants';
import { SERVICE_NAME } from '../../constants/AppConstants';
import {
  SIGN_IN_URL,
  URL_DECLARATIONID_IDENTIFIER,
  VOYAGE_GENERAL_DECLARATION_UPLOAD_URL,
  VOYAGE_SUPPORTING_DOCS_UPLOAD_URL,
  VOYAGE_TASK_LIST_URL,
  YOUR_VOYAGES_URL,
} from '../../constants/AppUrlConstants';
import LoadingSpinner from '../../components/LoadingSpinner';
import Message from '../../components/Message';
import StatusTag from '../../components/StatusTag';
import Auth from '../../utils/Auth';

// NOTES:
// - The filter buttons do nothing
// - There is commented out code for when/if we need to display in cancelled/failed voyages in the future
// - There is commented out code for when the filter is working but there are no voyages relating to the filter

const YourVoyages = () => {
  dayjs.extend(customParseFormat);
  // const { state } = useLocation();
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [voyageData, setVoyageData] = useState();

  document.title = SERVICE_NAME;
  // console.log('confbanner', state?.confirmationBanner);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(CREATE_VOYAGE_ENDPOINT, {}, {
        headers: { Authorization: `Bearer ${Auth.retrieveToken()}` },
      });
      if (response.status === 200) {
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

  const getDeclarationData = async () => {
    try {
      const response = await axios.get(CREATE_VOYAGE_ENDPOINT, {
        headers: { Authorization: `Bearer ${Auth.retrieveToken()}` },
      });
      if (response.status === 200) {
        // We will delete drafts without a general declaration here instead of filtering them out
        const filteredData = response.data.results.reduce((results, data) => {
          if (data.departureFromUk !== null) {
            results.push(data);
          }
          return results;
        }, []);
        setVoyageData(filteredData);
      }
      setIsLoading(false);
    } catch (err) {
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
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    getDeclarationData();
  }, []);

  if (isError) {
    return (
      <Message title="Something has gone wrong" redirectURL={YOUR_VOYAGES_URL} />
    );
  }

  if (isLoading) { return (<LoadingSpinner />); }

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

              {voyageData?.map((voyage) => {
                let statusLinkText;
                if (voyage.status === 'Submitted' || voyage.status === 'PreSubmitted') {
                  statusLinkText = 'Review or cancel';
                } else if (voyage.status === 'Draft') {
                  statusLinkText = 'Continue';
                } else if (voyage.status === 'Cancelled' || voyage.status === 'PreCancelled') {
                  statusLinkText = 'Review';
                } else if (voyage.status === 'Failed') {
                  statusLinkText = 'Review and re-submit';
                } else {
                  statusLinkText = 'Review and re-submit';
                }
                return (
                  <div key={voyage.id} className="govuk-!-margin-top-5 light-grey__border">
                    <div className="govuk-grid-row">

                      <div className="govuk-grid-column-one-quarter reported-voyages__columns reported-voyages__text">
                        <p className="govuk-body-s govuk-!-font-weight-bold">{voyage.nameOfShip}</p>
                      </div>

                      <div className="govuk-grid-column-one-quarter reported-voyages__columns reported-voyages__text">
                        <p className="govuk-body-s">
                          Voyage type:
                          <br />
                          {voyage.departureFromUk ? 'Departure from the UK' : 'Arrival to the UK'}
                        </p>
                      </div>

                      <div className="govuk-grid-column-one-quarter reported-voyages__columns reported-voyages__text">
                        <p className="govuk-body-s">
                          Date:
                          <br />
                          {voyage.departureFromUk ? dayjs(voyage.departureDate).format('DD MMMM YYYY') : dayjs(voyage.arrivalDate).format('DD MMMM YYYY')}
                        </p>
                      </div>

                      <div className="govuk-grid-column-one-quarter reported-voyages__columns reported-voyages__text">
                        <span className="govuk-body-s">Status</span> <br />
                        <StatusTag status={voyage.status} />
                      </div>

                      <div className="govuk-grid-column-one-quarter reported-voyages__columns reported-voyages__text">
                        <span className="govuk-body-s">Actions</span> <br />
                        <Link
                          to={voyage.status === 'Draft' ? `${VOYAGE_TASK_LIST_URL}?${URL_DECLARATIONID_IDENTIFIER}=${voyage.id}` : `${VOYAGE_SUPPORTING_DOCS_UPLOAD_URL}?${URL_DECLARATIONID_IDENTIFIER}=${voyage.id}`}
                          className="govuk-link small-link-text"
                        >
                          {statusLinkText}
                        </Link>
                      </div>
                    </div>
                    {/* Commenting out this code due to it creating more complications for MVP - needs more discussion */}
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
