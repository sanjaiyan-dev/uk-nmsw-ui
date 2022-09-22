import { Link } from 'react-router-dom';
import { SERVICE_NAME } from '../../constants/AppConstants';
import { SIGN_IN_URL } from '../../constants/AppUrlConstants';

const Landing = () => {
  return (
    <>
      <h1 className="govuk-heading-l">{SERVICE_NAME}</h1>
      <p className="govuk-body">Use this service to:</p>
      <Link 
        to={SIGN_IN_URL}
        role="button"
        draggable="false"
        className="govuk-button govuk-button--start"
        data-module="govuk-button"
      >
        Start now
        <svg 
          className="govuk-button__start-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="17.5"
          height="19"
          viewBox="0 0 33 40"
          aria-hidden="true"
          focusable="false"
        >
          <path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z" />
        </svg>
      </Link>
    </>
  );
};

export default Landing;
