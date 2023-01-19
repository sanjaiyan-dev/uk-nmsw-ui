import { useLocation } from 'react-router-dom';

const FileUploadConfirmation = () => {
  const { state } = useLocation();
  document.title = 'No errors found';

  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <h1 className="govuk-heading-xl">No errors found</h1>
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <div className="govuk-notification-banner govuk-notification-banner--success" role="alert" aria-labelledby="govuk-notification-banner-title" data-module="govuk-notification-banner">
            <div className="govuk-notification-banner__header">
              <h2 className="govuk-notification-banner__title" id="govuk-notification-banner-title">
                Success
              </h2>
            </div>
            <div className="govuk-notification-banner__content">
              <h3 className="govuk-notification-banner__heading">
                {`${state.fileType ? state.fileType : ''} uploaded`}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FileUploadConfirmation;
