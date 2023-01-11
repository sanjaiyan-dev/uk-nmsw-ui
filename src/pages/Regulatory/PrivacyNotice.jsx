import { SERVICE_NAME } from '../../constants/AppConstants';

const PrivacyNotice = () => {
  document.title = `Privacy notice for ${SERVICE_NAME}`;
  return (
    <>
      <h1 className="govuk-heading-l">{`Privacy notice for ${SERVICE_NAME}`}</h1>
    </>
  );
};

export default PrivacyNotice;
