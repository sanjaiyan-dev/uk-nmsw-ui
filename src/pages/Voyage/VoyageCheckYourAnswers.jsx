import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import LoadingSpinner from '../../components/LoadingSpinner';
import Message from '../../components/Message';
import { countries } from '../../constants/CountryData';
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
import GetDeclaration from '../../utils/GetDeclaration';

const VoyageCheckYourAnswers = () => {
  dayjs.extend(customParseFormat);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const declarationId = searchParams.get(URL_DECLARATIONID_IDENTIFIER);
  const [isLoading, setIsLoading] = useState(false);
  const [voyageDetails, setVoyageDetails] = useState([]);
  const [fal5Details, setFal5Details] = useState({
    fal5Name: '',
    fal5FileLink: '',
  });
  const [fal6Details, setFal6Details] = useState({
    fal6Name: '',
    fal6FileLink: '',
  });

  document.title = 'Check your answers';

  const getFalName = (URL) => {
    // Splits BE file link after the last dash /
    const falNameStep1 = URL?.split('/').pop();
    // Splits the file name further so it gets everything before the ?
    const falNameStep2 = falNameStep1?.split('?')[0];
    // Decodes the encoded URL so only the file name is left
    const falName = decodeURI(falNameStep2);
    return falName;
  };

  // values of this array will be populated by GET request when available
  const uploadedDocuments = [
    {
      id: 'crewDetails',
      title: 'Crew details',
      value: fal5Details?.fal5Name ? fal5Details?.fal5Name : '',
      fileLink: fal5Details?.fal5FileLink ? fal5Details?.fal5FileLink : '',
      changeLink: `${VOYAGE_CREW_UPLOAD_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`,
    },
    {
      id: 'passengerDetails',
      title: 'Passenger details',
      value: fal6Details?.fal6Name ? fal6Details?.fal6Name : '',
      fileLink: fal6Details?.fal6FileLink ? fal6Details?.fal6FileLink : '',
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

      setFal5Details({
        fal5Name: getFalName(response?.data?.FAL5),
        fal5FileLink: response?.data?.FAL5,
      });

      if (response.data.FAL6) {
        setFal6Details({
          fal6Name: getFalName(response?.data?.FAL6),
          fal6FileLink: response?.data?.FAL6,
        });
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

  const handleSubmit = () => {
    console.log('submit clicked for id', declarationId);
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
