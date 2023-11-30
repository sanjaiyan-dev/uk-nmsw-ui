/* eslint-disable jsx-a11y/label-has-associated-control */
import { useRef, useState } from 'react';
import PropTypes from 'prop-types';

const DragDropZone = ({
  maxFilesError,
  onUploadFiles,
  disableButtons,
  storeFilesForUpload,
}) => {
  const inputRef = useRef(null);
  const multiple = true;
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // triggers when file(s) are dropped into the input zone
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      storeFilesForUpload(e.dataTransfer.files);
    }
  };

  // triggers when file(s) are selected with click
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      storeFilesForUpload(e.target.files);
    }
  };

  const onChooseFilesButtonClick = () => {
    // triggers the input and opens the file browser for selecting files
    inputRef.current.click();
  };

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-three-quarters">
        <form
          id="multiFileUpload"
          onDragEnter={handleDrag}
          onSubmit={(e) => e.preventDefault()}
        >
          <fieldset className="govuk-fieldset">
            <div className={maxFilesError ? 'govuk-form-group govuk-form-group--error' : 'govuk-form-group'}>
              {maxFilesError && (
                <p id="multiFileUploadForm-error" className="govuk-error-message">
                  <span className="govuk-visually-hidden">Error:</span> {maxFilesError}
                </p>
              )}
              <input
                ref={inputRef}
                type="file"
                id="multiFileUploadInput"
                data-testid="multiFileUploadInput"
                multiple={multiple}
                onChange={handleChange}
              />
              <label
                className={dragActive ? 'file-upload-dropzone drag-active' : 'file-upload-dropzone'}
                htmlFor="multiFileUploadInput"
              >
                <div>
                  <p className="govuk-body">Drag and drop files here or</p>
                  <button
                    className="govuk-button--text"
                    type="button"
                    onClick={onChooseFilesButtonClick}
                    disabled={disableButtons}
                  >
                    Choose files
                  </button>
                </div>
              </label>
              {dragActive
                && (
                  <div
                    id="dragFileElement"
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  />
                )}
            </div>
          </fieldset>
          <button
            className="govuk-button govuk-button--secondary"
            type="button"
            onClick={onUploadFiles}
            disabled={disableButtons}
          >
            Upload files
          </button>
        </form>
      </div>
    </div>
  );
};

export default DragDropZone;

DragDropZone.propTypes = {
  maxFilesError: PropTypes.string,
  onUploadFiles: PropTypes.func.isRequired,
  disableButtons: PropTypes.bool.isRequired,
  storeFilesForUpload: PropTypes.func.isRequired,
};
