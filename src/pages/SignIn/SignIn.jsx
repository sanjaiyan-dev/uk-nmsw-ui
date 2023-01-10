import { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { REGISTER_ACCOUNT_URL } from '../../constants/AppUrlConstants';
import { UserContext } from '../../context/userContext';
import {
  FIELD_EMAIL,
  FIELD_PASSWORD,
  SIGN_IN_FORM,
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

const SignIn = () => {
  const { signIn, user } = useContext(UserContext);
  const navigate = useNavigate();
  const { state } = useLocation();
  document.title = 'Sign in';

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

  const handleSubmit = ({ formData }) => {
    if (user.email !== formData.email) {
      sessionStorage.removeItem('formData');
    }
    signIn({ formData });
    state?.redirectURL ? navigate(state.redirectURL) : navigate(DASHBOARD_URL);
  };

  return (
    <>
      <DisplayForm
        pageHeading="Sign in"
        formId='formSignIn'
        fields={formFields}
        formActions={formActions}
        formType={SIGN_IN_FORM}
        keepSessionOnSubmit={state?.redirectURL ? true : false}
        handleSubmit={handleSubmit}
      >
        <SupportingText />
      </DisplayForm>
    </>
  );
};

export default SignIn;
