import {
  useEffect,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  EXPANDED_DETAILS,
  FIELD_AUTOCOMPLETE,
  FIELD_CONDITIONAL,
  FIELD_PASSWORD,
  PASSWORD_FORM,
  SIGN_IN_FORM,
} from '../../constants/AppConstants';
import ErrorSummary from './ErrorSummary';
import FormActions from './FormActions';
import FormFields from './FormFields';

const DisplayForm = ({
  fields, formId, formActions, formType, isLoading, pageHeading, handleSubmit, children, removeApiErrors,
}) => {
  const fieldsRef = useRef(null);
  const errorSummaryRef = useRef(null);
  const navigate = useNavigate();
  const [errors, setErrors] = useState();
  const [fieldsWithValues, setFieldsWithValues] = useState();
  const [formData, setFormData] = useState({});
  const [sessionData, setSessionData] = useState(JSON.parse(sessionStorage.getItem('formData')));
  // Turns errors into a boolean so that error summary does not focus (and input does not lose focus) when user types into an input
  const errorsExist = !!errors;

  const handleChange = (e, itemToClear) => {
    // e may be an html event (e.g. radio button selected, text entered in input field)
    // or an object from an autocomplete field being selected

    if (errors) {
      // on change any error shown for that field should be cleared so find if field has an error & remove from error list
      const itemToCheck = itemToClear ? itemToClear.target.name : e.target.name;
      const filteredErrors = errors?.filter((errorField) => errorField.name !== itemToCheck);
      setErrors(filteredErrors);
    }

    if (formType === SIGN_IN_FORM) {
      removeApiErrors();
    }

    // create the dataset to store, accounting for objects coming from autocomplete
    const additionalDetails = e.target.additionalDetails
      ? { [`${[e.target.name]}${EXPANDED_DETAILS}`]: e.target.additionalDetails, [e.target.name]: e.target.value }
      : { [e.target.name]: e.target.value };

    const dataSet = {
      [e.target.name]: e.target.value,
      ...additionalDetails,
      [itemToClear?.target.name]: itemToClear?.target.value,
    };

    // we do not store passwords or sign in details in session data
    if (e.target.name !== FIELD_PASSWORD && formType !== SIGN_IN_FORM) {
      setSessionData({ ...sessionData, ...dataSet });
      sessionStorage.setItem('formData', JSON.stringify({ ...sessionData, ...dataSet }));
    }

    // we do store all values into form data
    setFormData({ ...formData, ...dataSet });
  };

  /*
   * For field level ref we use a ref callback, which passes a function to the ref attribute
   * React calls the ref callback with the DOM node when it’s time to set the ref, & with null when it’s time to clear it.
   * We can then access any ref within it by fieldMap.get(error.name) which relates to our field id.
   *
   * This works here as the DOM node is within this component, however we can't use this method in the same
   * way to pass a ref down to the input as the input is in a different component and we need to forward the ref down
   * TODO: work out how to set, forward, and access ref in input component on error click so we can set focus on input
   */
  const getFieldMap = () => {
    if (!fieldsRef.current) {
      // Initialize the Map on first usage.
      fieldsRef.current = new Map();
    }
    return fieldsRef.current;
  };

  /* When we introduce RBAC we expect to have fields that are
   * editable, disabled, or hidden based on user permissions.
   * This useEffect can be refactored to include a permission test
   * (or to call a permission test hook) that determines if a field should be
   * editable, viewable disabled, or hidden and return only editable/visible fields
   * to the form render
   *
   * For now as we have no RBAC it just returns all fields as fields to include
   * It also checks session storage for stored values and applies them
   */

  // TODO: refactor this to be clearer
  useEffect(() => {
    let sessionDataArray;
    if (sessionData) {
      sessionDataArray = Object.entries(sessionData).map((item) => ({ name: item[0], value: item[1] }));
    }

    const mappedFormFields = fields.map((field) => {
      let valuesToAdd;
      const sessionDataValue = sessionDataArray?.find((sessionDataField) => sessionDataField.name === field.fieldName);
      if (field.type === FIELD_CONDITIONAL) {
        const conditionalField = field.radioOptions.find((thisField) => thisField.parentFieldValue === sessionDataValue?.value);
        const sessionConditionalValue = sessionDataArray?.find((sessionDataField) => sessionDataField.name === conditionalField?.name);
        valuesToAdd = { ...field, value: sessionDataValue?.value, conditionalValueToFill: sessionConditionalValue };
      } else {
        valuesToAdd = {
          ...field,
          value: sessionDataValue?.value ? sessionDataValue?.value : field.value,
        };
      }
      return (valuesToAdd);
    });

    setFieldsWithValues(mappedFormFields);

    const mappedFormData = fields.map((field) => {
      const sessionDataValue = sessionDataArray?.find((sessionDataField) => sessionDataField.name === field.fieldName);
      let valuesToAdd;

      if (field.type === FIELD_AUTOCOMPLETE) {
        const expandedDetails = `${field.fieldName}${EXPANDED_DETAILS}`;
        const sessionExpandedDetailsValue = sessionDataArray?.find((sessionDataField) => sessionDataField.name === expandedDetails);
        valuesToAdd = [
          { [field.fieldName]: sessionDataValue?.value ? sessionDataValue?.value : field.value },
          { [expandedDetails]: sessionExpandedDetailsValue?.value },
        ];
      } else {
        valuesToAdd = { [field.fieldName]: sessionDataValue?.value ? sessionDataValue?.value : field.value };
      }
      return valuesToAdd;
    });

    const flattenedData = mappedFormData.flatMap((field) => field);
    const objectOfData = Object.assign({}, ...flattenedData);

    setFormData(objectOfData);
  }, [setFieldsWithValues, setFormData]);

  useEffect(() => {
    if (errorsExist) {
      errorSummaryRef?.current?.focus();
    }
  }, [errorsExist]);

  if (!formActions || !fieldsWithValues) { return null; }
  return (
    <>
      <ErrorSummary
        errors={errors || []}
        errorSummaryRef={errorSummaryRef}
        getFieldMap={getFieldMap}
      />
      <div className="govuk-grid-row">
        {pageHeading && <h1 className="govuk-heading-xl govuk-grid-column-full">{pageHeading}</h1>}
      </div>

      {formType !== PASSWORD_FORM && (
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-three-quarters below-h1">
            {children}
          </div>
        </div>
      )}

      <div className="govuk-grid-row">
        <form id={formId} className="govuk-grid-column-full" autoComplete="off">
          <FormFields
            errors={errors || []}
            fieldsWithValues={fieldsWithValues}
            getFieldMap={getFieldMap}
            handleChange={handleChange}
          >
            {children}
          </FormFields>
          <FormActions
            errorSummaryRef={errorSummaryRef}
            fields={fields}
            formActions={formActions}
            formData={formData}
            formType={formType}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            navigate={navigate}
            setErrors={setErrors}
          />
        </form>
      </div>
    </>
  );
};

export default DisplayForm;

DisplayForm.propTypes = {
  children: PropTypes.node, // allows any renderable object
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      fieldName: PropTypes.string.isRequired,
      hint: PropTypes.string,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      value: PropTypes.string,
    }),
  ).isRequired,
  formId: PropTypes.string.isRequired,
  formActions: PropTypes.shape({
    submit: PropTypes.shape({
      label: PropTypes.string.isRequired,
    }),
    cancel: PropTypes.shape({
      label: PropTypes.string.isRequired,
      redirectURL: PropTypes.string.isRequired,
    }),
  }),
  formType: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  pageHeading: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  removeApiErrors: PropTypes.func,
};
