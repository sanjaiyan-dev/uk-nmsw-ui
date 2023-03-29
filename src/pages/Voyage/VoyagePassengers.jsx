import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  DISPLAY_GROUPED,
  FIELD_RADIO,
  SINGLE_PAGE_FORM,
} from '../../constants/AppConstants';
import DisplayForm from '../../components/DisplayForm';
import {
  URL_DECLARATIONID_IDENTIFIER,
  VOYAGE_PASSENGER_UPLOAD_URL,
  VOYAGE_TASK_LIST_URL,
  YOUR_VOYAGES_URL,
} from '../../constants/AppUrlConstants';
import Message from '../../components/Message';

const VoyagePassengers = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const declarationId = searchParams.get(URL_DECLARATIONID_IDENTIFIER);
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
    },
  ];

  const handleSubmit = (formData) => {
    if (formData?.formData?.passengers === 'passengersYes') {
      navigate(`${VOYAGE_PASSENGER_UPLOAD_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`);
    } else if (formData?.formData?.passengers === 'passengersNo') {
      navigate(`${VOYAGE_TASK_LIST_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`);
    }
  };

  if (!declarationId) {
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
      handleSubmit={handleSubmit}
    />
  );
};

export default VoyagePassengers;
