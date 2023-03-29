import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  DISPLAY_GROUPED,
  FIELD_RADIO,
  SINGLE_PAGE_FORM,
  VALIDATE_REQUIRED,
} from '../../constants/AppConstants';
import { URL_DECLARATIONID_IDENTIFIER, VOYAGE_TASK_LIST_URL, YOUR_VOYAGES_URL } from '../../constants/AppUrlConstants';
import DisplayForm from '../../components/DisplayForm';
import Message from '../../components/Message';

const VoyageDeleteDraftCheck = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const declarationId = searchParams.get(URL_DECLARATIONID_IDENTIFIER);

  document.title = 'Delete voyage';

  const formActions = {
    submit: {
      label: 'Confirm',
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
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Select yes if you want to delete your draft report',
        },
      ],
    },
  ];

  const handleSubmit = (formData) => {
    if (formData?.formData?.deleteDraft === 'deleteDraftYes') {
      navigate(YOUR_VOYAGES_URL, { state: { confirmationBanner: { message: `Report for ${state?.shipName} deleted.` } } });
    } else if (formData?.formData?.deleteDraft === 'deleteDraftNo') {
      navigate(`${VOYAGE_TASK_LIST_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`);
    }
  };

  if (!declarationId) {
    return (
      <Message title="Something has gone wrong" redirectURL={YOUR_VOYAGES_URL} />
    );
  }

  console.log('Delete draft page, declaration id', declarationId);

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
