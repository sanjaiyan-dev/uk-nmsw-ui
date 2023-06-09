import PropTypes from 'prop-types';
import { PASSWORD_FORM, SINGLE_PAGE_FORM } from '../../constants/AppConstants';
import { scrollToTop } from '../../utils/ScrollToElement';
import Validator from '../../utils/Validator';

const FormActions = ({
  errorSummaryRef,
  fields,
  formActions,
  formData,
  formType,
  handleSubmit,
  isLoading,
  navigate,
  setErrors,
}) => {
  // Note: no forms currently require handleCancel
  const handleCancel = (redirectURL) => {
    sessionStorage.removeItem('formData');
    navigate(redirectURL);
  };

  const handleValidation = async (e, receivedFormData) => {
    e.preventDefault();
    const formErrors = await Validator({ formData: receivedFormData.formData, formFields: fields });
    setErrors(formErrors);

    if (formErrors.length < 1) {
      /*
       * Returning formData
       * some forms perform special actions on the formData post validation
       * e.g. CookiePolicy form will set cookie states
       * so we always pass formData back
       */
      handleSubmit(receivedFormData);

      /* If the form is a singlepage form we can clear the session
       * we do not clear the session for multipage forms or sign in form
       * as they have different needs
      */
      if (formType === SINGLE_PAGE_FORM || formType === PASSWORD_FORM) {
        sessionStorage.removeItem('formData');
      }
    } else {
      scrollToTop();
      errorSummaryRef?.current?.focus();
    }
  };

  return (
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
};

export default FormActions;

FormActions.propTypes = {
  errorSummaryRef: PropTypes.object.isRequired,
  fields: PropTypes.array.isRequired,
  formActions: PropTypes.object.isRequired,
  formData: PropTypes.object.isRequired,
  formType: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  navigate: PropTypes.func.isRequired,
  setErrors: PropTypes.func.isRequired,
};
