import PropTypes from 'prop-types';
import {
  DECLARATION_STATUS_CANCELLED,
  DECLARATION_STATUS_DRAFT,
  DECLARATION_STATUS_FAILED,
  DECLARATION_STATUS_PRECANCELLED,
  DECLARATION_STATUS_PRESUBMITTED,
  DECLARATION_STATUS_SUBMITTED,
  DECLARATION_STEP_STATUS_COMPLETED,
  DECLARATION_STEP_STATUS_CANNOT_START,
  DECLARATION_STEP_STATUS_NOT_STARTED,
  DECLARATION_STEP_STATUS_OPTIONAL,
  DECLARATION_STEP_STATUS_REQUIRED,
  DECLARATION_UPT_STATUS_BOARD,
  DECLARATION_UPT_STATUS_CHECK,
  DECLARATION_UPT_STATUS_NO_BOARD,
} from '../constants/AppConstants';

const StatusTag = ({ status }) => {
  let tagClass;
  let label;

  switch (status) {
    case DECLARATION_STATUS_CANCELLED:
      tagClass = 'govuk-tag govuk-tag--orange';
      label = 'Cancelled';
      break;
    case DECLARATION_STATUS_DRAFT:
      tagClass = 'govuk-tag govuk-tag--grey';
      label = 'Draft';
      break;
    case DECLARATION_STATUS_FAILED:
      tagClass = 'govuk-tag govuk-tag--red';
      label = 'Failed';
      break;
    case DECLARATION_STATUS_PRECANCELLED:
      tagClass = 'govuk-tag govuk-tag--orange';
      label = 'Cancelled';
      break;
    case DECLARATION_STATUS_PRESUBMITTED:
      tagClass = 'govuk-tag govuk-tag--yellow';
      label = 'Pending';
      break;
    case DECLARATION_STATUS_SUBMITTED:
      tagClass = 'govuk-tag govuk-tag--green';
      label = 'Submitted';
      break;

    case DECLARATION_STEP_STATUS_CANNOT_START:
      tagClass = 'govuk-tag govuk-tag--grey app-task-list__tag';
      label = 'Cannot start yet';
      break;
    case DECLARATION_STEP_STATUS_COMPLETED:
      tagClass = 'govuk-tag app-task-list__tag';
      label = 'Completed';
      break;
    case DECLARATION_STEP_STATUS_NOT_STARTED:
      tagClass = 'govuk-tag govuk-tag--grey app-task-list__tag';
      label = 'Not started';
      break;
    case DECLARATION_STEP_STATUS_OPTIONAL:
      tagClass = 'govuk-tag govuk-tag--blue app-task-list__tag';
      label = 'Optional';
      break;
    case DECLARATION_STEP_STATUS_REQUIRED:
      tagClass = 'govuk-tag govuk-tag--pink app-task-list__tag';
      label = 'Required';
      break;

    // UPT result statuses
    case DECLARATION_UPT_STATUS_BOARD:
      tagClass = 'govuk-tag govuk-tag--green';
      label = 'Valid permission to travel';
      break;
    case DECLARATION_UPT_STATUS_CHECK:
      tagClass = 'govuk-tag govuk-tag--blue';
      label = 'Authority to carry granted';
      break;
    case DECLARATION_UPT_STATUS_NO_BOARD:
      tagClass = 'govuk-tag govuk-tag--red';
      label = 'Do not board';
      break;

    default: {
      tagClass = '';
      label = '';
    }
  }

  return (
    <strong className={tagClass}>{label}</strong>
  );
};

export default StatusTag;

StatusTag.propTypes = {
  status: PropTypes.string,
};
