import PropTypes from 'prop-types';
import {
  FIELD_EMAIL,
  FIELD_PASSWORD,
  FIELD_TEXT,
  FIELD_RADIO
} from '../../constants/AppConstants';
import InputRadio from './InputRadio';
import InputText from './InputText';

const determineFieldType = ({ error, fieldDetails, parentHandleChange }) => {
  let fieldToReturn;
  switch (fieldDetails.type) {

    case FIELD_EMAIL: fieldToReturn =
      <InputText
        autoComplete='email'
        fieldDetails={fieldDetails}
        handleChange={parentHandleChange}
        type='email'
      />;
      break;

    case FIELD_PASSWORD: fieldToReturn =
      <InputText
        fieldDetails={fieldDetails}
        handleChange={parentHandleChange}
        type='password'
        dataTestid='passwordField'
      />;
      break;

    case FIELD_TEXT: fieldToReturn =
      <InputText
        fieldDetails={fieldDetails}
        handleChange={parentHandleChange}
        type='text'
      />;
      break;

    case FIELD_RADIO: fieldToReturn =
      <InputRadio
        fieldDetails={fieldDetails}
        handleChange={parentHandleChange}
        type='radio'
      />;
      break;

    default: fieldToReturn = null;
  }

  return (
    <>
      {fieldDetails.grouped ?
        <div className="govuk-form-group">
          <fieldset className="govuk-fieldset">
            <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
              {fieldDetails.label}
            </legend>
            <div id={`${fieldDetails.fieldName}-hint`} className="govuk-hint">
              {fieldDetails.hint}
            </div>
            <p id={`${fieldDetails.fieldName}-error`} className="govuk-error-message">
              <span className="govuk-visually-hidden">Error:</span> {error}
            </p>
            {fieldToReturn}
          </fieldset>
        </div>
        :
        <div className="govuk-form-group">
          <label className="govuk-label" htmlFor={`${fieldDetails.fieldName}-input`}>
            {fieldDetails.label}
          </label>
          <div id={`${fieldDetails.fieldName}-hint`} className="govuk-hint">
            {fieldDetails.hint}
          </div>
          <p id={`${fieldDetails.fieldName}-error`} className="govuk-error-message">
            <span className="govuk-visually-hidden">Error:</span> {error}
          </p>
          {fieldToReturn}
        </div>
      }
    </>
  );
};

export default determineFieldType;

determineFieldType.propTypes = {
  error: PropTypes.string,
  fieldDetails: PropTypes.objectOf(
    PropTypes.shape({
      fieldName: PropTypes.string.isRequired,
      hint: PropTypes.string,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      value: PropTypes.string,
    }),
  ),
  parentHandleChange: PropTypes.func.isRequired,
};
