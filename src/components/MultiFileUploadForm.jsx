import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import '../assets/css/multiFileUploadForm.scss';
import {
  MESSAGE_URL,
  SIGN_IN_URL,
  URL_DECLARATIONID_IDENTIFIER,
  YOUR_VOYAGES_URL,
} from '../constants/AppUrlConstants';
import { FILE_TYPE_INVALID_PREFIX } from '../constants/AppAPIConstants';
import { MAX_SUPPORTING_FILE_SIZE, MAX_SUPPORTING_FILE_SIZE_DISPLAY } from '../constants/AppConstants';
import Auth from '../utils/Auth';
import GetDeclaration from '../utils/GetDeclaration';
import LoadingSpinner from './LoadingSpinner';
import { scrollToTop } from '../utils/ScrollToElement';

const FILE_STATUS_PENDING = 'Pending';
const FILE_STATUS_IN_PROGRESS = 'in progress';
const FILE_STATUS_ERROR = 'Error';
const FILE_STATUS_SUCCESS = 'Success';
const MAX_FILES = 8;

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

const MultiFileUploadForm = ({
  endpoint,
  pageHeading,
  submitButtonLabel,
  urlNextPage,
  urlThisPage,
}) => {
  const errorSummaryRef = useRef(null);
  const inputRef = useRef(null);
  const multiple = true;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const declarationId = searchParams.get(URL_DECLARATIONID_IDENTIFIER);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState([]);
  const [filesAddedForUpload, setFilesAddedForUpload] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [maxFilesError, setMaxFilesError] = useState();
  const [supportingDocumentsList, setSupportingDocumentsList] = useState([]);

  const getDeclarationData = async () => {
    const response = await GetDeclaration({ declarationId });
    if (response.data) {
      setSupportingDocumentsList(response?.data?.supporting);
    } else {
      switch (response?.status) {
        case 401:
        case 422:
          Auth.removeToken();
          navigate(SIGN_IN_URL, { state: { redirectURL: urlThisPage } });
          break;
        default: navigate(MESSAGE_URL, {
          state: {
            title: 'Something has gone wrong',
            message: response?.message,
            redirectURL: YOUR_VOYAGES_URL,
          },
        });
      }
    }
    setIsLoading(false);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const scrollToFocusErrors = () => {
    scrollToTop();
    errorSummaryRef?.current?.focus();
  };

  const storeFilesForUpload = async (fileList) => {
    const fileCurrentlyInState = [...filesAddedForUpload];
    const filesUserAdded = [...fileList];
    const errorList = [];
    setMaxFilesError();
    setErrors();
    // Check we do not exceed max file count
    const remainingFilesAvailable = MAX_FILES - (filesAddedForUpload.length + supportingDocumentsList.length);
    if (filesAddedForUpload.length + supportingDocumentsList.length === MAX_FILES) {
      setMaxFilesError(`You've selected too many files: you can add up to ${remainingFilesAvailable} more files`);
      setErrors([`You've selected too many files: you can add up to ${remainingFilesAvailable} more files`]);
      scrollToFocusErrors();
    } else if ((filesAddedForUpload.length > 0 || supportingDocumentsList.length > 0) && (filesAddedForUpload.length + fileList.length + supportingDocumentsList.length > MAX_FILES)) {
      setMaxFilesError(`You've selected too many files: you can add up to ${remainingFilesAvailable} more files`);
      setErrors([`You've selected too many files: you can add up to ${remainingFilesAvailable} more files`]);
      scrollToFocusErrors();
    } else if (fileList.length > MAX_FILES) {
      setMaxFilesError(`You've selected too many files: you can only add ${MAX_FILES}`);
      setErrors([`You've selected too many files: you can only add ${MAX_FILES}`]);
      scrollToFocusErrors();
    } else {
      const newFilesForUpload = filesUserAdded.reduce((results, fileToCheck) => {
        if (supportingDocumentsList.length > 0 && supportingDocumentsList.findIndex((existingFile) => existingFile.filename === fileToCheck.name) !== -1) {
          errorList.push(`A file called ${fileToCheck.name} already exists in your list`);
        } else if (fileCurrentlyInState.length > 0 && fileCurrentlyInState.findIndex((existingFile) => existingFile.file.name === fileToCheck.name) !== -1) {
          errorList.push(`A file called ${fileToCheck.name} already exists in your list`);
        } else {
          results.push({ file: fileToCheck, status: FILE_STATUS_PENDING });
        }
        setErrors(errorList);
        if (errorList.length > 0) {
          scrollToFocusErrors();
        }
        return results;
      }, []);

      setFilesAddedForUpload([...filesAddedForUpload, ...newFilesForUpload]);
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

  const updateFileStatus = ({ file, status, errorMessage, id }) => {
    const updatedFileIndex = filesAddedForUpload.findIndex((existingFile) => existingFile.file.name === file.file.name);
    const newState = [...filesAddedForUpload];
    newState[updatedFileIndex].status = status;
    if (errorMessage) { newState[updatedFileIndex].errorMessage = errorMessage; }
    if (id) { newState[updatedFileIndex].id = id; }
    setFilesAddedForUpload(newState);
  };

  const onUploadFiles = async (e) => {
    e.preventDefault();
    const postFile = async (selectedFile) => {
      const dataToSubmit = new FormData();
      dataToSubmit.append('file', selectedFile?.file, selectedFile?.file?.name);
      try {
        const response = await axios.post(endpoint, dataToSubmit, {
          headers: {
            Authorization: `Bearer ${Auth.retrieveToken()}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        updateFileStatus({ file: selectedFile, status: FILE_STATUS_SUCCESS, id: response.data.attachment_id });
      } catch (err) {
        switch (err?.response?.status) {
          case 400:
            if (err?.response?.data?.message?.startsWith(FILE_TYPE_INVALID_PREFIX)) {
              updateFileStatus({
                file: selectedFile,
                status: FILE_STATUS_ERROR,
                errorMessage: 'The file must be a csv, doc, docm, docx, rtf, txt, xls, xlsm, xlsx, xltm, xltx, xlw or xml',
              });
            } else {
              updateFileStatus({
                file: selectedFile,
                status: FILE_STATUS_ERROR,
                errorMessage: err?.response?.data?.message ? err.response.data.message : 'There was a problem check file and try again',
              });
            }
            break;
          case 401:
          case 422:
            Auth.removeToken();
            navigate(SIGN_IN_URL, { state: { redirectURL: urlThisPage } });
            break;
          default:
            if (selectedFile.file.size >= MAX_SUPPORTING_FILE_SIZE) {
              updateFileStatus({
                file: selectedFile,
                status: FILE_STATUS_ERROR,
                errorMessage: `The file must be smaller than ${MAX_SUPPORTING_FILE_SIZE_DISPLAY}MB`,
              });
            } else {
              updateFileStatus({
                file: selectedFile,
                status: FILE_STATUS_ERROR,
                errorMessage: err?.response?.data?.message ? err.response.data.message : 'There was a problem check file and try again',
              });
            }
        }
        return err;
      }
    };

    const asyncLoop = async () => {
      for (let i = 0; i < filesAddedForUpload.length; i++) {
        if (filesAddedForUpload[i].status === FILE_STATUS_PENDING) {
          updateFileStatus({ file: filesAddedForUpload[i], status: FILE_STATUS_IN_PROGRESS });
          // eslint-disable-next-line no-await-in-loop
          await postFile(filesAddedForUpload[i]);
        }
      }
    };

    asyncLoop();
  };

  const handleDelete = async ({ e, fileName, id }) => {
    e.preventDefault();
    if (id) {
      try {
        const response = await axios({
          method: 'delete',
          url: endpoint,
          data: {
            id: id,
          },
          headers: {
            Authorization: `Bearer ${Auth.retrieveToken()}`,
          },
        },
        );
        if (response?.status == 200) {
          getDeclarationData()
        }
      } catch (err) {
        switch (err?.response?.status) {
          case 401:
          case 422:
            Auth.removeToken();
            navigate(SIGN_IN_URL, { state: { redirectURL: urlThisPage } });
            break;
          default: navigate(MESSAGE_URL, {
            state: {
              title: 'Something has gone wrong',
              message: err?.response?.message,
              redirectURL: YOUR_VOYAGES_URL,
            },
          });
        }
      }
    } else {
      const filtered = filesAddedForUpload.filter((file) => file.file.name !== fileName);
      setFilesAddedForUpload(filtered);
    };
  };

  const onContinue = (e) => {
    e.preventDefault();
    navigate(urlNextPage);
  };

  useEffect(() => {
    setIsLoading(true);
    getDeclarationData();
  }, []);

  useEffect(() => {
    if (errors) {
      errorSummaryRef?.current?.focus();
    }
  }, [errors]);

  /*
   * when the drag goes over our button element in the dragarea,
   * a dragleave event is triggered, and our background starts flickering
   * To get around this issue, when dragActive is true we add an invisible element
   * to cover the entire form. (drag-active')
   * This then listens to the events without interference from any other elements.
   * And this can also handle the drop.
   */

  if (isLoading) { return (<LoadingSpinner />); }

  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-three-quarters">
          {errors.length > 0 && (
            <div className="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" data-module="govuk-error-summary" ref={errorSummaryRef} tabIndex={-1}>
              <div className="govuk-error-summary__body">
                <ul className="govuk-list govuk-error-summary__list multi-file-upload--error-summary">
                  {errors.map((error) => (
                    <li key={error}>
                      <span className="govuk-visually-hidden">Error:</span> {error}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          {pageHeading ? <h1 className="govuk-heading-xl">{pageHeading}</h1> : <h1 className="govuk-heading-xl">Upload files</h1>}
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-three-quarters">
          <form
            id="multiFileUpload"
            onDragEnter={handleDrag}
            onSubmit={(e) => e.preventDefault()}
          >
            <fieldset className="govuk-fieldset">
              <div className={maxFilesError ? 'govuk-form-group govuk-form-group--error' : 'govuk-form-group'}>
                <p id="multiFileUploadForm-error" className="govuk-error-message">
                  <span className="govuk-visually-hidden">Error:</span> {maxFilesError}
                </p>
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
            >
              Upload files
            </button>
          </form>
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-three-quarters">
          {supportingDocumentsList.length > 0 && (
            <>
              <h2 className="govuk-heading-m">Files added</h2>
              {supportingDocumentsList.map((file) => (
                <div key={file.filename} className="govuk-grid-row  govuk-!-margin-bottom-5 multi-file-upload--filelist">
                  <div className="nmsw-grid-column-ten-twelfths">
                    <FileStatusSuccess fileName={file.filename} />
                  </div>
                  <div className="nmsw-grid-column-two-twelfths govuk-!-text-align-right">
                    <button
                      className="govuk-button govuk-button--warning govuk-!-margin-bottom-5"
                      type="button"
                      onClick={(e) => handleDelete({ e, fileName: file.filename, id: file.id })}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
          {filesAddedForUpload.length > 0 && (
            <>
              {supportingDocumentsList.length === 0 && <h2 className="govuk-heading-m">Files added</h2>}
              {filesAddedForUpload.map((file) => (
                <div key={file.file.name} className="govuk-grid-row  govuk-!-margin-bottom-5 multi-file-upload--filelist">
                  <div className="nmsw-grid-column-ten-twelfths">
                    {file.status === FILE_STATUS_IN_PROGRESS && <FileStatusInProgress fileName={file.file.name} />}
                    {file.status === FILE_STATUS_PENDING && <FileStatusPending fileName={file.file.name} />}
                    {file.status === FILE_STATUS_SUCCESS && <FileStatusSuccess fileName={file.file.name} />}
                    {file.status === FILE_STATUS_ERROR && <FileStatusError fileName={file.file.name} errorMessage={file.errorMessage} />}
                  </div>
                  <div className="nmsw-grid-column-two-twelfths govuk-!-text-align-right">
                    <button
                      className="govuk-button govuk-button--warning govuk-!-margin-bottom-5"
                      type="button"
                      onClick={(e) => handleDelete({ e, fileName: file.file.name, id: file.id })}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
          <button
            className="govuk-button govuk-button--primary"
            type="button"
            onClick={onContinue}
          >
            {submitButtonLabel || 'Save and continue'}
          </button>
        </div>
      </div>
    </>
  );
};

export default MultiFileUploadForm;

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

MultiFileUploadForm.propTypes = {
  endpoint: PropTypes.string.isRequired,
  pageHeading: PropTypes.string.isRequired,
  submitButtonLabel: PropTypes.string.isRequired,
  urlNextPage: PropTypes.string.isRequired,
  urlThisPage: PropTypes.string.isRequired,
};
