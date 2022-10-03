import { useState } from 'react';
import PropTypes from 'prop-types';
import determineFieldType from './formFields/determineFieldType';

const DisplayForm = ({ fields, formActions, handleSubmit }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
