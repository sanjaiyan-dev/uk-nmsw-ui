import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import '../assets/css/multiFileUploadForm.scss';
import { FILE_TYPE_INVALID_PREFIX } from '../constants/AppAPIConstants';
import {
  FILE_STATUS_ERROR,
  FILE_STATUS_IN_PROGRESS,
  FILE_STATUS_PENDING,
  FILE_STATUS_SUCCESS,
  MAX_SUPPORTING_FILE_SIZE,
  MAX_SUPPORTING_FILE_SIZE_DISPLAY,
} from '../constants/AppConstants';
import {
  MESSAGE_URL,
  SIGN_IN_URL,
  URL_DECLARATIONID_IDENTIFIER,
  YOUR_VOYAGES_URL,
} from '../constants/AppUrlConstants';
import Auth from '../utils/Auth';
import GetDeclaration from '../utils/GetDeclaration';
import handleAuthErrors from '../utils/API/handleAuthErrors';
import LoadingSpinner from './LoadingSpinner';
import { scrollToTop } from '../utils/ScrollToElement';
import DragDropZone from './MultiFileUpload/DragDropZone';
import FileList from './MultiFileUpload/FileList';

const MAX_FILES = 8;

const MultiFileUploadForm = ({
  endpoint,
  pageHeading,
  submitButtonLabel,
  urlNextPage,
  urlThisPage,
}) => {
  const errorSummaryRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const declarationId = searchParams.get(URL_DECLARATIONID_IDENTIFIER);
  const [disableButtons, setDisableButtons] = useState(false);
  const [errors, setErrors] = useState([]);
  const [filesAddedForUpload, setFilesAddedForUpload] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingFilelist, setIsLoadingFilelist] = useState(false);
  const [maxFilesError, setMaxFilesError] = useState();
  const [supportingDocumentsList, setSupportingDocumentsList] = useState([]);

  const getPendingFiles = () => {
    const pendingFiles = filesAddedForUpload.reduce((results, fileToCheck) => {
      if (fileToCheck.status === FILE_STATUS_PENDING) {
        results.push(fileToCheck);
      }
      return results;
    }, []);
    setFilesAddedForUpload(pendingFiles);
  };

  const getDeclarationData = async () => {
    setIsLoadingFilelist(true);
    const response = await GetDeclaration({ declarationId });
    if (response.data) {
      const addedStatus = response.data.supporting.map((document) => ({
        ...document,
        status: FILE_STATUS_SUCCESS,
      }));
      setSupportingDocumentsList(addedStatus);
      if (filesAddedForUpload.length > 0) {
        getPendingFiles();
      }
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
    setIsLoadingFilelist(false);
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
          results.push({ file: fileToCheck, filename: fileToCheck.name, status: FILE_STATUS_PENDING });
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

  const updateFileStatus = ({
    file, status, errorMessage, id,
  }) => {
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
        setDisableButtons(true);
        const response = await axios.post(endpoint, dataToSubmit, {
          headers: {
            Authorization: `Bearer ${Auth.retrieveToken()}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        updateFileStatus({ file: selectedFile, status: FILE_STATUS_SUCCESS, id: response.data.attachment_id });
        return response;
      } catch (err) {
        if (selectedFile.file.size >= MAX_SUPPORTING_FILE_SIZE) {
          updateFileStatus({
            file: selectedFile,
            status: FILE_STATUS_ERROR,
            errorMessage: `The file must be smaller than ${MAX_SUPPORTING_FILE_SIZE_DISPLAY}MB`,
          });
        } else if (err?.response?.data?.message?.startsWith(FILE_TYPE_INVALID_PREFIX)) {
          updateFileStatus({
            file: selectedFile,
            status: FILE_STATUS_ERROR,
            errorMessage: 'The file must be a csv, doc, docm, docx, rtf, txt, xls, xlsm, xlsx, xltm, xltx, xlw or xml',
          });
        } else if (err?.response?.status === 401 || err?.response?.status === 422) {
          handleAuthErrors({ error: err, navigate, redirectUrl: urlThisPage });
        } else {
          updateFileStatus({
            file: selectedFile,
            status: FILE_STATUS_ERROR,
            errorMessage: err?.response?.data?.message ? err.response.data.message : 'There was a problem check file and try again',
          });
        }
        return err;
      } finally {
        setDisableButtons(false);
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
        setDisableButtons(true);

        /* If user has just uploaded a file it doesn't exist in the supportingDocumentsList
         * however if they uploaded it previously it does
         * so on delete we have to check two places to change status to in progress
         * which in turn shows the loading spinner
         * TODO: refactor this to make it less repetative
         */
        const indexInSupportingDocumentsList = supportingDocumentsList.findIndex((existingFile) => existingFile.id === id);
        if (indexInSupportingDocumentsList !== -1) {
          const newState = [...supportingDocumentsList];
          newState[indexInSupportingDocumentsList].status = FILE_STATUS_IN_PROGRESS;
          setSupportingDocumentsList(newState);
        } else {
          updateFileStatus({ file: { file: { name: fileName } }, status: FILE_STATUS_IN_PROGRESS });
        }

        await axios({
          method: 'delete',
          url: endpoint,
          headers: {
            Authorization: `Bearer ${Auth.retrieveToken()}`,
          },
          data: {
            id,
          },
        });
        getDeclarationData();
      } catch (err) {
        switch (err?.response?.status) {
          case 401:
          case 422:
            handleAuthErrors({ error: err, navigate, redirectUrl: urlThisPage });
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
    }
  };

  const onContinue = (e) => {
    e.preventDefault();
    navigate(urlNextPage);
  };

  useEffect(() => {
    setIsLoading(true);
    setDisableButtons(true);
    getDeclarationData();
  }, []);

  useEffect(() => {
    if (errors) {
      errorSummaryRef?.current?.focus();
    }
  }, [errors]);

  useEffect(() => {
    if (!isLoadingFilelist) {
      setDisableButtons(false);
    }
  }, [isLoadingFilelist]);

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

      <DragDropZone
        maxFilesError={maxFilesError}
        onUploadFiles={onUploadFiles}
        disableButtons={disableButtons}
        storeFilesForUpload={storeFilesForUpload}
      />

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-three-quarters">
          {(filesAddedForUpload.length > 0 || supportingDocumentsList.length > 0) && <h2 className="govuk-heading-m">Files added</h2>}
          <FileList
            files={supportingDocumentsList}
            disableButtons={disableButtons}
            handleDelete={handleDelete}
          />
          <FileList
            files={filesAddedForUpload}
            disableButtons={disableButtons}
            handleDelete={handleDelete}
          />
          <button
            className="govuk-button govuk-button--primary"
            type="button"
            onClick={onContinue}
            disabled={disableButtons}
          >
            {submitButtonLabel || 'Save and continue'}
          </button>
        </div>
      </div>
    </>
  );
};

export default MultiFileUploadForm;

MultiFileUploadForm.propTypes = {
  endpoint: PropTypes.string.isRequired,
  pageHeading: PropTypes.string.isRequired,
  submitButtonLabel: PropTypes.string.isRequired,
  urlNextPage: PropTypes.string.isRequired,
  urlThisPage: PropTypes.string.isRequired,
};
