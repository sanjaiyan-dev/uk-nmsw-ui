import PropTypes from 'prop-types';

const InputText = ({ autoComplete, dataTestid, fieldDetails, handleChange, type }) => {

  return (
    <input
      className="govuk-input"
      id={`${fieldDetails.fieldName}-input`}
      data-testid={dataTestid}
      name={fieldDetails.fieldName}
      type={type}
      autoComplete={autoComplete}
      onChange={handleChange}
      aria-describedby={fieldDetails.hint ? `${fieldDetails.fieldName}-hint` : null}
    />
  );
};

InputText.propTypes = {
  autoComplete: PropTypes.string,
  dataTestid: PropTypes.string,
  fieldDetails: PropTypes.shape({
    fieldName: PropTypes.string.isRequired,
    hint: PropTypes.string,
    value: PropTypes.string,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export default InputText;
