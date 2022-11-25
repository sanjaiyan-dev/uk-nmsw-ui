import PropTypes from 'prop-types';
import Autocomplete from 'accessible-autocomplete/react';

// there is an open PR to fix the aria-activedescendent issue: 
// https://github.com/alphagov/accessible-autocomplete/issues/434
// https://github.com/alphagov/accessible-autocomplete/pull/553/files

// The aria-activedescendent looks to work correctly, if you use your mouse to select an item from the list
// then aria-activedescendent's value changes and voice over reads it out correctly
// The error occurs because when the combobox pop up (list) is closed, the value of aria-activedescendent is set to = 'false'
// and false is an invalid value for it.
// some explanation of aria-activedescendant: https://www.holisticseo.digital/technical-seo/web-accessibility/aria-activedescendant/

const InputAutocomplete = ({ fieldDetails, handleChange }) => {

  const suggest = (userQuery, populateResults) => {
    if (!userQuery) { return; }
    // TODO: We should look at using lodash.debounce to prevent calls being made too fast as user types
    // TODO: apiResponseData will be replaced with the api call to return the first [x] values of the dataset
    const apiResponseData = fieldDetails.dataAPIEndpoint;

    // adding a filter in here to mimic the userQuery being used to get a response
    // TODO: filteredResults will be replaced with the api call to return a filtered dataset based on the userQuery
    const filteredResults = apiResponseData.filter(o => Object.keys(o).some(k => o[k].toLowerCase().includes(userQuery.toLowerCase())));

    // this is part of the Autocomplete componet and how we return results to the list
    populateResults(filteredResults);
  };


  const template = (result) => {
    // as the user types their query, this formats what is displayed in the input (inputValue)
    // and combolist suggestions (suggestion)
    // result being from the results of the suggest function
    let response;
    if (result && result[fieldDetails.responseKey]) {
      // this occurs when user has typed in the field
      if (fieldDetails.additionalKey && result[fieldDetails.additionalKey]) {
        response = `${result[fieldDetails.responseKey]} ${result[fieldDetails.additionalKey]}`;
      } else {
        response = result[fieldDetails.responseKey];
      }
    } else {
      // this covers when user hasn't typed in field yet / field is null
      return;
    }
    return response;
  };

  const handleOnConfirm = (e) => {
    if (!e) { return; }
    handleChange(e);
  };


  // We need to use the template function to handle our results coming in objects
  // this lets us format the strings to display as we like
  // for more details see https://github.com/alphagov/accessible-autocomplete
  // we want the input value & suggestion to show the same value so both call the template function to return the same value
  // if we wanted to show different values we could call separate functions, or define them in the template function to return 
  // different results
  return (
    <Autocomplete
      confirmOnBlur={false}
      id={`${fieldDetails.fieldName}-input`}
      minLength={2}
      name={fieldDetails.fieldName}
      source={suggest}
      templates={{
        inputValue: template,
        suggestion: template,
      }}
      onConfirm={(e) => handleOnConfirm(e)}
    />
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
