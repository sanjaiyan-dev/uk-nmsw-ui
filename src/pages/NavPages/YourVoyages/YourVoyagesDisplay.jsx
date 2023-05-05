import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { URL_DECLARATIONID_IDENTIFIER, VOYAGE_CHECK_YOUR_ANSWERS, VOYAGE_TASK_LIST_URL } from '../../../constants/AppUrlConstants';
import StatusTag from '../../../components/StatusTag';
import {
  DECLARATION_STATUS_CANCELLED, DECLARATION_STATUS_DRAFT, DECLARATION_STATUS_FAILED, DECLARATION_STATUS_PRECANCELLED, DECLARATION_STATUS_PRESUBMITTED, DECLARATION_STATUS_SUBMITTED,
} from '../../../constants/AppConstants';

const YourVoyagesDisplay = ({ voyageData }) => {
  const getActionButtontext = (status) => {
    let actionText;
    switch (status) {
      case DECLARATION_STATUS_DRAFT:
        actionText = 'Continue';
        break;
      case DECLARATION_STATUS_PRESUBMITTED:
      case DECLARATION_STATUS_SUBMITTED:
        actionText = 'Review or cancel';
        break;
      case DECLARATION_STATUS_CANCELLED:
      case DECLARATION_STATUS_PRECANCELLED:
        actionText = 'Review';
        break;
      // Failed is separate as it will be 'Review and re-submit' when we have this functionality
      case DECLARATION_STATUS_FAILED:
        actionText = 'Review';
        break;
      default:
        actionText = 'Review';
    }
    return actionText;
  };

  return (
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

          {voyageData?.map((voyage) => (
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
                    to={voyage.status === 'Draft' ? `${VOYAGE_TASK_LIST_URL}?${URL_DECLARATIONID_IDENTIFIER}=${voyage.id}` : `${VOYAGE_CHECK_YOUR_ANSWERS}?${URL_DECLARATIONID_IDENTIFIER}=${voyage.id}`}
                    className="govuk-link small-link-text"
                  >
                    {getActionButtontext(voyage.status)}
                  </Link>
                </div>
              </div>
              {/* Commenting out this code due to it creating more complications for MVP - needs more discussion */}
              {/* {statusType === 'submitted' && voyage.submissionDate && <p className="govuk-!-font-size-16">{`Submitted: ${dayjs(voyage.submissionDate).format('DD MMMM YYYY')} by ${voyage.signatory}`}</p>}
                  {statusType !== 'submitted' && voyage.creationDate && <p className="govuk-!-font-size-16">{`Created: ${dayjs(voyage.creationDate).format('DD MMMM YYYY')} by ${voyage.signatory}`}</p>} */}

            </div>
          ))}
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
  );
};

export default YourVoyagesDisplay;

YourVoyagesDisplay.propTypes = {
  voyageData: PropTypes.array,
};
