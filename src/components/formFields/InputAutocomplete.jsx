import { useEffect } from 'react';
import PropTypes from 'prop-types';
import Autocomplete from 'accessible-autocomplete/react';

/* there is an open PR to fix the aria-activedescendent issue: 
 * https://github.com/alphagov/accessible-autocomplete/issues/434
 * https://github.com/alphagov/accessible-autocomplete/pull/553/files
 * The aria-activedescendent looks to work correctly, if you use your mouse to select an item from the list
 * then aria-activedescendent's value changes and voice over reads it out correctly
 * The error occurs because when the combobox pop up (list) is closed, the value of aria-activedescendent is set to = 'false'
 * and false is an invalid value for it.
 * some explanation of aria-activedescendant: https://www.holisticseo.digital/technical-seo/web-accessibility/aria-activedescendant/
*/
const InputAutocomplete = ({ fieldDetails, handleChange }) => {
  const apiResponseData = fieldDetails.dataAPIEndpoint;
  const defaultValue = fieldDetails.value || '';
  const sessionData = JSON.parse(sessionStorage.getItem('formData'));

  const suggest = (userQuery, populateResults) => {
    if (!userQuery) { return; }
    // TODO: We should look at using lodash.debounce to prevent calls being made too fast as user types
    // TODO: apiResponseData will be replaced with the api call to return the first [x] values of the dataset
    // const apiResponseData = fieldDetails.dataAPIEndpoint;

    // adding a filter in here to mimic the userQuery being used to get a response
    // TODO: filteredResults will be replaced with the api call to return a filtered dataset based on the userQuery
    const filteredResults = apiResponseData.filter(o => Object.keys(o).some(k => o[k].toLowerCase().includes(userQuery.toLowerCase())));

    // this is part of the Autocomplete componet and how we return results to the list
    populateResults(filteredResults);
  };


  const template = (result) => {
    let response;
    if (result && result[fieldDetails.responseKey]) {
      // this occurs when user has typed in the field
      if (fieldDetails.additionalKey && result[fieldDetails.additionalKey]) {
        response = `${result[fieldDetails.responseKey]} ${result[fieldDetails.additionalKey]}`;
      } else {
        response = result[fieldDetails.responseKey];
      }
    } else if (sessionData) {
      // on page load this handles if there is a session to prepopulate the value from
      response = sessionData[fieldDetails.fieldName];
    } else {
      // this covers when user hasn't typed in field yet / field is null
      return;
    }
    return response;
  };

  const handleOnConfirm = (e) => {
    if (!e) { return; }
    let displayValue;
    let valueToTest;

    // If value is prefilled from the session data, this ensures we pass back the expanded details
    // if the user clicks in the input and clicks the value in the list again
    if (sessionData[fieldDetails.fieldName] && fieldDetails.additionalKey) {
      // Not all datasets that have an additionalKey have a value for that key
      // the below is to avoid having 'undefined' show up in the list
      const objectExpandedItem = sessionData[`${fieldDetails.fieldName}ExpandedDetails`][fieldDetails.fieldName];
      valueToTest = objectExpandedItem[fieldDetails.additionalKey]
        ? `${objectExpandedItem[fieldDetails.responseKey]} ${objectExpandedItem[fieldDetails.additionalKey]}`
        : objectExpandedItem[fieldDetails.responseKey];
    } else {
      valueToTest = defaultValue;
    }

    let retrievedValue;
    if (e === valueToTest) {
      if (fieldDetails.additionalKey) {
        const sessionInfo = JSON.parse(sessionStorage.getItem('formData'));
        const expandedFieldName = `${fieldDetails.fieldName}ExpandedDetails`;
        const objectItem = sessionInfo[expandedFieldName];
        const objectExpandedItem = objectItem[fieldDetails.fieldName];
        const objectResponseValue = objectExpandedItem[fieldDetails.responseKey];
        retrievedValue = apiResponseData.find(o => o[fieldDetails.responseKey] === objectResponseValue);
      } else {
        retrievedValue = apiResponseData.find(o =>  o[fieldDetails.responseKey] === defaultValue);
      }
    } else {
      retrievedValue = e;
    }


    // Returns either a concatenated value if required and available e.g. port name + port unlocode
    // Or the single string e.g. ports without a unlocode, field that does not have an additionalKey set
    if (fieldDetails.additionalKey && retrievedValue[fieldDetails.additionalKey]) {
      displayValue = `${retrievedValue[fieldDetails.responseKey]} ${retrievedValue[fieldDetails.additionalKey]}`;
    } else {
      displayValue = retrievedValue[fieldDetails.responseKey];
    }

    // We want to include both the display value, and any additional field object information received from the API
    // So the page's handleSubmit can decide what to send on the POST/PUT call
    const formattedEvent = {
      target: {
        name: fieldDetails.fieldName,
        value: displayValue,
        additionalDetails: {
          [fieldDetails.fieldName]: retrievedValue
        },
      }
    };

    handleChange(formattedEvent);
  };

  /* 
   * There is no onBlur event available for us to place a function on
   * There is no onKeyPress event available for us to place a function on
   * There is no current way other than vanillaJS to capture that the
   * user has cleared the field with delete/backspace and then 
   * clear the value from formData/sessionData
  */
  useEffect(() => {
    const handleKeypress = e => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const formattedEvent = {
          target: {
            name: e.target.name,
            value: null,
            additionalDetails: {},
          }
        };
        handleChange(formattedEvent);
      }
    };
    const element = document.getElementById(`${fieldDetails.fieldName}-input`);
    element.addEventListener('keydown', handleKeypress);
    return () => {
      element.removeEventListener('keydown', handleKeypress);
    };
  }, []);

  // We need to use the template function to handle our results coming in objects
  // this lets us format the strings to display as we like
  // for more details see https://github.com/alphagov/accessible-autocomplete
  // we want the input value & suggestion to show the same value so both call the template function to return the same value
  // if we wanted to show different values we could call separate functions, or define them in the template function to return 
  // different results
  return (
    <div className='autocomplete-input'>
      <Autocomplete
        confirmOnBlur={false}
        defaultValue={defaultValue}
        id={`${fieldDetails.fieldName}-input`}
        minLength={1}
        name={fieldDetails.fieldName}
        source={suggest}
        templates={{
          inputValue: template,
          suggestion: template,
        }}
        onConfirm={(e) => handleOnConfirm(e)}
      />
    </div>
  );
};

InputAutocomplete.propTypes = {
  error: PropTypes.string,
  fieldDetails: PropTypes.shape({
    // dataAPIEndpoint: PropTypes.string.isRequired, // when we implement the endpoint
    dataAPIEndpoint: PropTypes.array.isRequired, // for while we're passing in a mocked array of data
    fieldName: PropTypes.string.isRequired,
    hint: PropTypes.string,
    responseKey: PropTypes.string.isRequired,  // a field that always exists in the dataset that we can use as a key for returning results
    additionalKey: PropTypes.string,  // optional other field that we want to append to the returned result if it exists in the dataset (e.g. country ISO code, unlocode)
    value: PropTypes.string,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default InputAutocomplete;
