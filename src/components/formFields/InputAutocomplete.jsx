import { useEffect } from 'react';
import PropTypes from 'prop-types';
import Autocomplete from 'accessible-autocomplete/react';

/* there is an open PR to fix the aria-activedescendent issue:
 * https://github.com/alphagov/accessible-autocomplete/issues/434
 * https://github.com/alphagov/accessible-autocomplete/pull/553/files
 * The aria-activedescendent looks to work correctly, if you use your mouse or keyboard to select an item from the list
 * then aria-activedescendent's value changes and voice over reads it out correctly
 * The error occurs because when the combobox pop up (list) is closed, the value of aria-activedescendent is set to = 'false'
 * and false is an invalid value for it.
 * some explanation of aria-activedescendant: https://www.holisticseo.digital/technical-seo/web-accessibility/aria-activedescendant/
*/
const InputAutocomplete = ({ fieldDetails, handleChange }) => {
  const { dataSet } = fieldDetails;
  const defaultValue = fieldDetails.value || '';
  const sessionData = JSON.parse(sessionStorage.getItem('formData'));

  const formatText = ({ result, additionalKey }) => {
    const rkPrefix = fieldDetails.responseKeyPrefix || '';
    const rkSuffix = fieldDetails.responseKeySuffix || '';
    const akPrefix = fieldDetails.additionalKeyPrefix || '';
    const akSuffix = fieldDetails.additionalKeySuffix || '';

    if (additionalKey) {
      return `${rkPrefix}${result[fieldDetails.responseKey]}${rkSuffix} ${akPrefix}${result[fieldDetails.additionalKey]}${akSuffix}`;
    }
    return `${rkPrefix}${result[fieldDetails.responseKey]}${rkSuffix}`;
  };

  const suggest = (userQuery, populateResults) => {
    if (!userQuery) { return; }
    /* The if statements below will be replaced by a call to an API endpoint with a filter function
     * which we will trigger on 2+ keypresses, and then populateResults with the results it returns
     * we may need to create a second InputAutoCompleteFromAPIData component if we have a need to maintain
     * the local dataset version below
     */
    const filteredResults = dataSet.filter((item) => item[fieldDetails.responseKey].toLowerCase().includes(userQuery.toLowerCase()) || item[fieldDetails.additionalKey]?.toLowerCase().includes(userQuery.toLowerCase()));
    // populateResults is part of the Autocomplete componet and how we return results to the list
    populateResults(filteredResults);
  };

  const template = (result) => {
    let response;

    if (result && result[fieldDetails.responseKey]) {
      // this occurs when user has typed in the field
      if (fieldDetails.displayAdditionalKey && result[fieldDetails.additionalKey]) {
        response = formatText({ result, additionalKey: true });
      } else {
        response = formatText({ result, additionalKey: false });
      }
    } else if (sessionData) {
      // on page load this handles if there is a session to prepopulate the value from
      response = sessionData[fieldDetails.fieldName];
    } else {
      // this covers when user hasn't typed in field yet / field is null
      return;
    }
    // TODO: work out why this fails linting
    // eslint-disable-next-line consistent-return
    return response;
  };

  const handleOnConfirm = (e) => {
    if (!e) { return; }
    let displayValue;
    let valueToTest;

    /*
     * SCENARIO: do not lose expanded data from session
     * GIVEN: there is session data for this field
     * WHEN: the user clicks on the input without entering anything
     * THEN: the list shows only the item related to the session value
     * AND: if they click on that item
     * THEN: the value and it's expanded data must persist
     */
    if (sessionData && sessionData[fieldDetails.fieldName] && fieldDetails.displayAdditionalKey) {
      // If a field has an additional key AND displayAdditionalKey is true, we check the data to get the value for that key
      // IF it has a value we include that in the item value
      // IF it does NOT we do not include it to avoid 'undefined' showing in the UI
      const objectExpandedItem = sessionData[`${fieldDetails.fieldName}ExpandedDetails`][fieldDetails.fieldName];
      valueToTest = objectExpandedItem[fieldDetails.additionalKey]
        ? formatText({ result: objectExpandedItem, additionalKey: true })
        : formatText({ result: objectExpandedItem, additionalKey: false });
    } else {
      valueToTest = defaultValue;
    }

    /* GIVEN: an item in the list is clicked on
     * WHEN: the value of that item (e) matches the value of defaultValue (aka it's from the session)
     * AND: the field has an additional key
     * THEN: we determine the search term by extracting the value of the responseKey from the session data
     * AND: we can use that to retrieve the related object from the dataset
     *
     * WHEN: the field does NOT have an additional key
     * THEN: we can use the defaultValue as the search term
     *
     * WHEN: the value of that item (e) does NOT match the value of defaultValue (aka user has typed something new)
     * THEN: we do not need to search as e contains the full object
     * this is because when the list is created based on the user typing, the suggest function returns the full object
     * for a result but when we prefill the input value from the session the suggest function does not run
     */
    let retrievedValue;
    if (e === valueToTest) {
      if (fieldDetails.additionalKey) {
        const termToSearchOn = sessionData[`${fieldDetails.fieldName}ExpandedDetails`][fieldDetails.fieldName][fieldDetails.responseKey];
        retrievedValue = dataSet.find((o) => o[fieldDetails.responseKey] === termToSearchOn);
      } else {
        retrievedValue = dataSet.find((o) => o[fieldDetails.responseKey] === defaultValue);
      }
    } else {
      retrievedValue = e;
    }

    /*
     * GIVEN: an item on the list has been clicked and we have retrieved its object
     * WHEN: the field has displayAdditionalKey set to true
     * AND: the retrieved object has a value for that additionalKey
     * THEN: we concatenate the responseKey value and the additionalKey value together as the displayValue to show in the UI
     *
     * WHEN: the field has displayAdditionalKey set to false
     * OR: it has displayAdditionalKey set to true but the object has no value for this
     * THEN: we set the displayValue to just have the responseKey value
     */
    if (fieldDetails.displayAdditionalKey && retrievedValue[fieldDetails.additionalKey]) {
      displayValue = formatText({ result: retrievedValue, additionalKey: true });
    } else {
      displayValue = formatText({ result: retrievedValue, additionalKey: false });
    }

    /*
     * An items object may include data that is not shown in the UI
     * We always want to pass that data back to the handleChange function
     * So that it is available to pass back to the handleSubmit function
     * and therefore available for use
     */
    const formattedEvent = {
      target: {
        name: fieldDetails.fieldName,
        value: displayValue,
        additionalDetails: {
          [fieldDetails.fieldName]: retrievedValue,
        },
      },
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
    const handleKeypress = (e) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const formattedEvent = {
          target: {
            name: e.target.name,
            value: null,
            additionalDetails: {},
          },
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
    <div className="autocomplete-input">
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
  fieldDetails: PropTypes.shape({
    dataSet: PropTypes.array.isRequired,
    fieldName: PropTypes.string.isRequired,
    hint: PropTypes.string,
    responseKey: PropTypes.string.isRequired, // a field that always exists in the dataset that we can use as a key for returning results
    additionalKey: PropTypes.string, // optional other field that we want to search on and possibly display in results
    displayAdditionalKey: PropTypes.bool.isRequired, // determines if the additionalKey is for searching only or if it also displays in field
    responseKeyPrefix: PropTypes.string,
    responseKeySuffix: PropTypes.string,
    additionalKeyPrefix: PropTypes.string,
    additionalKeySuffix: PropTypes.string,
    value: PropTypes.string,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default InputAutocomplete;
