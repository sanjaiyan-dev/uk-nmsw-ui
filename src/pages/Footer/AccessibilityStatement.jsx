import { SERVICE_NAME } from '../../constants/AppConstants';

const AccessibilityStatement = () => {
  return (
    <>
      <h1 className="govuk-heading-l">{`Accessibility statement for ${SERVICE_NAME}`}</h1>
    </>
  );
};

export default AccessibilityStatement;
