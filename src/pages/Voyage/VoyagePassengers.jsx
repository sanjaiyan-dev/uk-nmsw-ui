import { useLocation, useNavigate } from 'react-router-dom';
import {
  DISPLAY_GROUPED,
  FIELD_RADIO,
  SINGLE_PAGE_FORM,
} from '../../constants/AppConstants';
import DisplayForm from '../../components/DisplayForm';
import { VOYAGE_PASSENGER_UPLOAD_URL, VOYAGE_TASK_LIST_URL, YOUR_VOYAGES_URL } from '../../constants/AppUrlConstants';
import Message from '../../components/Message';

const VoyagePassengers = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  document.title = 'Is the ship carrying any passengers?';

  const formActions = {
    submit: {
      className: 'govuk-button',
      dataModule: 'govuk-button',
      dataTestid: 'submit-button',
      label: 'Save and continue',
      type: 'button',
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
      navigate(VOYAGE_PASSENGER_UPLOAD_URL, { state: { declarationId: state?.declarationId } });
    } else if (formData?.formData?.passengers === 'passengersNo') {
      navigate(VOYAGE_TASK_LIST_URL, { state: { declarationId: state?.declarationId } });
    }
  };

  if (!state?.declarationId) {
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
