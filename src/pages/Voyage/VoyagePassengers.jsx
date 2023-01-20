import { useNavigate } from 'react-router-dom';
import {
  DISPLAY_GROUPED,
  FIELD_RADIO,
  SINGLE_PAGE_FORM,
} from '../../constants/AppConstants';
import DisplayForm from '../../components/DisplayForm';
import { VOYAGE_PASSENGER_UPLOAD_URL, VOYAGE_TASK_LIST_URL } from '../../constants/AppUrlConstants';

const VoyagePassengers = () => {
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
      navigate(VOYAGE_PASSENGER_UPLOAD_URL);
    } else if (formData?.formData?.passengers === 'passengersNo') {
      navigate(VOYAGE_TASK_LIST_URL);
    }
  };

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
