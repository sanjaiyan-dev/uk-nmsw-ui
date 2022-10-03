import PropTypes from 'prop-types';

const InputEmail = ({ error, fieldDetails, handleChange }) => {
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
      <input
        className="govuk-input"
        id={`${fieldDetails.fieldName}-input`}
        name={fieldDetails.fieldName}
        type="email"
        autoComplete='email'
        onChange={handleChange}
      />
    </div>
  );
};

InputEmail.propTypes = {
  error: PropTypes.string,
  fieldDetails: PropTypes.shape({
    disabled: PropTypes.bool,
    fieldName: PropTypes.string.isRequired,
    hint: PropTypes.string,
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
  }),
  handleChange: PropTypes.func.isRequired,
};

export default InputEmail;
