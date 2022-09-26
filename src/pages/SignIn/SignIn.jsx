import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import { DASHBOARD_URL } from '../../constants/AppUrlConstants';

const SignIn = () => {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  const tempHardCodedUser = { name: 'MockedUser' };

  return (
    <>
      <h1 className="govuk-heading-l">Sign in</h1>
      <button
        className="govuk-button" data-module="govuk-button"
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
