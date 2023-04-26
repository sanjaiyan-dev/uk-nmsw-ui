import PropTypes from 'prop-types';
import DisplayForm from '../../../components/DisplayForm';
import {
  DISPLAY_GROUPED,
  FIELD_RADIO,
  SINGLE_PAGE_FORM,
  VALIDATE_REQUIRED,
} from '../../../constants/AppConstants';

const VoyageCancelConfirmation = ({ isLoading, handleSubmit }) => {
  const formActions = {
    submit: {
      label: 'Confirm',
    },
  };
  const formFields = [
    {
      type: FIELD_RADIO,
      label: 'Are you sure you want to cancel the voyage report?',
      labelAsH1: true,
      fieldName: 'deleteVoyage',
      className: 'govuk-radios--inline',
      displayType: DISPLAY_GROUPED,
      radioOptions: [
        {
          label: 'Yes',
          name: 'deleteVoyage',
          id: 'yes',
          value: 'deleteVoyageYes',
        },
        {
          label: 'No',
          name: 'deleteVoyage',
          id: 'no',
          value: 'deleteVoyageNo',
        },
      ],
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Select yes if you want to delete your voyage report',
        },
      ],
    },
  ];

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

export default VoyageCancelConfirmation;

VoyageCancelConfirmation.propTypes = {
  isLoading: PropTypes.bool,
  handleSubmit: PropTypes.func,
};
