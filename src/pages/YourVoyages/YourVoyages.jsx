import { SERVICE_NAME } from '../../constants/AppConstants';

const YourVoyages = () => {
  document.title = SERVICE_NAME;
  return (
    <>
      <h1 className="govuk-heading-xl govuk-!-margin-bottom-4">Your voyages</h1>
      <div className="govuk-inset-text">
        <p className="govuk-body">You have not reported any voyages yet</p>
      </div>
      <button className="govuk-button">
        Report a voyage
      </button>
    </>
  );
};

export default YourVoyages;
