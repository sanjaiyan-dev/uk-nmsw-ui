import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  CHECK_YOUR_ANSWERS_LABEL,
  CREW_DETAILS_LABEL,
  GENERAL_DECLARATION_LABEL,
  PASSENGER_DETAILS_LABEL,
  SUPPORTING_DOCUMENTS_LABEL,
  DECLARATION_STEP_STATUS_COMPLETED,
  DECLARATION_STEP_STATUS_REQUIRED,
} from '../../constants/AppConstants';
import {
  SIGN_IN_URL,
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
import LoadingSpinner from '../../components/LoadingSpinner';
import Message from '../../components/Message';
import StatusTag from '../../components/StatusTag';
import Auth from '../../utils/Auth';
import GetDeclaration from '../../utils/GetDeclaration';
import useGetData from '../../utils/API/useGetData';
import { API_URL, ENDPOINT_DECLARATION_PATH, ENDPOINT_DECLARATION_ATTACHMENTS_PATH } from '../../constants/AppAPIConstants';

const VoyageTaskList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const declarationId = searchParams.get(URL_DECLARATIONID_IDENTIFIER);
  const [completedSections, setCompletedSections] = useState(0);
  const [declarationData, setDeclarationData] = useState();
  const [voyageTypeText, setVoyageTypeText] = useState();
  const [checkYourAnswersStep, setCheckYourAnswersStep] = useState(
    {
      item: 'checkYourAnswers',
      link: `${VOYAGE_CHECK_YOUR_ANSWERS}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`,
      label: CHECK_YOUR_ANSWERS_LABEL,
      status: 'cannotStartYet',
    },
  );
  const [steps, setStep] = useState([]);
  const [isLoading, setIsLoading] = useState();

  const [crewStatus, setCrewStatus] = useState();
  const [passengerStatus, setPassengersStatus] = useState();
  const [shipName, setShipName] = useState();

  const apiResponse = useGetData({
    redirectUrl: `${VOYAGE_TASK_LIST_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`,
    url: `${API_URL}${ENDPOINT_DECLARATION_PATH}/${declarationId}${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`,
  });

  document.title = 'Report a voyage';

  const updatePassengerStatus = (data) => {
    let isPassengers;
    if (data.FAL1.passengers && data.FAL6.length > 0) {
      isPassengers = DECLARATION_STEP_STATUS_COMPLETED;
    } else if (data.FAL1.passengers === false) {
      isPassengers = DECLARATION_STEP_STATUS_COMPLETED;
    } else {
      isPassengers = DECLARATION_STEP_STATUS_REQUIRED;
    }
    return isPassengers;
  };

  const updateStatus = (data) => {
    console.log('updatestatus');

    // const updatedStatuses = [
    //   {
    //     item: 'generalDeclaration',
    //     link: `${VOYAGE_GENERAL_DECLARATION_UPLOAD_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`,
    //     label: GENERAL_DECLARATION_LABEL,
    //     status: 'completed', // this page does not load before this step is complete
    //   },
    //   {
    //     item: 'crewDetails',
    //     link: `${VOYAGE_CREW_UPLOAD_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`,
    //     label: CREW_DETAILS_LABEL,
    //     status: data.FAL5.length > 0 ? 'completed' : 'required',
    //   },
    //   {
    //     item: 'passengerDetails',
    //     link: `${VOYAGE_PASSENGERS_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`,
    //     label: PASSENGER_DETAILS_LABEL,
    //     status: passengersStatus,
    //   },
    //   {
    //     item: 'supportingDocuments',
    //     link: `${VOYAGE_SUPPORTING_DOCS_UPLOAD_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`,
    //     label: SUPPORTING_DOCUMENTS_LABEL,
    //     status: 'optional',
    //   },
    // ];

    // return updatedStatuses;
  };

  // const updateDeclarationData = async () => {
  //   // const response = await GetDeclaration({ declarationId });
  //   console.log('declarationData', apiResponse)

  //   // if (apiResponse.apiData) {
  //   // setDeclarationData(apiResponse?.apiData);
  //   // setVoyageTypeText(apiResponse?.apiData?.FAL1.departureFromUk ? 'Departure from the UK' : 'Arrival to the UK');

  //   // let isPassengers;
  //   // if (apiResponse?.apiData?.FAL1.passengers && apiResponse?.apiData?.FAL6.length > 0) {
  //   //   isPassengers = 'completed';
  //   // } else if (apiResponse?.apiData?.FAL1.passengers === false) {
  //   //   isPassengers = 'completed';
  //   // } else {
  //   //   isPassengers = 'required';
  //   // }

  //   const updatedStatuses = [
  //     {
  //       item: 'generalDeclaration',
  //       link: `${VOYAGE_GENERAL_DECLARATION_UPLOAD_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`,
  //       label: GENERAL_DECLARATION_LABEL,
  //       status: 'completed', // this page does not load before this step is complete
  //     },
  //     {
  //       item: 'crewDetails',
  //       link: `${VOYAGE_CREW_UPLOAD_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`,
  //       label: CREW_DETAILS_LABEL,
  //       status: apiResponse?.apiData?.FAL5.length > 0 ? 'completed' : 'required',
  //     },
  //     {
  //       item: 'passengerDetails',
  //       link: `${VOYAGE_PASSENGERS_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`,
  //       label: PASSENGER_DETAILS_LABEL,
  //       status: isPassengers,
  //     },
  //     {
  //       item: 'supportingDocuments',
  //       link: `${VOYAGE_SUPPORTING_DOCS_UPLOAD_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`,
  //       label: SUPPORTING_DOCUMENTS_LABEL,
  //       status: 'optional',
  //     },
  //   ];

  //   setStep(updatedStatuses);

  //   if (apiResponse?.apiData?.FAL1 && apiResponse?.apiData?.FAL5.length > 0 && isPassengers === 'completed') {
  //     setCompletedSections(1);
  //     setCheckYourAnswersStep({ ...checkYourAnswersStep, status: 'notStarted' });
  //   }
  //   else {
  //     setCompletedSections(0);
  //     setCheckYourAnswersStep({ ...checkYourAnswersStep, status: 'cannotStartYet' });
  //   }
  //   }
  //   else {
  //     switch (response?.status) {
  //       case 401:
  //       case 422:
  //         Auth.removeToken();
  //         navigate(SIGN_IN_URL, { state: { redirectURL: `${VOYAGE_TASK_LIST_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}` } });
  //         break;
  //       default: navigate(MESSAGE_URL, {
  //         state: {
  //           title: 'Something has gone wrong',
  //           message: response?.message,
  //           redirectURL: YOUR_VOYAGES_URL,
  //         },
  //       });
  //     }
  //   // }

  //   setIsLoading(false);

  // setDeclarationData(apiResponse?.apiData);
  // };

  useEffect(() => {
    if (apiResponse.apiData) {
      setIsLoading(true);
      // top section
      setShipName(apiResponse?.apiData?.FAL1.nameOfShip);
      setVoyageTypeText(apiResponse?.apiData?.FAL1.departureFromUk ? 'Departure from the UK' : 'Arrival to the UK');

      // list of links
      setCrewStatus(apiResponse?.apiData?.FAL5.length > 0 ? DECLARATION_STEP_STATUS_COMPLETED : DECLARATION_STEP_STATUS_REQUIRED);
      setPassengersStatus(updatePassengerStatus(apiResponse?.apiData));
    } else if (apiResponse.error) {
      navigate(MESSAGE_URL, { state: { title: 'Something has gone wrong', message: apiResponse.error?.message, redirectURL: YOUR_VOYAGES_URL } });
    }
    setIsLoading(false);
  }, [apiResponse]);

  if (!declarationId) {
    return (
      <Message title="Something has gone wrong" redirectURL={YOUR_VOYAGES_URL} />
    );
  }

  console.log('v', voyageTypeText, passengerStatus);
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
              </ul>
            </li>
            <li>
              <h2 className="app-task-list__section"><span className="app-task-list__section-number">2. </span>Submit the report</h2>
              <ul className="app-task-list__items">
                <li className="app-task-list__item">
                  {checkYourAnswersStep.status === 'cannotStartYet'
                    && (
                      <div data-testid="checkYourAnswers">
                        <span>Check answers and submit</span>
                        <StatusTag status={checkYourAnswersStep.status} />
                      </div>
                    )}
                  {checkYourAnswersStep.status !== 'cannotStartYet'
                    && (
                      <Link className="govuk-link" to={checkYourAnswersStep.link}>
                        <span>Check answers and submit</span>
                        <StatusTag status={checkYourAnswersStep.status} />
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
            onClick={() => navigate(`${VOYAGE_DELETE_DRAFT_CHECK_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`, { state: { shipName: declarationData?.FAL1?.nameOfShip } })}
          >
            Delete draft
          </button>
        </div>
      </div>
    </>
  );
};

export default VoyageTaskList;
