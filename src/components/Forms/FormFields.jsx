import PropTypes from 'prop-types';
import determineFieldType from '../formFields/DetermineFieldType';

const FormFields = ({
  errors,
  fieldsWithValues,
  getFieldMap,
  handleChange,
  children,
}) => (
  <>
    {
        fieldsWithValues.map((field) => {
          const error = errors?.find((errorField) => errorField.name === field.fieldName);
          return (
            <div
              key={field.fieldName}
              id={field.fieldName}
              ref={(node) => {
                const map = getFieldMap();
                if (node) {
                  map.set(field.fieldName, node); // on mount adds the refs
                } else {
                  map.delete(field.fieldName); // on unmount removes the refs
                }
              }}
            >
              {
                determineFieldType({
                  allErrors: errors, // allows us to add the error handling logic for conditional fields
                  error: error?.message,
                  fieldDetails: field,
                  parentHandleChange: handleChange,
                  children,
                })
              }
            </div>
          );
        })
      }
  </>
);

export default FormFields;

FormFields.propTypes = {
  errors: PropTypes.array.isRequired,
  fieldsWithValues: PropTypes.array.isRequired,
  getFieldMap: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  children: PropTypes.node,
};
