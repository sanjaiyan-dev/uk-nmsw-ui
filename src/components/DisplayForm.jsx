import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { UserContext } from '../context/userContext';
import determineFieldType from './formFields/DetermineFieldType';

const DisplayForm = ({ errors, fields, formId, formActions, handleSubmit }) => {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const scrollToErrorField = (e, error) => {
    e.preventDefault();
    document.getElementById(`${error.name}-input`).focus();
    document.getElementById(error.name).scrollIntoView();
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
    <form id={formId} autoComplete="off">
      {errors?.length > 0 && (
        <div className="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" data-module="govuk-error-summary">
          <h2 className="govuk-error-summary__title" id="error-summary-title">
            There is a problem
          </h2>
          <div className="govuk-error-summary__body">
            <ul className="govuk-list govuk-error-summary__list">
              {errors.map((error) => {
                return (
                  <li key={error.name}>
                    <button className="govuk-button--text"
                      onClick={(e) => { scrollToErrorField(e, error); }}
                    >
                      {error.message}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
      {
        fields.map((field) => {
          return (
            <div key={field.fieldName} id={field.fieldName}>
              {
                determineFieldType({
                  fieldDetails: field,
                  parentHandleChange: handleChange,
                })
              }
            </div>
          );
        })
      }
      <button
        type={formActions.submit.type}
        className={formActions.submit.className}
        data-module={formActions.submit.dataModule}
        data-testid={formActions.submit.dataTestid}
        onClick={(e) => handleSubmit(e, { formData })}
      >
        {formActions.submit.label}
      </button>
      {
        formActions.cancel && <button
          type={formActions.cancel.type}
          className={formActions.cancel.className}
          data-module={formActions.cancel.dataModule}
          data-testid={formActions.cancel.dataTestid}
        >
          {formActions.cancel.label}
        </button>
      }
    </form>
  );
};

export default DisplayForm;

DisplayForm.propTypes = {
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  ),
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
