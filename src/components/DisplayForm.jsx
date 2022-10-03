import { useState } from 'react';
import PropTypes from 'prop-types';
import determineFieldType from './formFields/determineFieldType';

const DisplayForm = ({ fields, handleSubmit }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
        type="submit"
        onClick={(e) => handleSubmit(e, { formData })}
      >
        Submit
      </button>
    </form>
  );
};

export default DisplayForm;

DisplayForm.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      disabled: PropTypes.bool,
      fieldName: PropTypes.string.isRequired,
      hint: PropTypes.string,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      value: PropTypes.string,
    }),
  ),
  handleSubmit: PropTypes.func.isRequired,
};
