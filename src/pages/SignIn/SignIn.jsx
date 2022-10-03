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
  const formActions = {
    submit: {
      className: 'govuk-button',
      dataModule: 'govuk-button',
      dataTestid: 'signin-button',
      type: 'button',
    }
  };
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
    login({ ...tempHardCodedUser });
    navigate(DASHBOARD_URL);
  };

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <h1 className="govuk-heading-l" data-testid="signin-h1">Sign in</h1>
        <DisplayForm
          fields={formFields}
          formActions={formActions}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default SignIn;
