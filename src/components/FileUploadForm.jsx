import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import { MAX_FILE_SIZE, MAX_FILE_SIZE_DISPLAY } from '../constants/AppConstants';
import { FILE_MISSING, FILE_TYPE_INVALID_PREFIX } from '../constants/AppAPIConstants';
import { LOGGED_IN_LANDING, MESSAGE_URL, SIGN_IN_URL } from '../constants/AppUrlConstants';
import Auth from '../utils/Auth';
import { scrollToTop } from '../utils/ScrollToElement';

const FileUploadForm = ({
  declarationId,
  endpoint,
  fileNameRequired,
  fileTypesAllowed,
  formId,
  pageHeading,
  submitButtonLabel,
  urlSuccessPage,
  urlThisPage,
  children,
}) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const fileUploadId = 'fileUploadInput';
  const [error, setError] = useState();
  const [selectedFile, setSelectedFile] = useState({});

  const scrollToErrorField = () => {
    fileInputRef.current.scrollIntoView({ block: 'start' });
  };

  const handleFileSelected = (e) => {
    setSelectedFile({
      file: e.target.files[0],
    });
    setError(); // clear any errors
  };

  const handleUpload = async () => {
    if (Object.entries(selectedFile).length < 1) {
      setError({ id: fileUploadId, message: `Select a ${fileNameRequired}` });
      scrollToTop();
    } else if (selectedFile?.file.size > MAX_FILE_SIZE) {
      setError({ id: fileUploadId, message: `The file must be smaller than ${MAX_FILE_SIZE_DISPLAY}MB` });
      scrollToTop();
    } else {
      const dataToSubmit = new FormData();
      dataToSubmit.append('file', selectedFile?.file, selectedFile?.file?.name);

      try {
        const response = await axios.post(endpoint, dataToSubmit, {
          headers: {
            Authorization: `Bearer ${Auth.retrieveToken()}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          navigate(urlSuccessPage, { state: { declarationId, fileName: selectedFile?.file?.name } });
        }
      } catch (err) {
        if (err?.response?.status === 401 || err?.response?.status === 422) {
          // UNAUTHORISED / missing bearer token / token invalidated
          navigate(SIGN_IN_URL, { state: { redirectURL: urlThisPage, declarationId } });
        } else if (err?.response?.data?.message === FILE_MISSING) {
          // MISSING FILE from payload (shouldn't occur as we error out prior to POST attempt, this is an extra catch)
          setError({ id: fileUploadId, message: `Select a ${fileNameRequired}` });
          scrollToTop();
        } else if (err?.response?.data?.message.startsWith(FILE_TYPE_INVALID_PREFIX)) {
          // file type provided is not allowed
          setError({ id: fileUploadId, message: `The selected file must be a ${fileTypesAllowed}` });
          scrollToTop();
        } else if (err?.response?.status === 404) {
          // INVALID ENDPOINT, likely missing/invalid declarationId
          navigate(MESSAGE_URL, {
            state: {
              title: 'Something has gone wrong',
              message: err.response?.data?.message,
              redirectURL: LOGGED_IN_LANDING,
              declarationId,
            },
          });
        } else {
          // OTHER ERRORS, 500 errors are caught here
          navigate(MESSAGE_URL, {
            state: {
              title: 'Something has gone wrong',
              message: err.response?.data?.message,
              redirectURL: urlThisPage,
              declarationId,
            },
          });
        }
      }
    }
  };

  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          {error && (
            <div className="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" data-module="govuk-error-summary">
              <h2 className="govuk-error-summary__title" id="error-summary-title">
                There is a problem
              </h2>
              <div className="govuk-error-summary__body">
                <ul className="govuk-list govuk-error-summary__list">
                  <li>
                    <button
                      className="govuk-button--text"
                      type="button"
                      onClick={(e) => {
                        scrollToErrorField(e, error.id);
                      }}
                    >
                      {error?.message}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="govuk-grid-row">
        {pageHeading && <h1 className="govuk-heading-xl govuk-grid-column-full">{pageHeading}</h1>}
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-three-quarters below-h1">
          {children}
        </div>
      </div>
      <div className="govuk-grid-row">
        <form id={formId} className="govuk-grid-column-full" autoComplete="off">
          <div className={error ? 'govuk-form-group govuk-form-group--error' : 'govuk-form-group'}>
            <label className="govuk-label" htmlFor={fileUploadId} ref={fileInputRef}>
              Upload a file
            </label>
            <p id={`${fileUploadId}-error`} className="govuk-error-message">
              <span className="govuk-visually-hidden">Error:</span> {error?.message}
            </p>
            <input
              className="govuk-file-upload"
              data-testid={fileUploadId}
              id={fileUploadId}
              name={fileUploadId}
              type="file"
              onChange={handleFileSelected}
            />
          </div>
          <div className="govuk-button-group">
            <button
              type="button"
              className="govuk-button"
              data-module="govuk-button"
              onClick={handleUpload}
            >
              {submitButtonLabel}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default FileUploadForm;

FileUploadForm.propTypes = {
  children: PropTypes.node, // allows any renderable object
  declarationId: PropTypes.string.isRequired,
  endpoint: PropTypes.string.isRequired,
  fileNameRequired: PropTypes.string.isRequired,
  fileTypesAllowed: PropTypes.string.isRequired,
  formId: PropTypes.string.isRequired,
  pageHeading: PropTypes.string.isRequired,
  submitButtonLabel: PropTypes.string.isRequired,
  urlSuccessPage: PropTypes.string.isRequired,
  urlThisPage: PropTypes.string.isRequired,
};
