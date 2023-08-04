import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import Message from '../../components/Message';
import StatusTag from '../../components/StatusTag';
import {
  CREW_DETAILS_LABEL,
  DECLARATION_STEP_STATUS_COMPLETED,
  DECLARATION_STEP_STATUS_OPTIONAL,
  DECLARATION_STEP_STATUS_REQUIRED,
  DECLARATION_STEP_STATUS_CANNOT_START,
  DECLARATION_STEP_STATUS_NOT_STARTED,
  GENERAL_DECLARATION_LABEL,
  PASSENGER_DETAILS_LABEL,
  SUPPORTING_DOCUMENTS_LABEL,
} from '../../constants/AppConstants';
import { API_URL, ENDPOINT_DECLARATION_PATH, ENDPOINT_DECLARATION_ATTACHMENTS_PATH } from '../../constants/AppAPIConstants';
import {
  MESSAGE_URL,
  URL_DECLARATIONID_IDENTIFIER,
  VOYAGE_CHECK_YOUR_ANSWERS,
  VOYAGE_CREW_UPLOAD_URL,
  VOYAGE_DELETE_DRAFT_CHECK_URL,
  VOYAGE_GENERAL_DECLARATION_UPLOAD_URL,
  VOYAGE_PASSENGERS_URL,
  VOYAGE_SUPPORTING_DOCS_UPLOAD_URL,
  VOYAGE_TASK_LIST_URL,
  YOUR_VOYAGES_URL,
} from '../../constants/AppUrlConstants';
import useGetData from '../../utils/API/useGetData';
import '../../assets/css/taskList.scss';

const VoyageTaskList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const declarationId = searchParams.get(URL_DECLARATIONID_IDENTIFIER);
  const [completedSections, setCompletedSections] = useState(0);
  const [crewStatus, setCrewStatus] = useState();
  const [checkYourAnswersStatus, setCheckYourAnswersStatus] = useState(DECLARATION_STEP_STATUS_CANNOT_START);
  const [isLoading, setIsLoading] = useState(true);
  const [passengerStatus, setPassengersStatus] = useState();
  const [shipName, setShipName] = useState();
  const [voyageTypeText, setVoyageTypeText] = useState();

  const apiResponse = useGetData({
    redirectUrl: `${VOYAGE_TASK_LIST_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`,
    url: `${API_URL}${ENDPOINT_DECLARATION_PATH}/${declarationId}${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`,
  });

  document.title = 'Report a voyage';

  const setStatuses = (data) => {
    let isPassengers;
    if (data.FAL1.passengers && data.FAL6.length > 0) {
      isPassengers = DECLARATION_STEP_STATUS_COMPLETED;
    } else if (data.FAL1.passengers === false) {
      isPassengers = DECLARATION_STEP_STATUS_COMPLETED;
    } else {
      isPassengers = DECLARATION_STEP_STATUS_REQUIRED;
    }

    setCrewStatus(data.FAL5.length > 0 ? DECLARATION_STEP_STATUS_COMPLETED : DECLARATION_STEP_STATUS_REQUIRED);
    setPassengersStatus(isPassengers);

    if (apiResponse?.apiData?.FAL1 && apiResponse?.apiData?.FAL5.length > 0 && isPassengers === DECLARATION_STEP_STATUS_COMPLETED) {
      setCompletedSections(1);
      setCheckYourAnswersStatus(DECLARATION_STEP_STATUS_NOT_STARTED);
    } else {
      setCompletedSections(0);
      setCheckYourAnswersStatus(DECLARATION_STEP_STATUS_CANNOT_START);
    }
  };

  useEffect(() => {
    if (apiResponse.apiData) {
      setIsLoading(true);
      setShipName(apiResponse?.apiData?.FAL1.nameOfShip);
      setVoyageTypeText(apiResponse?.apiData?.FAL1.departureFromUk ? 'Departure from the UK' : 'Arrival to the UK');
      setStatuses(apiResponse?.apiData);
      setIsLoading(false);
    } else if (apiResponse.error) {
      navigate(MESSAGE_URL, { state: { title: 'Something has gone wrong', message: apiResponse.error?.message, redirectURL: YOUR_VOYAGES_URL } });
      setIsLoading(false);
    }
  }, [apiResponse]);

  if (!declarationId) {
    return (
      <Message title="Something has gone wrong" redirectURL={YOUR_VOYAGES_URL} />
    );
  }

  if (isLoading) { return (<LoadingSpinner />); }

  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full below-h1">
          <span className="govuk-caption-xl">Draft</span>
          <h1 className="govuk-heading-xl">Report a voyage</h1>
          <div className="govuk-inset-text">
            <p className="govuk-body"><strong>Ship name: </strong>{shipName}</p>
            <p className="govuk-body"><strong>Voyage type: </strong>{voyageTypeText}</p>
          </div>
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <p className="govuk-body">You have completed <span data-testid="completedSections">{completedSections}</span> of 2 sections.</p>
          <ol className="app-task-list">
            <li>
              <h2 className="app-task-list__section"><span className="app-task-list__section-number">1. </span>Upload documents</h2>
              <ul className="app-task-list__items">
                <li id="fal1" className="app-task-list__item">
                  <Link className="govuk-link" to={`${VOYAGE_GENERAL_DECLARATION_UPLOAD_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`}>
                    <span>{GENERAL_DECLARATION_LABEL}</span>
                    <StatusTag status={DECLARATION_STEP_STATUS_COMPLETED} />
                  </Link>
                </li>
                <li id="fal5" className="app-task-list__item">
                  <Link className="govuk-link" to={`${VOYAGE_CREW_UPLOAD_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`}>
                    <span>{CREW_DETAILS_LABEL}</span>
                    <StatusTag status={crewStatus} />
                  </Link>
                </li>
                <li id="fal5" className="app-task-list__item">
                  <Link className="govuk-link" to={`${VOYAGE_PASSENGERS_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`}>
                    <span>{PASSENGER_DETAILS_LABEL}</span>
                    <StatusTag status={passengerStatus} />
                  </Link>
                </li>
                <li id="supportingDocs" className="app-task-list__item">
                  <Link className="govuk-link" to={`${VOYAGE_SUPPORTING_DOCS_UPLOAD_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`}>
                    <span>{SUPPORTING_DOCUMENTS_LABEL}</span>
                    <StatusTag status={DECLARATION_STEP_STATUS_OPTIONAL} />
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <h2 className="app-task-list__section"><span className="app-task-list__section-number">2. </span>Submit the report</h2>
              <ul className="app-task-list__items">
                <li className="app-task-list__item">
                  {checkYourAnswersStatus === DECLARATION_STEP_STATUS_CANNOT_START
                    && (
                      <div data-testid="checkYourAnswers">
                        <span>Check answers and submit</span>
                        <StatusTag status={checkYourAnswersStatus} />
                      </div>
                    )}
                  {checkYourAnswersStatus !== DECLARATION_STEP_STATUS_CANNOT_START
                    && (
                      <Link className="govuk-link" to={`${VOYAGE_CHECK_YOUR_ANSWERS}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`}>
                        <span>Check answers and submit</span>
                        <StatusTag status={checkYourAnswersStatus} />
                      </Link>
                    )}
                </li>
              </ul>
            </li>
          </ol>
          <button
            type="button"
            className="govuk-button govuk-button--warning"
            data-module="govuk-button"
            onClick={() => navigate(`${VOYAGE_DELETE_DRAFT_CHECK_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`, { state: { shipName } })}
          >
            Delete draft
          </button>
        </div>
      </div>
    </>
  );
};

export default VoyageTaskList;
