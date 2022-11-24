import { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { FIELD_RADIO, FIELD_TEXT } from '../../constants/AppConstants';

const RadioField = ({ fieldName, hint, index, label, name, value, handleChange }) => {
  return (
    <div className="govuk-radios__item">
      <input
        aria-describedby={hint ? `${fieldName}${name}-hint` : null}
        className="govuk-radios__input"
        id={`${name}-input[${index}]`}
        name={name}
        type={FIELD_RADIO}
        value={value}
        onChange={handleChange}
      />
      <label className="govuk-label govuk-radios__label" htmlFor={`${name}-input[${index}]`}>
        {label}
      </label>
    </div>
  );
};

const TextField = ({ fieldName, hint, isVisible, label, handleChange }) => {
  return (
    <div className={isVisible ? 'govuk-radios__conditional' : 'govuk-radios__conditional govuk-radios__conditional--hidden'}>
      <div className='govuk-form-group'>
        <label className="govuk-label" htmlFor={`${fieldName}-input`}>
          {label}
        </label>
        <input
          aria-describedby={hint ? `${fieldName}-hint` : null}
          className="govuk-input  govuk-!-width-one-third"
          id={`${fieldName}-input`}
          name={fieldName}
          type={FIELD_TEXT}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};


const InputConditional = ({ fieldDetails, handleChange }) => {
  const [checkedItem, setCheckedItem] = useState();

  const wrapHandleChange = async (e) => {
    if (e.target.type === FIELD_RADIO) {
      setCheckedItem(e.target.value);
    }
    handleChange(e);
  };

  return (
    <div className={fieldDetails.className} data-module="govuk-radios">
      {(fieldDetails.radioOptions).map((option, index) => {
        const isVisible = checkedItem === option.parentFieldValue ? true : false;

        return (
          <Fragment key={`${option.name}-input[${index}]`}>
            {
              option.radioField ?
                <RadioField
                  fieldName={fieldDetails.fieldName}
                  hint={option.hint}
                  index={index}
                  label={option.label}
                  name={option.name}
                  value={option.value}
                  handleChange={wrapHandleChange}
                />
                :
                <TextField
                  fieldName={option.name}
                  hint={option.hint}
                  isVisible={isVisible}
                  label={option.label}
                  handleChange={wrapHandleChange}
                />
            }
          </Fragment>
        );
      })}
    </div>
  );
};

RadioField.propTypes = {
  fieldName: PropTypes.string.isRequired,
  hint: PropTypes.string,
  index: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};

TextField.propTypes = {
  fieldName: PropTypes.string.isRequired,
  hint: PropTypes.string,
  isVisible: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};

InputConditional.propTypes = {
  fieldDetails: PropTypes.shape({
    className: PropTypes.string, // allows us to pass an inline style
    fieldName: PropTypes.string.isRequired,
    hint: PropTypes.string,
    radioOptions: PropTypes.arrayOf(
      PropTypes.shape({
        radioField: PropTypes.bool.isRequired,
        name: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        value: PropTypes.string,
      })).isRequired,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default InputConditional;
