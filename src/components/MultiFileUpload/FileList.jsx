import PropTypes from 'prop-types';
import {
  FILE_STATUS_ERROR,
  FILE_STATUS_IN_PROGRESS,
  FILE_STATUS_PENDING,
  FILE_STATUS_SUCCESS,
} from '../../constants/AppConstants';
import {
  FileStatusError,
  FileStatusInProgress,
  FileStatusPending,
  FileStatusSuccess,
} from './FileStatus';

const FilesAddedForUpload = ({
  filesAddedForUpload,
  disableButtons,
  handleDelete,
}) => {
  console.log(filesAddedForUpload);
  return (
    <>
      {filesAddedForUpload.map((file) => (
        <div key={file.filename} className="govuk-grid-row  govuk-!-margin-bottom-5 multi-file-upload--filelist">
          <div className="nmsw-grid-column-ten-twelfths">
            {file.status === FILE_STATUS_IN_PROGRESS && <FileStatusInProgress fileName={file.filename} />}
            {file.status === FILE_STATUS_PENDING && <FileStatusPending fileName={file.filename} />}
            {file.status === FILE_STATUS_SUCCESS && <FileStatusSuccess fileName={file.filename} />}
            {file.status === FILE_STATUS_ERROR && <FileStatusError fileName={file.filename} errorMessage={file.errorMessage} />}
          </div>
          <div className="nmsw-grid-column-two-twelfths govuk-!-text-align-right">
            <button
              className="govuk-button govuk-button--warning govuk-!-margin-bottom-5"
              type="button"
              onClick={(e) => handleDelete({ e, fileName: file.filename, id: file.id })}
              disabled={disableButtons}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default FilesAddedForUpload;

FilesAddedForUpload.propTypes = {
  filesAddedForUpload: PropTypes.array.isRequired,
  disableButtons: PropTypes.bool.isRequired,
  handleDelete: PropTypes.func.isRequired,
};
