import { Link, useLocation } from 'react-router-dom';
import { SERVICE_NAME } from '../../constants/AppConstants';
import { LANDING_URL } from '../../constants/AppUrlConstants';

const GenericMessage = () => {
  const { state } = useLocation();
  document.title = state?.title || SERVICE_NAME;
  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <h1 className="govuk-heading-xl">{state?.title}</h1>
        {state?.message && <p className="govuk-body">{state?.message}</p>}
        <Link to={state?.redirectURL || LANDING_URL}>Click here to continue</Link>
      </div>
    </div>
  );
};

export default GenericMessage;
