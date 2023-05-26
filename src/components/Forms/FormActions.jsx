import PropTypes from 'prop-types';

const FormActions = ({
  formActions,
  formData,
  handleCancel,
  handleValidation,
  isLoading,
}) => (
  <div className="govuk-button-group">
    <button
      type="submit"
      className={isLoading ? 'govuk-button disabled' : 'govuk-button'}
      data-module="govuk-button"
      data-testid="submit-button"
      onClick={(e) => handleValidation(e, { formData })}
      disabled={isLoading}
    >
      {formActions.submit.label}
    </button>
    {formActions.cancel && (
    <button
      type="button"
      className="govuk-button govuk-button--secondary"
      data-module="govuk-button"
      data-testid="cancel-button"
      onClick={() => handleCancel(formActions.cancel.redirectURL)}
    >
      {formActions.cancel.label}
    </button>
    )}
  </div>
);

export default FormActions;

FormActions.propTypes = {
  formActions: PropTypes.object.isRequired,
  formData: PropTypes.object.isRequired,
  handleCancel: PropTypes.func,
  handleValidation: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};
