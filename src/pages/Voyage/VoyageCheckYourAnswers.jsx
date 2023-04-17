import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DECLARATION_STATUS_PRESUBMITTED } from '../../constants/AppConstants';
import { API_URL, ENDPOINT_DECLARATION_PATH, TOKEN_EXPIRED } from '../../constants/AppAPIConstants';
import {
  MESSAGE_URL,
  SIGN_IN_URL,
  URL_DECLARATIONID_IDENTIFIER,
  VOYAGE_CHECK_YOUR_ANSWERS,
  VOYAGE_CREW_UPLOAD_URL,
  VOYAGE_GENERAL_DECLARATION_UPLOAD_URL,
  VOYAGE_PASSENGERS_URL,
  VOYAGE_SUPPORTING_DOCS_UPLOAD_URL,
  YOUR_VOYAGES_URL,
} from '../../constants/AppUrlConstants';
import { countries } from '../../constants/CountryData';
import ConfirmationMessage from '../../components/ConfirmationMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import Message from '../../components/Message';
import GetDeclaration from '../../utils/GetDeclaration';
import Auth from '../../utils/Auth';
import { scrollToElementId, scrollToTop } from '../../utils/ScrollToElement';

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
  const [errors, setErrors] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [voyageDetails, setVoyageDetails] = useState([]);
  const [fal5Details, setFal5Details] = useState();
  const [fal6Details, setFal6Details] = useState();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const errorsExist = !!errors;

  document.title = 'Check your answers';

  const uploadedDocuments = [
    {
      id: 'crewDetails',
      title: 'Crew details',
      value: fal5Details?.filename ? fal5Details?.filename : '',
      fileLink: fal5Details?.url ? fal5Details?.url : '',
      changeLink: `${VOYAGE_CREW_UPLOAD_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`,
    },
    {
      id: 'passengerDetails',
      title: 'Passenger details',
      value: fal6Details?.filename ? fal6Details?.filename : '',
      fileLink: fal6Details?.url ? fal6Details?.url : '',
      changeLink: `${VOYAGE_PASSENGERS_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`,
      noFileText: 'No passenger details provided',
    },
    {
      id: 'supportingDocuments',
      title: 'Supporting documents',
      value: '',
      fileLink: '',
      changeLink: `${VOYAGE_SUPPORTING_DOCS_UPLOAD_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`,
      noFileText: 'No supporting documents provided',
    },
  ];

  /* until we have a unlocode lookup API we need to format it here */
  const formatUnlocode = (code) => {
    const formattedCode = `${code.substr(0, 2)} ${code.substr(2)}`;
    return formattedCode;
  };

  /* until we have a country lookup API we need to map the code to name here */
  const formatCountry = (code) => {
    const result = countries.find((country) => country.alphaCode === code);
    const countryName = result?.countryName ? result.countryName : code;
    return countryName;
  };

  const updateDeclarationData = async () => {
    const response = await GetDeclaration({ declarationId });
    if (response.data) {
      setDeclarationData(response.data);
      setVoyageDetails([
        {
          title: 'Voyage type',
          value: response.data.FAL1.departureFromUk ? 'Departure from the UK' : 'Arrival to the UK',
        },
        {
          title: 'Ship name',
          value: response.data.FAL1.nameOfShip,
        },
        {
          title: 'IMO number',
          value: response.data.FAL1.imoNumber,
        },
        {
          title: 'Call sign',
          value: response.data.FAL1.callSign,
        },
        {
          title: 'Flag state of ship',
          value: formatCountry(response.data.FAL1.flagState),
        },
        {
          title: 'Departure details',
          value: [
            {
              label: 'Departure port LOCODE',
              item: formatUnlocode(response.data.FAL1.departurePortUnlocode),
            },
            {
              label: 'Date of departure',
              item: dayjs(response.data.FAL1.departureDate).format('DD MMMM YYYY'),
            },
            {
              label: 'Time of departure',
              item: dayjs(response.data.FAL1.departureTime, 'HH:mm:ss').format('HH:mm'),
            },
          ],
        },
        {
          title: 'Arrival details',
          value: [
            {
              label: 'Arrival port LOCODE',
              item: formatUnlocode(response.data.FAL1.arrivalPortUnlocode),
            },
            {
              label: 'Date of arrival',
              item: dayjs(response.data.FAL1.arrivalDate).format('DD MMMM YYYY'),
            },
            {
              label: 'Time of arrival',
              item: dayjs(response.data.FAL1.arrivalTime, 'HH:mm:ss').format('HH:mm'),
            },
          ],
        },
        {
          title: 'Next port of call',
          value: formatUnlocode(response.data.FAL1.nextPortUnlocode),
        },
        {
          title: 'Brief description of the cargo',
          value: response.data.FAL1.cargo,
        },
      ]);

      setFal5Details(response.data?.FAL5[0]);

      if (response.data?.FAL6) {
        setFal6Details(response.data?.FAL6[0]);
      }

      setIsLoading(false);
    } else {
      switch (response?.status) {
        case 401:
        case 422:
          navigate(SIGN_IN_URL, { state: { redirectURL: `${VOYAGE_CHECK_YOUR_ANSWERS}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}` } });
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

  const handleSubmit = async () => {
    console.log('submit');
    // SUBMIT
    // send a PATCH to /declaration/<declarationId>
    // take user to confirmation page

    /* TODO: NMSW-555
     * If a user types the url for the CYA page into the address bar with a valid declarationId for their account
     * AND they have not uploaded a FAL1 the page will error as the GET request fails
     * IF they have not uploaded a FAL5
     * AND/OR they have not answered the 'do you have passengers' question
     * AND/OR they have answered yes to passengers and not uploaded a FAL6
     * AND they click submit the submission should fail as it's required
     */

    /* CURRENTLY - do not know what the API returns if we're missing these items
     * we may need to handle this now
     * we may be able to use the API response as the trigger
     */
    if (declarationData.FAL1.passengers && declarationData?.FAL6.length === 0) {
      setErrors([{
        name: 'passengerDetails',
        message: 'Passenger details (FAL 6) upload is required for ships carrying passengers',
      }]);
      scrollToTop();
      errorSummaryRef?.current?.focus();
    } else {
      try {
        const response = await axios.patch(`${API_URL}${ENDPOINT_DECLARATION_PATH}/${declarationId}`, { status: DECLARATION_STATUS_PRESUBMITTED }, {
          headers: { Authorization: `Bearer ${Auth.retrieveToken()}` },
        });
        if (response.status === 200) {
          setShowConfirmation(true);
          scrollToTop();
        }
      } catch (err) {
        if (err?.response?.status === 422 || err?.response?.data?.msg === TOKEN_EXPIRED) {
          Auth.removeToken();
          navigate(SIGN_IN_URL, { state: { redirectURL: `${VOYAGE_CHECK_YOUR_ANSWERS}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}` } });
        } else {
          // 500 errors will fall into this bucket
          navigate(MESSAGE_URL, { state: { title: 'Something has gone wrong', message: err.response?.data?.message, redirectURL: `${VOYAGE_CHECK_YOUR_ANSWERS}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}` } });
        }
      } finally {
        setIsLoading(false);
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
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          {errors?.length > 0 && (
            <div className="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" data-module="govuk-error-summary" ref={errorSummaryRef} tabIndex={-1}>
              <h2 className="govuk-error-summary__title" id="error-summary-title">
                There is a problem
              </h2>
              <div className="govuk-error-summary__body">
                <ul className="govuk-list govuk-error-summary__list">
                  {errors.map((error) => (
                    <li key={error.name}>
                      <button
                        className="govuk-button--text"
                        type="button"
                        onClick={(e) => { e.preventDefault(); scrollToElementId('passengerDetails'); }}
                      >
                        {error.message}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        <div className="govuk-grid-column-full">
          <h1 className="govuk-heading-xl">Check your answers</h1>
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <dl className="govuk-summary-list govuk-!-margin-bottom-9">
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">
                <h2 id="voyageDetails" className="govuk-heading-m">Voyage details</h2>
              </dt>
              <dd className="govuk-summary-list__value" />
              <dd className="govuk-summary-list__actions">
                <Link
                  className="govuk-link"
                  to={`${VOYAGE_GENERAL_DECLARATION_UPLOAD_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`}
                  aria-describedby="voyageDetails"
                >
                  Change<span className="govuk-visually-hidden"> change voyage details</span>
                </Link>
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
                        <React.Fragment key={subItem.label}>
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

          <h2 className="govuk-heading-m">Uploaded documents</h2>
          <dl className="govuk-summary-list govuk-!-margin-bottom-9">
            {uploadedDocuments.map((item) => (
              <div key={item.id} className="govuk-summary-list__row">
                <dt id={item.id} className="govuk-summary-list__key">
                  {item.title}
                </dt>
                <dd className="govuk-summary-list__value">
                  {item.fileLink ? <a className="govuk-link" href={item.fileLink} download>{item.value}</a> : item.noFileText}
                </dd>
                <dd className="govuk-summary-list__actions">
                  <Link
                    className="govuk-link"
                    to={item.changeLink}
                    aria-describedby={item.id}
                  >
                    Change<span className="govuk-visually-hidden">{` change ${item.title}`}</span>
                  </Link>
                </dd>
              </div>
            ))}
          </dl>

          <h2 className="govuk-heading-m">Now send your application</h2>
          <p className="govuk-body">By submitting this application you are confirming that, to the best of your knowledge, the details you are providing are correct.</p>

          <button
            type="button"
            className="govuk-button"
            data-module="govuk-button"
            onClick={() => handleSubmit()}
          >
            Save and submit
          </button>
        </div>
      </div>
    </>
  );
};

export default VoyageCheckYourAnswers;
