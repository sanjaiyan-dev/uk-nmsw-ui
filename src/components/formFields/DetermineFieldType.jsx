import PropTypes from 'prop-types';
import {
  FIELD_EMAIL,
  FIELD_PASSWORD
} from '../../constants/AppConstants';
import InputText from './InputText';

const determineFieldType = ({ error, fieldDetails, parentHandleChange }) => {
  let fieldToReturn;
  switch (fieldDetails.type) {

    case FIELD_EMAIL: fieldToReturn =
      <InputText
        autoComplete='email'
        fieldDetails={fieldDetails}
        handleChange={parentHandleChange}
        type={FIELD_EMAIL}
      />;
      break;

    case FIELD_PASSWORD: fieldToReturn =
      <InputText
        fieldDetails={fieldDetails}
        handleChange={parentHandleChange}
        type={FIELD_PASSWORD}
      />;
      break;

    default: fieldToReturn = null;
  }

  return (
    <div className="govuk-form-group">
      <label className="govuk-label" htmlFor={`${fieldDetails.fieldName}-input`}>
        {fieldDetails.label}
      </label>
      <div id="email-hint" className="govuk-hint">
        {fieldDetails.hint}
      </div>
      <p id={`${fieldDetails.fieldName}-error`} className="govuk-error-message">
        <span className="govuk-visually-hidden">Error:</span> {error}
      </p>
      {fieldToReturn}
    </div>
  );
};

export default determineFieldType;

determineFieldType.propTypes = {
  error: PropTypes.string,
  fieldDetails: PropTypes.objectOf(
    PropTypes.shape({
      disabled: PropTypes.bool,
      fieldName: PropTypes.string.isRequired,
      hint: PropTypes.string,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      value: PropTypes.string,
    }),
  ),
  parentHandleChange: PropTypes.func.isRequired,
};
