import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { SERVICE_NAME } from '../constants/AppConstants';

const ConfirmationMessage = ({
  confirmationMessage,
  pageTitle,
  nextPageLink,
  nextPageLinkText,
}) => {
  document.title = `${pageTitle}` || SERVICE_NAME;

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <div className="govuk-panel govuk-panel--confirmation">
          <h1 className="govuk-panel__title govuk-!-margin-bottom-6">
            {`${confirmationMessage}`}
          </h1>

        </div>
        <Link
          to={nextPageLink}
        >
          {nextPageLinkText}
        </Link>
      </div>
    </div>
  );
};

export default ConfirmationMessage;

ConfirmationMessage.propTypes = {
  confirmationMessage: PropTypes.string.isRequired,
  pageTitle: PropTypes.string.isRequired,
  nextPageLink: PropTypes.string.isRequired,
  nextPageLinkText: PropTypes.string.isRequired,
};
