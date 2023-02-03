import { useLocation, useNavigate } from 'react-router-dom';
import { DISPLAY_GROUPED, FIELD_RADIO, SINGLE_PAGE_FORM } from '../../constants/AppConstants';
import { VOYAGE_TASK_LIST_URL, YOUR_VOYAGES_URL } from '../../constants/AppUrlConstants';
import DisplayForm from '../../components/DisplayForm';
import Message from '../../components/Message';

const VoyageDeleteDraftCheck = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const formActions = {
    submit: {
      className: 'govuk-button',
      dataModule: 'govuk-button',
      dataTestid: 'submit-button',
      label: 'Confirm',
      type: 'button',
    },
  };
  const formFields = [
    {
      type: FIELD_RADIO,
      label: 'Are you sure you want to delete the draft?',
      labelAsH1: true,
      fieldName: 'deleteDraft',
      className: 'govuk-radios--inline',
      displayType: DISPLAY_GROUPED,
      radioOptions: [
        {
          label: 'Yes',
          name: 'deleteDraft',
          id: 'yes',
          value: 'deleteDraftYes',
        },
        {
          label: 'No',
          name: 'deleteDraft',
          id: 'no',
          value: 'deleteDraftNo',
        },
      ],
    },
  ];

  const handleSubmit = (formData) => {
    if (formData?.formData?.deleteDraft === 'deleteDraftYes') {
      navigate(YOUR_VOYAGES_URL, { state: { confirmationBanner: { message: `Report for ${state?.shipName} deleted.` } } });
    } else if (formData?.formData?.deleteDraft === 'deleteDraftNo') {
      navigate(VOYAGE_TASK_LIST_URL);
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

export default VoyageDeleteDraftCheck;
