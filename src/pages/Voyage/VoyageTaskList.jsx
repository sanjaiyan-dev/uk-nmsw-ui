import { Link, useNavigate } from 'react-router-dom';
import {
  VOYAGE_CREW_UPLOAD_URL,
  VOYAGE_GENERAL_DECLARATION_UPLOAD_URL,
  VOYAGE_PASSENGERS_URL,
  VOYAGE_SUPPORTING_DOCS_UPLOAD_URL,
} from '../../constants/AppUrlConstants';

const VoyageTaskList = () => {
  const navigate = useNavigate();
  document.title = 'Report a voyage';

  // temp data until we can populate programatically
  const reportStatus = 'Draft';
  const shipName = 'Snowplant';
  const voyageType = 'Departure from the UK';
  const completedSections = 1;
  const statusGeneralDeclaration = 'Completed';
  const statusCrewDetails = 'Required';
  const statusPassengerDetails = 'Required';
  const statusSupportingDocuments = 'Optional';
  const statusCheckYourAnswers = 'Cannot start yet'; // changes to NotStarted when all section 1 items are in Completed status, changes to Completed status when voyage in 'PreSubmitted' or 'Submitted' status
  const testStatus = 'No started';
  /* TODO - setting status & style options:
   * we will need to also refactor the 'complete', 'optional' etc <strong> elements
   * to populate both class and text based on the status of that item
   */
  const classCompleted = 'govuk-tag app-task-list__tag';
  const classRequired = 'govuk-tag govuk-tag--pink app-task-list__tag';
  const classOptional = 'govuk-tag govuk-tag--blue app-task-list__tag';
  const classNotStarted = 'govuk-tag govuk-tag--grey app-task-list__tag';
  const classCannotStartYet = 'govuk-tag govuk-tag--grey app-task-list__tag';

  const handleDelete = () => {
    /* TODO: this will direct to an are you sure you want to delete page
     * which will then return to your voyages
     * with a confirmation banner
     */
    navigate('/');
  };

  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full below-h1">
          <span className="govuk-caption-xl">{reportStatus}</span>
          <h1 className="govuk-heading-xl">Report a voyage</h1>
          <div className="govuk-inset-text">
            <p className="govuk-body"><strong>Ship name: </strong>{shipName}</p>
            <p className="govuk-body"><strong>Voyage type: </strong>{voyageType}</p>
          </div>
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <p className="govuk-body">You have completed {completedSections} of 2 sections.</p>
          <ol className="app-task-list">
            <li>
              <h2 className="app-task-list__section"><span className="app-task-list__section-number">1. </span>Upload documents</h2>
              <ul className="app-task-list__items">
                <li className="app-task-list__item">
                  <Link to={VOYAGE_GENERAL_DECLARATION_UPLOAD_URL} aria-describedby="generalDeclaration">
                    General Declaration (FAL 1)
                    <strong className={classCompleted} id="eligibility-status">{statusGeneralDeclaration}</strong>
                  </Link>
                </li>
                <li className="app-task-list__item">
                  <Link to={VOYAGE_CREW_UPLOAD_URL} aria-describedby="generalDeclaration">
                    Crew details including supernumeraries (FAL 5)
                    <strong className={classRequired} id="eligibility-status">{statusCrewDetails}</strong>
                  </Link>
                </li>
                <li className="app-task-list__item">
                  <Link to={VOYAGE_PASSENGERS_URL} aria-describedby="generalDeclaration">
                    Any passenger details (FAL 6)
                    <strong className={classRequired} id="eligibility-status">{statusPassengerDetails}</strong>
                  </Link>
                </li>
                <li className="app-task-list__item">
                  <Link to={VOYAGE_SUPPORTING_DOCS_UPLOAD_URL} aria-describedby="generalDeclaration">
                    Supporting documents
                    <strong className={classOptional} id="eligibility-status">{statusSupportingDocuments}</strong>
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <h2 className="app-task-list__section"><span className="app-task-list__section-number">2. </span>Submit the report</h2>
              <ul className="app-task-list__items">
                <li className="app-task-list__item">
                  <Link to="/" aria-describedby="generalDeclaration">
                    Check answers and submit
                    <strong className={classCannotStartYet} id="eligibility-status">{statusCheckYourAnswers}</strong>
                  </Link>
                </li>
                <li className="app-task-list__item">
                  <Link to="/" aria-describedby="generalDeclaration">
                    Example not yet started
                    <strong className={classNotStarted} id="eligibility-status">{testStatus}</strong>
                  </Link>
                </li>
              </ul>
            </li>
          </ol>
          <button
            type="button"
            className="govuk-button govuk-button--warning"
            onClick={() => handleDelete()}
          >
            Delete draft
          </button>
        </div>
      </div>
    </>
  );
};

export default VoyageTaskList;
