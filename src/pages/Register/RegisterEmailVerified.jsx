// import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
// import { REGISTER_CHECK_TOKEN_ENDPOINT } from '../../constants/AppAPIConstants';
import { REGISTER_DETAILS_URL } from '../../constants/AppUrlConstants';

const RegisterEmailVerified = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [title, setTitle] = useState();
  const [blurb, setBlurb] = useState();
  const [button, setButton] = useState({});
  document.title = 'Your email address has been verified';

  // sample URL
  // http://localhost:3000/activate-account?email=jentestemail@email.com&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImM4OWY0MjlhLTMxOGQtNDhiZC1iODE3LWZkMWJjOTYyMWYyM0BtYWlsc2x1cnAuY29tIiwiZXhwIjoxNjczMzg0NzgyLCJqaXQiOiJiMGJiOWZlNi0yMzhiLTRiNzgtYjA1Zi0wODc3NDAxNTc3YWQifQ.FiUsaU4Mqth4cnQl4a6YZMOVn2OEQ5I6JjI1T2c1WYc

  // make call to /check-token to check token validity
  const checkTokenIsValid = async () => {
    try {
      // const response = await axios.get(REGISTER_CHECK_TOKEN_ENDPOINT, {
      //   headers: { token: searchParams.get('token')}
      // });
      const response = '204';

      if (response === '204') { // I think may not need the if statement here as 204 is the success response
        setTitle('Your email address has been verified');
        setBlurb('You can continue creating your account');
        setButton({
          label: 'Continue',
          navigateTo: REGISTER_DETAILS_URL,
          state: { 'state': { 'dataToSubmit': { 'emailAddress': 'testemail@email.com' } } }
        });
      }
    } catch (err) {
      console.log('error', err);
    }
  };
  // assume call returns 204 valid response
  // show user 'email validated, click here to go to your-details' page

  useEffect(() => {
    checkTokenIsValid();
  }, [searchParams]);

  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <h1 className="govuk-heading-xl">{title}</h1>
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <p className="govuk-body">{blurb}</p>
          <button
            className="govuk-button"
            data-module="govuk-button"
            type="button"
            onClick={() => { navigate(button.navigateTo, button.state); }}
          >
            Continue
          </button>
        </div>
      </div>
    </>
  );
};

export default RegisterEmailVerified;
