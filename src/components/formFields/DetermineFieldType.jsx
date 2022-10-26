import PropTypes from 'prop-types';
import {
  FIELD_EMAIL,
  FIELD_PASSWORD,
  FIELD_TEXT,
  FIELD_RADIO
} from '../../constants/AppConstants';
import InputRadio from './InputRadio';
import InputText from './InputText';

const GroupedInputs = ({ error, fieldDetails, fieldToReturn }) => {
  return (
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
  );
};

const SingleInput = ({ error, fieldDetails, fieldToReturn }) => {
  return (
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
  );
};

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
        dataTestid={`${fieldDetails.fieldName}-passwordField`}
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
      {fieldDetails.grouped ? <GroupedInputs
        error={error}
        fieldDetails={fieldDetails}
        fieldToReturn={fieldToReturn}
      />
        :
        <SingleInput
          error={error}
          fieldDetails={fieldDetails}
          fieldToReturn={fieldToReturn}
        />
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

// TODO: Work out why the fieldDetails shape (looking like above) is erroring for Grouped and Single input and put it back in correctly

GroupedInputs.propTypes = {
  error: PropTypes.string,
  fieldDetails: PropTypes.object.isRequired,
  fieldToReturn: PropTypes.object.isRequired,
};

SingleInput.propTypes = {
  error: PropTypes.string,
  fieldDetails: PropTypes.object.isRequired,
  fieldToReturn: PropTypes.object.isRequired,
};
