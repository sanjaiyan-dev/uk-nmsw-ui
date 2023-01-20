import PropTypes from 'prop-types';

const InputRadio = ({
  autoComplete, fieldDetails, handleChange, type,
}) => (
  <div className={fieldDetails.className} data-module="govuk-radios">
    {(fieldDetails.radioOptions).map((option, index) => {
      const checkedState = fieldDetails.value === option.value ? true : option.checked;
      const id = `${option.name}-input[${index}]`;
      return (
        <div className="govuk-radios__item" key={id}>
          <input
            className="govuk-radios__input"
            id={id}
            autoComplete={autoComplete}
            name={option.name}
            value={option.value}
            type={type}
            onChange={handleChange}
            defaultChecked={checkedState}
            aria-describedby={option.hint ? `${fieldDetails.fieldName}${option.name}-hint` : null}
          />
          <label className="govuk-label govuk-radios__label" htmlFor={`${option.name}-input[${index}]`}>
            {option.label}
          </label>
        </div>
      );
    })}
  </div>
);

InputRadio.propTypes = {
  autoComplete: PropTypes.string,
  fieldDetails: PropTypes.shape({
    fieldName: PropTypes.string.isRequired,
    hint: PropTypes.string,
    className: PropTypes.string,
    radioOptions: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        checked: PropTypes.bool,
      }),
    ).isRequired,
    value: PropTypes.string,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export default InputRadio;
