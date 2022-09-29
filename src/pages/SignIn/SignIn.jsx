import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import { DASHBOARD_URL } from '../../constants/AppUrlConstants';

const SignIn = (userDetails) => {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  const tempHardCodedUser = Object.entries(userDetails).length > 0 ? userDetails.user : { name: 'MockedUser' };

  return (
    <>
      <h1 className="govuk-heading-l" data-testid="signin-h1">Sign in</h1>
      <button
        className="govuk-button"
        data-module="govuk-button"
        data-testid="signin-button"
        type="button"
        onClick={async () => {
          await login({ ...tempHardCodedUser });
          navigate(DASHBOARD_URL);
        }}
      >
        Sign in
      </button>
    </>
  );
};

export default SignIn;
