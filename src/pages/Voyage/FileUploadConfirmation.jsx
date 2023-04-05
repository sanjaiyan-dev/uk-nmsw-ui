import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { URL_DECLARATIONID_IDENTIFIER, VOYAGE_TASK_LIST_URL, YOUR_VOYAGES_URL } from '../../constants/AppUrlConstants';
import Message from '../../components/Message';

const FileUploadConfirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const declarationId = searchParams.get(URL_DECLARATIONID_IDENTIFIER);
  document.title = 'No errors found';

  if (!declarationId) {
    return (
      <Message title="Something has gone wrong" redirectURL={YOUR_VOYAGES_URL} />
    );
  }

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
                {`${state?.fileName ? state?.fileName : 'File'} uploaded`}
              </h3>
            </div>
          </div>
          <button
            type="button"
            className="govuk-button"
            data-module="govuk-button"
            onClick={() => navigate(`${VOYAGE_TASK_LIST_URL}?${URL_DECLARATIONID_IDENTIFIER}=${declarationId}`)}
          >
            Save and continue
          </button>
        </div>
      </div>
    </>
  );
};

export default FileUploadConfirmation;
