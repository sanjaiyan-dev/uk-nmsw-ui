import { SERVICE_NAME } from '../../constants/AppConstants';

const Help = () => {
  document.title = SERVICE_NAME;
  return (
    <>
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-full">
        <h1 className="govuk-heading-xl">{`Help and support for the ${SERVICE_NAME}`}</h1>
      </div>
    </div>
    <div className="govuk-grid-row">
    <div className="govuk-grid-column-two-thirds">
      <p>Information</p>
    </div>
  </div>
  <div className="govuk-grid-row">
    <div className="govuk-grid-column-one-half">
      <p>Contect details</p>
    </div>
    <div className="govuk-grid-column-one-half">
      <p>Image</p>
    </div>
  </div>
  </>
  );
};

export default Help;
