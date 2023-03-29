import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  CHECK_YOUR_ANSWERS_LABEL,
  CREW_DETAILS_LABEL,
  GENERAL_DECLARATION_LABEL,
  PASSENGER_DETAILS_LABEL,
  SUPPORTING_DOCUMENTS_LABEL,
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
import Auth from '../../utils/Auth';
import GetDeclaration from '../../utils/GetDeclaration';

const CLASSES_FOR_STATUS = {
  completed: 'govuk-tag app-task-list__tag',
  required: 'govuk-tag govuk-tag--pink app-task-list__tag',
  optional: 'govuk-tag govuk-tag--blue app-task-list__tag',
  notStarted: 'govuk-tag govuk-tag--grey app-task-list__tag',
  cannotStartYet: 'govuk-tag govuk-tag--grey app-task-list__tag',
};

const LABELS_FOR_STATUS = {
  completed: 'Completed',
  required: 'Required',
  optional: 'Optional',
  notStarted: 'Not started',
  cannotStartYet: 'Cannot start yet',
};

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
  const [isLoading, setIsLoading] = useState(true);
  document.title = 'Report a voyage';

  const updateDeclarationData = async () => {
    const response = await GetDeclaration({ declarationId });
    if (response.data) {
      setDeclarationData(response.data);
      setVoyageTypeText(response.data?.FAL1.departureFromUk ? 'Departure from the UK' : 'Arrival to the UK');

      const updatedStatuses = [
        {
          item: 'generalDeclaration',
          link: `${VOYAGE_GENERAL_DECLARATION_UPLOAD_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`,
          label: GENERAL_DECLARATION_LABEL,
          status: 'completed', // this page does not load before this step is complete
        },
        {
          item: 'crewDetails',
          link: `${VOYAGE_CREW_UPLOAD_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`,
          label: CREW_DETAILS_LABEL,
          status: response.data.FAL5 ? 'completed' : 'required',
        },
        {
          item: 'passengerDetails',
          link: `${VOYAGE_PASSENGERS_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`,
          label: PASSENGER_DETAILS_LABEL,
          status: response.data.FAL6 ? 'completed' : 'required',
        },
        {
          item: 'supportingDocuments',
          link: `${VOYAGE_SUPPORTING_DOCS_UPLOAD_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`,
          label: SUPPORTING_DOCUMENTS_LABEL,
          status: 'optional',
        },
      ];

      setStep(updatedStatuses);

      if (response.data.FAL1 && response.data.FAL5 && response.data.FAL6) {
        setCompletedSections(1);
        setCheckYourAnswersStep({ ...checkYourAnswersStep, status: 'notStarted' });
      } else {
        setCompletedSections(0);
        setCheckYourAnswersStep({ ...checkYourAnswersStep, status: 'cannotStartYet' });
      }
    } else {
      switch (response?.status) {
        case 401:
        case 422:
          Auth.removeToken();
          navigate(SIGN_IN_URL, { state: { redirectURL: `${VOYAGE_TASK_LIST_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}` } });
          break;
        default: navigate(MESSAGE_URL, {
          state: {
            title: 'Something has gone wrong',
            message: response?.message,
            redirectURL: YOUR_VOYAGES_URL,
          },
        });
      }
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (declarationId) {
      setIsLoading(true);
      updateDeclarationData();
    }
  }, [declarationId]);

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
            <p className="govuk-body"><strong>Ship name: </strong>{declarationData?.FAL1?.nameOfShip}</p>
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
                {
                  steps.map((item) => (
                    <li key={item.label} className="app-task-list__item">
                      <Link to={item.link}>
                        <span>{item.label}</span>
                        <strong className={CLASSES_FOR_STATUS[item.status]}>{LABELS_FOR_STATUS[item.status]}</strong>
                      </Link>
                    </li>
                  ))
                }
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
                        <strong className={CLASSES_FOR_STATUS[checkYourAnswersStep.status]}>{LABELS_FOR_STATUS[checkYourAnswersStep.status]}</strong>
                      </div>
                    )}
                  {checkYourAnswersStep.status !== 'cannotStartYet'
                    && (
                      <Link to={checkYourAnswersStep.link}>
                        <span>Check answers and submit</span>
                        <strong className={CLASSES_FOR_STATUS[checkYourAnswersStep.status]}>{LABELS_FOR_STATUS[checkYourAnswersStep.status]}</strong>
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
