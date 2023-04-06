import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import {
  DISPLAY_GROUPED,
  FIELD_RADIO,
  SINGLE_PAGE_FORM,
  VALIDATE_REQUIRED,
} from '../../constants/AppConstants';
import {
  SIGN_IN_URL,
  URL_DECLARATIONID_IDENTIFIER,
  VOYAGE_PASSENGERS_URL,
  VOYAGE_PASSENGER_UPLOAD_URL,
  VOYAGE_TASK_LIST_URL,
  YOUR_VOYAGES_URL,
} from '../../constants/AppUrlConstants';
import {
  API_URL,
  ENDPOINT_DECLARATION_PATH,
  TOKEN_EXPIRED,
} from '../../constants/AppAPIConstants';
import Auth from '../../utils/Auth';
import DisplayForm from '../../components/DisplayForm';
import Message from '../../components/Message';

const VoyagePassengers = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const declarationId = searchParams.get(URL_DECLARATIONID_IDENTIFIER);
  const [isError, setIsError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  document.title = 'Is the ship carrying any passengers?';

  const formActions = {
    submit: {
      label: 'Save and continue',
    },
  };
  const formFields = [
    {
      type: FIELD_RADIO,
      label: 'Is the ship carrying any passengers?',
      labelAsH1: true,
      fieldName: 'passengers',
      className: 'govuk-radios--inline',
      displayType: DISPLAY_GROUPED,
      radioOptions: [
        {
          label: 'Yes',
          name: 'passengers',
          id: 'yes',
          value: 'passengersYes',
        },
        {
          label: 'No',
          name: 'passengers',
          id: 'no',
          value: 'passengersNo',
        },
      ],
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Select yes if the ship is carrying any passengers',
        },
      ],
    },
  ];

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    let isPassengers;
    if (formData?.formData?.passengers === 'passengersYes') {
      isPassengers = { passengers: true };
    } else if (formData?.formData?.passengers === 'passengersNo') {
      isPassengers = { passengers: false };
    }

    try {
      const response = await axios.patch(`${API_URL}${ENDPOINT_DECLARATION_PATH}/${declarationId}`, isPassengers, {
        headers: { Authorization: `Bearer ${Auth.retrieveToken()}` },
      });
      if (response.status === 200 && response.data.passengers === true) {
        navigate(`${VOYAGE_PASSENGER_UPLOAD_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`);
      } else if (response.status === 200 && response.data.passengers === false) {
        navigate(`${VOYAGE_TASK_LIST_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`);
      }
    } catch (err) {
      if (err?.response?.status === 422) {
        Auth.removeToken();
        navigate(SIGN_IN_URL, { state: { redirectURL: `${VOYAGE_PASSENGERS_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}` } });
      } else if (err?.response?.data?.msg === TOKEN_EXPIRED) {
        Auth.removeToken();
        navigate(SIGN_IN_URL, { state: { redirectURL: `${VOYAGE_PASSENGERS_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}` } });
      } else {
        setIsError(true);
      }
    }
  };

  if (!declarationId || isError) {
    return (
      <Message title="Something has gone wrong" redirectURL={YOUR_VOYAGES_URL} />
    );
  }

  return (
    <DisplayForm
      formId="voyagePassengers"
      fields={formFields}
      formActions={formActions}
      formType={SINGLE_PAGE_FORM}
      isLoading={isLoading}
      handleSubmit={handleSubmit}
    />
  );
};

export default VoyagePassengers;
