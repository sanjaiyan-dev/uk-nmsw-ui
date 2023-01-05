import { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { REGISTER_ACCOUNT_URL } from '../../constants/AppUrlConstants';
import { UserContext } from '../../context/userContext';
import {
  FIELD_EMAIL,
  FIELD_PASSWORD,
  SINGLE_PAGE_FORM,
  VALIDATE_EMAIL_ADDRESS,
  VALIDATE_REQUIRED,
} from '../../constants/AppConstants';
import { DASHBOARD_URL } from '../../constants/AppUrlConstants';
import DisplayForm from '../../components/DisplayForm';

const SupportingText = () => {
  return (
    <>
      <div className="govuk-inset-text">
        <p className="govuk-body">If you do not have an account, you can <Link to={REGISTER_ACCOUNT_URL}>create one now</Link>.</p>
      </div>
    </>
  );
};

const SignIn = (userDetails) => {
  const tempHardCodedUser = Object.entries(userDetails).length > 0 ? userDetails.user : { name: 'MockedUser' };
  const { signIn } = useContext(UserContext);
  const navigate = useNavigate();
  const { state } = useLocation();

  // Form fields
  const formActions = {
    submit: {
      label: 'Sign in',
    }
  };
  const formFields = [
    {
      type: FIELD_EMAIL,
      label: 'Email address',
      fieldName: 'email',
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter your email address',
        },
        {
          type: VALIDATE_EMAIL_ADDRESS,
          message: 'Enter your email address in the correct format, like name@example.com',
        },
      ],
    },
    {
      type: FIELD_PASSWORD,
      label: 'Password',
      fieldName: FIELD_PASSWORD, // fieldname must be password as when fieldname is password we do not store value to session storage
      validation: [
        {
          type: VALIDATE_REQUIRED,
          message: 'Enter your password',
        },
      ],
    },
  ];

  const handleSubmit = () => {
    signIn({ ...tempHardCodedUser });
    state?.redirectUrl ? navigate(state.redirectUrl) : navigate(DASHBOARD_URL);
  };

  return (
    <>
      <DisplayForm
        pageHeading="Sign in"
        formId='formSignIn'
        fields={formFields}
        formActions={formActions}
        formType={SINGLE_PAGE_FORM}
        handleSubmit={handleSubmit}
      >
        <SupportingText />
      </DisplayForm>
    </>
  );
};

export default SignIn;
