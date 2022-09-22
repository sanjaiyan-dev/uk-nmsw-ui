import { SERVICE_NAME } from '../../constants/AppConstants';

const Landing = () => {
  return (
    <>
      <h1 className="govuk-heading-l">{SERVICE_NAME}</h1>
      <p className="govuk-body">Use this service to:</p>
    </>
  );
};

export default Landing;
