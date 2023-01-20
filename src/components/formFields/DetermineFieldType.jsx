import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  DISPLAY_DETAILS,
  DISPLAY_GROUPED,
  DISPLAY_SINGLE,
  FIELD_AUTOCOMPLETE,
  FIELD_CONDITIONAL,
  FIELD_EMAIL,
  FIELD_PASSWORD,
  FIELD_PHONE,
  FIELD_TEXT,
  FIELD_RADIO,
} from '../../constants/AppConstants';
import InputAutocomplete from './InputAutocomplete';
import InputConditional from './InputConditional';
import InputPhoneNumber from './InputPhoneNumber';
import InputRadio from './InputRadio';
import InputText from './InputText';

const DetailsInput = ({
  error, fieldName, fieldToReturn, hint, label, linkText,
}) => {
  /*
   * isOpen needs to be set to state so that it persists
   * the open state even when errors clear
   * If we did open={!!error} within the details tag
   * then when the user starts typing in the field and the
   * error clears, it would become open=false
   * and the details component would close
   */
  const [isOpen, setIsOpen] = useState();

  useEffect(() => {
    if (error) {
      setIsOpen(true);
    }
  }, [error]);

  return (
    <div className={error ? 'govuk-form-group govuk-form-group--error' : 'govuk-form-group'}>
      <details className="govuk-details" data-module="govuk-details" data-testid="details-component" open={isOpen}>
        <summary className="govuk-details__summary">
          <span className="govuk-details__summary-text">
            {linkText}
          </span>
        </summary>
        <div className="govuk-details__text">
          <label className="govuk-label" htmlFor={`${fieldName}-input`}>
            {label}
          </label>
          <div id={`${fieldName}-hint`} className="govuk-hint">
            {hint}
          </div>
          <p id={`${fieldName}-error`} className="govuk-error-message">
            <span className="govuk-visually-hidden">Error:</span> {error}
          </p>
          {fieldToReturn}
        </div>
      </details>
    </div>
  );
};

const GroupedInputs = ({
  error, fieldName, fieldToReturn, hint, label,
}) => (
  <div className={error ? 'govuk-form-group govuk-form-group--error' : 'govuk-form-group'}>
    <fieldset className="govuk-fieldset">
      <legend className="govuk-fieldset__legend">
        {label}
      </legend>
      <div id={`${fieldName}-hint`} className="govuk-hint">
        {hint}
      </div>
      <p id={`${fieldName}-error`} className="govuk-error-message">
        <span className="govuk-visually-hidden">Error:</span> {error}
      </p>
      {fieldToReturn}
    </fieldset>
  </div>
);

const SingleInput = ({
  error, fieldName, fieldToReturn, hint, label,
}) => (
  <div className={error ? 'govuk-form-group govuk-form-group--error' : 'govuk-form-group'}>
    <label className="govuk-label" htmlFor={`${fieldName}-input`}>
      {label}
    </label>
    <div id={`${fieldName}-hint`} className="govuk-hint">
      {hint}
    </div>
    <p id={`${fieldName}-error`} className="govuk-error-message">
      <span className="govuk-visually-hidden">Error:</span> {error}
    </p>
    {fieldToReturn}
  </div>
);

const determineFieldType = ({
  allErrors, error, fieldDetails, parentHandleChange,
}) => {
  const displayType = fieldDetails.displayType ? fieldDetails.displayType : DISPLAY_SINGLE;
  let fieldToReturn;
  switch (fieldDetails.type) {
    case FIELD_AUTOCOMPLETE: fieldToReturn = (
      <InputAutocomplete
        error={error} // if error true, error styling applied to input
        fieldDetails={fieldDetails}
        handleChange={parentHandleChange}
        type="autocomplete"
      />
    );
      break;

    case FIELD_CONDITIONAL: fieldToReturn = (
      <InputConditional
        errors={allErrors} // allows us to add the error handling logic for conditional fields only on those fields
        fieldDetails={fieldDetails}
        handleChange={parentHandleChange}
      />
    );
      break;

    case FIELD_EMAIL: fieldToReturn = (
      <InputText
        autoComplete="email"
        error={error} // if error true, error styling applied to input
        fieldDetails={fieldDetails}
        handleChange={parentHandleChange}
        type="email"
      />
    );
      break;

    case FIELD_PASSWORD: fieldToReturn = (
      <InputText
        error={error}
        fieldDetails={fieldDetails}
        handleChange={parentHandleChange}
        type="password"
        dataTestid={`${fieldDetails.fieldName}-passwordField`}
      />
    );
      break;

    case FIELD_PHONE: fieldToReturn = (
      <InputPhoneNumber
        error={error}
        fieldDetails={fieldDetails}
        handleChange={parentHandleChange}
      />
    );
      break;

    case FIELD_RADIO: fieldToReturn = (
      <InputRadio
        // there is no input level error styling on a radio button so we do not pass error down here
        fieldDetails={fieldDetails}
        handleChange={parentHandleChange}
        type="radio"
      />
    );
      break;

    case FIELD_TEXT: fieldToReturn = (
      <InputText
        error={error}
        fieldDetails={fieldDetails}
        handleChange={parentHandleChange}
        type="text"
      />
    );
      break;

    default: fieldToReturn = null;
  }

  return (
    <>
      {displayType === DISPLAY_DETAILS
        && (
          <DetailsInput
            allErrors={allErrors}
            error={error}
            fieldName={fieldDetails.fieldName}
            fieldToReturn={fieldToReturn}
            hint={fieldDetails.hint}
            label={fieldDetails.label}
            linkText={fieldDetails.linkText}
          />
        )}
      {displayType === DISPLAY_GROUPED
        && (
          <GroupedInputs
            allErrors={allErrors}
            error={error}
            fieldName={fieldDetails.fieldName}
            fieldToReturn={fieldToReturn}
            hint={fieldDetails.hint}
            label={fieldDetails.label}
          />
        )}
      {displayType === DISPLAY_SINGLE
        && (
          <SingleInput
            error={error}
            fieldName={fieldDetails.fieldName}
            fieldToReturn={fieldToReturn}
            hint={fieldDetails.hint}
            label={fieldDetails.label}
          />
        )}
    </>
  );
};

export default determineFieldType;

determineFieldType.propTypes = {
  allErrors: PropTypes.array,
  error: PropTypes.string,
  fieldDetails: PropTypes.objectOf(
    PropTypes.shape({
      fieldName: PropTypes.string.isRequired,
      hint: PropTypes.string,
      label: PropTypes.string.isRequired,
      linkText: PropTypes.string,
      type: PropTypes.string.isRequired,
      value: PropTypes.string,
    }),
  ),
  parentHandleChange: PropTypes.func.isRequired,
};

DetailsInput.propTypes = {
  error: PropTypes.string,
  fieldName: PropTypes.string.isRequired,
  fieldToReturn: PropTypes.object.isRequired,
  hint: PropTypes.string,
  label: PropTypes.string.isRequired,
  linkText: PropTypes.string.isRequired,
};

GroupedInputs.propTypes = {
  error: PropTypes.string,
  fieldName: PropTypes.string.isRequired,
  fieldToReturn: PropTypes.object.isRequired,
  hint: PropTypes.string,
  label: PropTypes.string.isRequired,
};

SingleInput.propTypes = {
  error: PropTypes.string,
  fieldName: PropTypes.string.isRequired,
  fieldToReturn: PropTypes.object.isRequired,
  hint: PropTypes.string,
  label: PropTypes.string.isRequired,
};
