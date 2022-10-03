import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import { FIELD_EMAIL, FIELD_PASSWORD } from '../../constants/AppConstants';
import { DASHBOARD_URL } from '../../constants/AppUrlConstants';
import DisplayForm from '../../components/DisplayForm';

const SignIn = (userDetails) => {
  const tempHardCodedUser = Object.entries(userDetails).length > 0 ? userDetails.user : { name: 'MockedUser' };
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  // Form fields
  const formFields = [
    {
      type: FIELD_EMAIL,
      label: 'Email address',
      hint: 'Enter the email address you used when you created your account',
      fieldName: 'email',
    },
    {
      type: FIELD_PASSWORD,
      label: 'Password',
      fieldName: 'password',
    }
  ];


  const handleSubmit = (e, formData) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <h1 className="govuk-heading-l" data-testid="signin-h1">Sign in</h1>
        <DisplayForm
          fields={formFields}
          handleSubmit={handleSubmit}
        />

        <hr />
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
          Button to mock sign in to test nav
        </button>
      </div>
    </div>
  );
};

export default SignIn;
