import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import { GENERAL_DECLARATION_TEMPLATE_NAME, MAX_FILE_SIZE, MAX_FILE_SIZE_DISPLAY } from '../constants/AppConstants';
import {
  FILE_MISSING,
  FILE_TYPE_INVALID_PREFIX,
  FAL6_IS_EMPTY,
} from '../constants/AppAPIConstants';
import {
  FILE_UPLOAD_FIELD_ERRORS_URL,
  LOGGED_IN_LANDING,
  MESSAGE_URL,
  SIGN_IN_URL,
} from '../constants/AppUrlConstants';
import Auth from '../utils/Auth';
import MapErrorMessages from '../utils/MapErrorMessages';
import { scrollToTop } from '../utils/ScrollToElement';

const FileUploadForm = ({
  endpoint,
  errorMessageMapFile,
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
  const errorSummaryRef = useRef(null);
  const FIELD_ERROR = 'fieldError';
  const FILE_ERROR = 'fileError';
  const FILE_UPLOAD_ID = 'fileUploadInput';
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState({});
  const errorsExist = !!error;

  const scrollToErrorField = () => {
    fileInputRef.current.scrollIntoView({ block: 'start' });
  };

  const handleErrors = ({ errType, errMessage, errData }) => {
    if (errType === FILE_ERROR) {
      setError({ id: FILE_UPLOAD_ID, message: errMessage });
      scrollToTop();
      errorSummaryRef?.current?.focus();
      setIsLoading(false);
    } else {
      const errorList = MapErrorMessages({ errData, errorMessageMapFile });
      navigate(FILE_UPLOAD_FIELD_ERRORS_URL, {
        state: {
          errorList,
          fileName: selectedFile?.file?.name,
          returnURL: urlThisPage,
        },
      });
    }
  };

  /*
   * Currently invalid date/time formats will return a 500 error
   * when this is fixed in the backend we can remove this handler and just use
   * the navigate(MESSAGE_URL) code in it's place (in the catch switch statement)
   * Until then we want to give users a friendly error message
   * So this handler checks if the file is a FAL file and returns friendly error
   * if it is, and default error if it is not
   */
  const handleDefaultError = (err) => {
    let button;
    let message = err.response?.data?.message;
    let title = 'Something has gone wrong';

    if (fileNameRequired === GENERAL_DECLARATION_TEMPLATE_NAME) {
      title = 'Upload failed';
      message = 'There are formatting errors in the excel file that we cannot identify. These errors may be incorrect date or time formats: you need to use dd/mm/yyyy and HH:MM. You can re-upload the file when you have fixed these errors.';
      button = {
        buttonLabel: 'Re-upload file',
        buttonNavigateTo: urlThisPage,
      };
    }
    navigate(MESSAGE_URL, {
      state: {
        title,
        button,
        message,
        redirectURL: urlThisPage,
      },
    });
  };

  const handleFileSelected = (e) => {
    setSelectedFile({
      file: e.target.files[0],
    });
    setError(); // clear any errors
  };

  const handleUpload = async () => {
    setIsLoading(true);

    if (Object.entries(selectedFile).length < 1) {
      handleErrors({ errType: FILE_ERROR, errMessage: 'Select a file' });
    } else if (selectedFile?.file.size > MAX_FILE_SIZE) {
      handleErrors({ errType: FILE_ERROR, errMessage: `The file must be smaller than ${MAX_FILE_SIZE_DISPLAY}MB` });
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
          navigate(urlSuccessPage, { state: { fileName: selectedFile?.file?.name } });
        } else {
          handleDefaultError(); // We should not get a positive response that is not a 200, this is a catch to go to the generic 'something went wrong' in case we do
        }
      } catch (err) {
        switch (err?.response?.status) {
          case 400:
            if (err?.response?.data?.message === FILE_MISSING) {
              handleErrors({ errType: FILE_ERROR, errMessage: 'Select a file' });
            } else if (err?.response?.data?.message?.startsWith(FILE_TYPE_INVALID_PREFIX)) {
              handleErrors({ errType: FILE_ERROR, errMessage: `The file must be a ${fileTypesAllowed}` });
            } else if (err?.response?.data?.message === FAL6_IS_EMPTY) {
              handleErrors({ errType: FILE_ERROR, errMessage: 'Template is empty' });
            } else {
              handleErrors({ errType: FIELD_ERROR, errData: err?.response?.data });
            }
            break;
          case 401:
          case 422:
            Auth.removeToken();
            navigate(SIGN_IN_URL, { state: { redirectURL: urlThisPage } });
            break;
          case 404:
            navigate(MESSAGE_URL, {
              state: {
                title: 'Something has gone wrong',
                message: err.response?.data?.message,
                redirectURL: LOGGED_IN_LANDING,
              },
            });
            break;
          default: handleDefaultError(err);
        }
      }
    }
  };

  useEffect(() => {
    if (errorsExist) {
      errorSummaryRef?.current?.focus();
    }
  }, [errorsExist]);

  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          {error && (
            <div className="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" data-module="govuk-error-summary" ref={errorSummaryRef} tabIndex={-1}>
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
        <form id={formId} className="govuk-grid-column-full" autoComplete="off">
          <div className={error ? 'govuk-form-group govuk-form-group--error' : 'govuk-form-group'}>
            <label className="govuk-label" htmlFor={FILE_UPLOAD_ID} ref={fileInputRef}>
              {pageHeading && <h1 className="govuk-heading-xl">{pageHeading}</h1>}
            </label>
            <div className="govuk-grid-row">
              <div className="govuk-grid-column-three-quarters below-h1">
                {children}
              </div>
            </div>
            <p id={`${FILE_UPLOAD_ID}-error`} className="govuk-error-message">
              <span className="govuk-visually-hidden">Error:</span> {error?.message}
            </p>
            <input
              className="govuk-file-upload"
              data-testid={FILE_UPLOAD_ID}
              disabled={isLoading}
              id={FILE_UPLOAD_ID}
              name={FILE_UPLOAD_ID}
              type="file"
              onChange={handleFileSelected}
            />
          </div>
          <div className="govuk-button-group">
            <button
              type="button"
              className="govuk-button"
              data-module="govuk-button"
              disabled={isLoading}
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
  endpoint: PropTypes.string.isRequired,
  errorMessageMapFile: PropTypes.object,
  fileNameRequired: PropTypes.string.isRequired,
  fileTypesAllowed: PropTypes.string.isRequired,
  formId: PropTypes.string.isRequired,
  pageHeading: PropTypes.string.isRequired,
  submitButtonLabel: PropTypes.string.isRequired,
  urlSuccessPage: PropTypes.string.isRequired,
  urlThisPage: PropTypes.string.isRequired,
};
