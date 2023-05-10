import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {
  DECLARATION_STATUS_DRAFT,
  DECLARATION_STATUS_PRECANCELLED,
  DECLARATION_STATUS_PRESUBMITTED,
} from '../../../constants/AppConstants';
import { API_URL, ENDPOINT_DECLARATION_PATH, TOKEN_EXPIRED } from '../../../constants/AppAPIConstants';
import {
  MESSAGE_URL,
  SIGN_IN_URL,
  URL_DECLARATIONID_IDENTIFIER,
  VOYAGE_CHECK_YOUR_ANSWERS,
  YOUR_VOYAGES_URL,
} from '../../../constants/AppUrlConstants';
import Auth from '../../../utils/Auth';
import GetDeclaration from '../../../utils/GetDeclaration';
import { scrollToTop } from '../../../utils/ScrollToElement';
import ConfirmationMessage from '../../../components/ConfirmationMessage';
import LoadingSpinner from '../../../components/LoadingSpinner';
import Message from '../../../components/Message';
import CYACallToActions from './CYACallToActions';
import CYAErrorSummary from './CYAErrorSummary';
import CYAGeneralDeclaration from './CYAGeneralDeclaration';
import CYAUploadedDocs from './CYAUploadedDocs';
import VoyageCancelConfirmation from './VoyageCancelConfirmation';

const SubmitConfirmation = () => (
  <>
    <h2 className="govuk-heading-m">What happens next</h2>
    <p className="govuk-body">We will send you an email that you can show to Border Force officers as proof that you have sent these reports.</p>
  </>
);

