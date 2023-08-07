import PropTypes from 'prop-types';
import {
  DECLARATION_STATUS_DRAFT,
  DECLARATION_STATUS_SUBMITTED,
  DECLARATION_STATUS_PRESUBMITTED,
} from '../../../constants/AppConstants';

const CYACallToActions = ({
  checkCancelRequest, declarationStatus, handleSubmit, isPendingSubmit,
}) => (
  <>
    {
        declarationStatus?.status === DECLARATION_STATUS_DRAFT
        && (
          <>
            <h2 className="govuk-heading-m">Send the report</h2>
            <p className="govuk-body">By sending this voyage report, you are confirming that to the best of your knowledge, the details you are sending are correct.</p>

            <button
              type="button"
              className={isPendingSubmit ? 'govuk-button disabled' : 'govuk-button'}
              data-module="govuk-button"
              disabled={isPendingSubmit}
              onClick={() => handleSubmit()}
            >
              Confirm and send
            </button>
          </>
        )
      }
    {
        (declarationStatus?.status === DECLARATION_STATUS_SUBMITTED || declarationStatus?.status === DECLARATION_STATUS_PRESUBMITTED)
        && (
          <button
            type="button"
            className={isPendingSubmit ? 'govuk-button govuk-button--warning disabled' : 'govuk-button govuk-button--warning'}
            data-module="govuk-button"
            disabled={isPendingSubmit}
            onClick={() => checkCancelRequest()}
          >
            Cancel
          </button>
        )
      }
  </>
);

export default CYACallToActions;

CYACallToActions.propTypes = {
  checkCancelRequest: PropTypes.func.isRequired,
  declarationStatus: PropTypes.shape({
    status: PropTypes.string,
    submissionDate: PropTypes.string,
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isPendingSubmit: PropTypes.bool.isRequired,
};
