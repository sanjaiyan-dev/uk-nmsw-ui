import { useLocation } from 'react-router-dom';
import {
  DISPLAY_DETAILS,
  FIELD_EMAIL,
  SINGLE_PAGE_FORM,
  VALIDATE_EMAIL_ADDRESS,
} from '../../constants/AppConstants';
import DisplayForm from '../../components/DisplayForm';

const SupportingText = () => (
  <p className="govuk-body">Emails sometimes take a few minutes to arrive. If you didn&apos;t receive the link, you can request a new one.</p>
);

const RegisterEmailResend = () => {
  const { state } = useLocation();
  document.title = 'Resend verification email';

  const formActions = {
    submit: {
      className: 'govuk-button',
      dataModule: 'govuk-button',
      dataTestid: 'submit-button',
      label: 'Send confirmation email',
      type: 'button',
    },
  };
  const formFields = [
    {
      type: FIELD_EMAIL,
      displayType: DISPLAY_DETAILS,
      fieldName: 'emailAddress',
      label: 'Email address',
      linkText: 'Change where the email was sent',
      validation: [
        {
          type: VALIDATE_EMAIL_ADDRESS,
          message: 'Enter an email address in the correct format, like name@example.com',
        },
      ],
    },
  ];

  const handleSubmit = (formData) => {
    console.log('state', state);
    console.log('formData', formData);
  };

  return (
    <DisplayForm
      formId="formSecondPage"
      fields={formFields}
      formActions={formActions}
      formType={SINGLE_PAGE_FORM}
      pageHeading="Request a new verification link"
      handleSubmit={handleSubmit}
    >
      <SupportingText />
    </DisplayForm>
  );
};

export default RegisterEmailResend;
