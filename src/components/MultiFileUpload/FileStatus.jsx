import PropTypes from 'prop-types';
import { FILE_STATUS_PENDING } from '../../constants/AppConstants';
import LoadingSpinner from '../LoadingSpinner';

const FileStatusInProgress = ({ fileName }) => (
  <div className="govuk-!-margin-bottom-5 multi-file-upload--filelist-filename">
    <div className="multi-file-upload--loading-spinner">
      <LoadingSpinner />
    </div>
    <span>{fileName}</span>
  </div>
);

const FileStatusPending = ({ fileName }) => (
  <div className="govuk-!-margin-bottom-5 multi-file-upload--filelist-filename">
    <span>{fileName}</span> <span className="govuk-tag govuk-tag--grey">{FILE_STATUS_PENDING}</span>
  </div>
);

const FileStatusSuccess = ({ fileName }) => (
  <div className="success">
    <div className="multi-file-upload--filelist-icon">
      <svg fill="currentColor" role="presentation" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" height="25" width="25">
        <path d="M25,6.2L8.7,23.2L0,14.1l4-4.2l4.7,4.9L21,2L25,6.2z" />
      </svg>
    </div>
    <div className="govuk-!-margin-bottom-5 multi-file-upload--filelist-filename">
      <span>{fileName}</span> <span>has been uploaded</span>
    </div>
  </div>
);

const FileStatusError = ({ fileName, errorMessage }) => (
  <div className="error">
    <div className="multi-file-upload--filelist-icon">
      <svg fill="currentColor" role="presentation" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" height="25" width="25">
        <path d="M13.6,15.4h-2.3v-4.5h2.3V15.4z M13.6,19.8h-2.3v-2.2h2.3V19.8z M0,23.2h25L12.5,2L0,23.2z" />
      </svg>
    </div>
    <div className="govuk-!-margin-bottom-5 multi-file-upload--filelist-filename">
      <span>{fileName}</span> <span>{errorMessage}</span>
    </div>
  </div>
);

export {
  FileStatusError,
  FileStatusInProgress,
  FileStatusPending,
  FileStatusSuccess,
};

FileStatusInProgress.propTypes = {
  fileName: PropTypes.string.isRequired,
};

FileStatusPending.propTypes = {
  fileName: PropTypes.string.isRequired,
};

FileStatusSuccess.propTypes = {
  fileName: PropTypes.string.isRequired,
};

FileStatusError.propTypes = {
  fileName: PropTypes.string.isRequired,
  errorMessage: PropTypes.string.isRequired,
};