const VoyageCheckYourAnswers = () => {
  dayjs.extend(customParseFormat);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const declarationId = searchParams.get(URL_DECLARATIONID_IDENTIFIER);
  const errorSummaryRef = useRef(null);
  const [declarationData, setDeclarationData] = useState();
  const [declarationStatus, setDeclarationStatus] = useState();
  const [errors, setErrors] = useState();
  const [fal5Details, setFal5Details] = useState();
  const [fal6Details, setFal6Details] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isPendingCancel, setIsPendingCancel] = useState(false);
  const [isPendingSubmit, setIsPendingSubmit] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [supportingDocs, setSupportingDocs] = useState([]);
  const [generalDeclarationData, setGeneralDeclarationData] = useState();
  const errorsExist = !!errors;

  document.title = 'Check your answers';

  const updateDeclarationData = async () => {
    const response = await GetDeclaration({ declarationId });
    if (response.data) {
      setDeclarationData(response.data);
      setGeneralDeclarationData(response.data.FAL1);
      setFal5Details(response.data?.FAL5[0]);
      setFal6Details(response.data?.FAL6[0]);
      setSupportingDocs(response.data?.supporting);

      setDeclarationStatus({
        status: response.data?.FAL1.status,
        submissionDate: response.data?.FAL1.submissionDate ? dayjs(response.data?.FAL1.submissionDate).format('D MMMM YYYY') : null,
      });

      setIsLoading(false);
    } else {
      switch (response?.status) {
        case 401:
        case 422:
          navigate(SIGN_IN_URL, { state: { redirectURL: `${VOYAGE_CHECK_YOUR_ANSWERS}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}` } });
          break;
        default: {
          navigate(MESSAGE_URL, {
            state: {
              title: 'Something has gone wrong',
              message: response?.message,
              redirectURL: YOUR_VOYAGES_URL,
            },
          });
        }
      }
    }
    setIsLoading(false);
  };

  const checkForErrors = () => {
    /* If a user types the url for the CYA page into the address bar with a valid declarationId for their account
     * AND they have not uploaded a FAL1 the page will error as the GET request fails
     * IF they have not uploaded a FAL5 `!declarationData.FAL5.url`
     * AND/OR they have not answered the 'do you have passengers' question `declarationData.FAL1.passengers === 'null'`
     * AND/OR they have answered yes to passengers and not uploaded a FAL6 `declarationData.FAL1.passengers && !declarationData.FAL6.url`
     * AND they click submit the submission should fail as it's required
     */
    const sectionErrors = [];
    if (!declarationData.FAL5[0]?.url) {
      sectionErrors.push({
        name: 'crewDetails',
        message: 'Crew details (FAL 5) upload is required',
      });
    }
    if (declarationData.FAL1.passengers === null) {
      sectionErrors.push({
        name: 'passengerDetails',
        message: 'You need to provide passenger details, even if the ship is carrying no passengers',
      });
    }
    if (declarationData.FAL1.passengers && declarationData?.FAL6.length === 0) {
      sectionErrors.push({
        name: 'passengerDetails',
        message: 'Passenger details (FAL 6) upload is required for ships carrying passengers',
      });
    }
    return sectionErrors;
  };

  const handleSubmit = async () => {
    if (!declarationData.FAL5[0]?.url || declarationData.FAL1.passengers === null || (declarationData.FAL1.passengers && declarationData?.FAL6.length === 0)) {
      setErrors(checkForErrors);
      scrollToTop();
      errorSummaryRef?.current?.focus();
    } else {
      try {
        setIsPendingSubmit(true);
        await axios.patch(`${API_URL}${ENDPOINT_DECLARATION_PATH}/${declarationId}`, { status: DECLARATION_STATUS_PRESUBMITTED }, {
          headers: { Authorization: `Bearer ${Auth.retrieveToken()}` },
        });
        setShowConfirmation(true);
        scrollToTop();
      } catch (err) {
        if (err?.response?.status === 422 || err?.response?.data?.msg === TOKEN_EXPIRED) {
          Auth.removeToken();
          navigate(SIGN_IN_URL, { state: { redirectURL: `${VOYAGE_CHECK_YOUR_ANSWERS}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}` } });
        } else {
          // 500 errors will fall into this bucket
          navigate(MESSAGE_URL, { state: { title: 'Something has gone wrong', message: err.response?.data?.message, redirectURL: `${VOYAGE_CHECK_YOUR_ANSWERS}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}` } });
        }
      } finally {
        setIsPendingSubmit(false);
      }
    }
  };

  const checkCancelRequest = async () => {
    setIsPendingCancel(true);
  };

  const handleCancel = async (formData) => {
    if (formData.formData.deleteVoyage === 'deleteVoyageNo') {
      setIsPendingCancel(false);
    } else if (formData.formData.deleteVoyage === 'deleteVoyageYes') {
      setIsPendingSubmit(true);
      try {
        await axios.patch(`${API_URL}${ENDPOINT_DECLARATION_PATH}/${declarationId}`, { status: DECLARATION_STATUS_PRECANCELLED }, {
          headers: { Authorization: `Bearer ${Auth.retrieveToken()}` },
        });
        navigate(YOUR_VOYAGES_URL, { state: { confirmationBanner: { message: `Report for ${declarationData.FAL1.nameOfShip} cancelled.` } } });
      } catch (err) {
        if (err?.response?.status === 422 || err?.response?.data?.msg === TOKEN_EXPIRED) {
          Auth.removeToken();
          navigate(SIGN_IN_URL, { state: { redirectURL: `${VOYAGE_CHECK_YOUR_ANSWERS}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}` } });
        } else {
          // 500 errors will fall into this bucket
          navigate(MESSAGE_URL, { state: { title: 'Something has gone wrong', message: err.response?.data?.message, redirectURL: `${VOYAGE_CHECK_YOUR_ANSWERS}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}` } });
        }
      } finally {
        setIsPendingSubmit(false);
      }
    }
  };

  useEffect(() => {
    if (declarationId) {
      setIsLoading(true);
      updateDeclarationData();
    }
  }, [declarationId]);

  useEffect(() => {
    if (errorsExist) {
      errorSummaryRef?.current?.focus();
    }
  }, [errorsExist]);

  if (!declarationId) {
    return (
      <Message title="Something has gone wrong" redirectURL={YOUR_VOYAGES_URL} />
    );
  }

  if (isLoading) { return (<LoadingSpinner />); }
  if (!generalDeclarationData) { return null; }

  if (isPendingCancel) {
    return (
      <VoyageCancelConfirmation
        isLoading={isPendingSubmit}
        handleSubmit={handleCancel}
      />
    );
  }
  if (showConfirmation) {
    return (
      <ConfirmationMessage
        pageTitle="Voyage details submitted"
        confirmationMessage="Voyage details submitted"
        nextPageLink={YOUR_VOYAGES_URL}
        nextPageLinkText="Return to your voyages"
      >
        <SubmitConfirmation />
      </ConfirmationMessage>
    );
  }

  return (
    <>
      <CYAErrorSummary
        errors={errors}
        errorSummaryRef={errorSummaryRef}
        elementId="uploadedFalDocuments"
      />
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          {declarationStatus?.status === DECLARATION_STATUS_DRAFT && <h1 className="govuk-heading-xl">Check your answers</h1>}
          {declarationStatus?.status !== DECLARATION_STATUS_DRAFT && <h1 className="govuk-heading-xl">Review your report</h1>}
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <CYAGeneralDeclaration
            declarationId={declarationId}
            generalDeclarationData={generalDeclarationData}
          />

          <h2 id="uploadedFalDocuments" className="govuk-heading-m">Uploaded documents</h2>
          <CYAUploadedDocs
            declarationId={declarationId}
            declarationStatus={declarationStatus}
            fal5Details={fal5Details}
            fal6Details={fal6Details}
            supportingDocs={supportingDocs}
          />
          <CYACallToActions
            checkCancelRequest={checkCancelRequest}
            declarationStatus={declarationStatus}
            handleSubmit={handleSubmit}
            isPendingSubmit={isPendingSubmit}
          />
        </div>
      </div>
    </>
  );
};

export default VoyageCheckYourAnswers;
