import { useState } from 'react';
import PropTypes from 'prop-types';

const InputPhoneNumber = ({ error, fieldDetails, handleChange }) => {
  const countryCodeClassToApply = error ? 'govuk-input govuk-input--width-5 phoneNumber-input_country-code govuk-input--error' : 'govuk-input govuk-input--width-5 phoneNumber-input_country-code';
  const phoneNumberClassToApply = error ? 'govuk-input govuk-input--error' : 'govuk-input';
  const [countryCode, setCountryCode] = useState(fieldDetails.value?.split('(').pop().split(')')[0] || null);
  const [phoneNumber, setPhoneNumber] = useState(fieldDetails.value?.split(')')[1] || null);

  const formatDataAndHandleChange = (e) => {
    let countryCodeEntered = countryCode || '';
    let phoneNumberEntered = phoneNumber || '';

    if (e.target.name === `${fieldDetails.fieldName}CountryCode`) {
      setCountryCode(e.target.value);
      countryCodeEntered = e.target.value;
    } else if (e.target.name === `${fieldDetails.fieldName}PhoneNumber`) {
      setPhoneNumber(e.target.value);
      phoneNumberEntered = e.target.value;
    }

    const formattedItemToAdd = {
      target: {
        name: fieldDetails.fieldName,
        value: `(${countryCodeEntered})${phoneNumberEntered}`,
      }
    };

    handleChange(formattedItemToAdd);
  };

  return (
    <div className="phoneNumber-input">
      <label className="govuk-visually-hidden" htmlFor={`${fieldDetails.fieldName}-input[0]`}>Country code</label> 
      <input
        className={countryCodeClassToApply}
        id={`${fieldDetails.fieldName}-input[0]`}
        name={`${fieldDetails.fieldName}CountryCode`}
        type="text"
        inputMode="numeric"
        onChange={formatDataAndHandleChange}
        onPaste={formatDataAndHandleChange}
        defaultValue={countryCode}
        aria-describedby={fieldDetails.hint ? `${fieldDetails.fieldName}-hint` : null}
      />
      <label className="govuk-visually-hidden" htmlFor={`${fieldDetails.fieldName}-input[1]`}>Phone number</label> 
      <input
        className={phoneNumberClassToApply}
        id={`${fieldDetails.fieldName}-input[1]`}
        name={`${fieldDetails.fieldName}PhoneNumber`}
        type="tel"
        autoComplete="tel"
        onChange={formatDataAndHandleChange}
        onPaste={formatDataAndHandleChange}
        defaultValue={phoneNumber}
        aria-describedby={fieldDetails.hint ? `${fieldDetails.fieldName}-hint` : null}
      />
    </div>
  );
};

InputPhoneNumber.propTypes = {
  error: PropTypes.string,
  fieldDetails: PropTypes.shape({
    fieldName: PropTypes.string.isRequired,
    hint: PropTypes.string,
    value: PropTypes.string,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default InputPhoneNumber;
