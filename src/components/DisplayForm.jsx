import { useEffect, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { UserContext } from '../context/userContext';
import determineFieldType from './formFields/determineFieldType';

const DisplayForm = ({ fields, formActions, handleSubmit }) => {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* When we introduce RBAC we expect to have fields that are
   * editable, disabled, or hidden based on user permissions.
   * This useEffect can be refactored to include a permission test
   * (or to call a permission test hook) that determines if a field should be 
   * editable, viewable disabled, or hidden
   * 
   * For now as we have no RBAC it just returns all fields as fields to include
   */
  useEffect(() => {
    const mappedFields = fields.map((field) => {
      return { fieldName: field.fieldName, value: field.value };
    });
    // convert the array of objects into a single object
    const objectOfMappedFields = Object.assign({}, ...mappedFields.map(field => ({ [field.fieldName]: field.value })));
    setFormData(objectOfMappedFields);
  }, [user, setFormData]);

  if (!formActions || !fields) { return null; }
  return (
    <form autoComplete="off">
      {fields.map((field) => {
        return <div key={field.fieldName} id={field.fieldName}>{
          determineFieldType({
            fieldDetails: field,
            parentHandleChange: handleChange,
          })
        }</div>;
      })}
      <button
        type={formActions.submit.type}
        className={formActions.submit.className}
        data-module={formActions.submit.dataModule}
        data-testid={formActions.submit.dataTestid}
        onClick={(e) => handleSubmit(e, { formData })}
      >
        {formActions.submit.label}
      </button>
      {formActions.cancel && <button
        type={formActions.cancel.type}
        className={formActions.cancel.className}
        data-module={formActions.cancel.dataModule}
        data-testid={formActions.cancel.dataTestid}
      >
        {formActions.cancel.label}
      </button>}
    </form>
  );
};

export default DisplayForm;

DisplayForm.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      fieldName: PropTypes.string.isRequired,
      hint: PropTypes.string,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      value: PropTypes.string,
    }),
  ).isRequired,
  formActions: PropTypes.objectOf(
    PropTypes.shape({
      className: PropTypes.string.isRequired,
      dataModule: PropTypes.string,
      dataTestid: PropTypes.string,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    })
  ),
  handleSubmit: PropTypes.func.isRequired,
};
