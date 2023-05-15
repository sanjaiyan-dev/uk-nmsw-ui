import { useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL, ENDPOINT_DECLARATION_PATH } from '../../constants/AppAPIConstants';
import {
  DISPLAY_GROUPED,
  FIELD_RADIO,
  SINGLE_PAGE_FORM,
  VALIDATE_REQUIRED,
} from '../../constants/AppConstants';
import {
  MESSAGE_URL,
  URL_DECLARATIONID_IDENTIFIER,
  VOYAGE_TASK_LIST_URL,
  YOUR_VOYAGES_URL,
} from '../../constants/AppUrlConstants';
import DisplayForm from '../../components/DisplayForm';
import Message from '../../components/Message';
import Auth from '../../utils/Auth';
import handleAuthErrors from '../../utils/API/handleAuthErrors';

const VoyageDeleteDraftCheck = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const declarationId = searchParams.get(URL_DECLARATIONID_IDENTIFIER);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (formData) => {
    if (formData?.formData?.deleteDraft === 'deleteDraftYes') {
      setIsLoading(true);
      try {
        await axios({
          method: 'delete',
          url: `${API_URL}${ENDPOINT_DECLARATION_PATH}/${declarationId}`,
          headers: {
            Authorization: `Bearer ${Auth.retrieveToken()}`,
          },
        });
        navigate(YOUR_VOYAGES_URL, { state: { confirmationBanner: { message: `Report for ${state?.shipName} deleted.` } } });
      } catch (err) {
        switch (err?.response?.status) {
          case 401:
          case 422:
            handleAuthErrors({ error: err, navigate, redirectUrl: `${VOYAGE_TASK_LIST_URL}?report=${declarationId}` });
            break;
          default: navigate(MESSAGE_URL, {
            state: {
              title: 'Something has gone wrong',
              message: err?.response?.message,
              redirectURL: `${VOYAGE_TASK_LIST_URL}?report=${declarationId}`,
            },
          });
        }
      } finally {
        setIsLoading(false);
      }
    } else if (formData?.formData?.deleteDraft === 'deleteDraftNo') {
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
      isLoading={isLoading}
      handleSubmit={handleSubmit}
    />
  );
};

export default VoyageDeleteDraftCheck;
