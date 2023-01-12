// import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
// import { REGISTER_CHECK_TOKEN_ENDPOINT } from '../../constants/AppAPIConstants';
import { REGISTER_DETAILS_URL } from '../../constants/AppUrlConstants';

const RegisterEmailVerified = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [pageContent, setPageContent] = useState({});
  document.title = 'Your email address has been verified';

  // sample URL
  // http://localhost:3000/activate-account?email=jentestemail@email.com&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImM4OWY0MjlhLTMxOGQtNDhiZC1iODE3LWZkMWJjOTYyMWYyM0BtYWlsc2x1cnAuY29tIiwiZXhwIjoxNjczMzg0NzgyLCJqaXQiOiJiMGJiOWZlNi0yMzhiLTRiNzgtYjA1Zi0wODc3NDAxNTc3YWQifQ.FiUsaU4Mqth4cnQl4a6YZMOVn2OEQ5I6JjI1T2c1WYc

  // make call to /check-token to check token validity
  const checkTokenIsValid = async () => {
    try {
      // const response = await axios.get(REGISTER_CHECK_TOKEN_ENDPOINT, {
      //   headers: { token: searchParams.get('token')}
      // });
      const response = '209';

      if (response === '209') { // I think may not need the if statement here as 204 is the success response
        setPageContent({
          title: 'Your email address has been verified',
          blurb: 'You can continue creating your account',
          buttonLabel: 'Continue',
          buttonNavigateTo: REGISTER_DETAILS_URL,
          buttonState: { 'state': { 'dataToSubmit': { 'emailAddress': searchParams.get('email') } } },
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
  }, []);

  // if (Object.entries(pageContent).length === 0) { console.log('loading'); }
  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <h1 className="govuk-heading-xl">{pageContent.title}</h1>
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <p className="govuk-body">{pageContent.blurb}</p>
          <button
            className="govuk-button"
            data-module="govuk-button"
            type="button"
            onClick={() => { navigate(pageContent.buttonNavigateTo, pageContent.buttonState); }}
          >
            {pageContent.buttonLabel}
          </button>
        </div>
      </div>
    </>
  );
};

export default RegisterEmailVerified;
