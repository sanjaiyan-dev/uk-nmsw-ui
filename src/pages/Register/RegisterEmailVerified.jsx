import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { REGISTER_CHECK_TOKEN_ENDPOINT, TOKEN_USED_TO_REGISTER } from '../../constants/AppAPIConstants';
import { ERROR_ACCOUNT_ALREADY_ACTIVE_URL, REGISTER_DETAILS_URL } from '../../constants/AppUrlConstants';

const RegisterEmailVerified = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailAddress = searchParams.get('email');
  const tokenToCheck = searchParams.get('token');
  const [pageContent, setPageContent] = useState({});
  document.title = 'Your email address has been verified';

  // sample URL
  // http://localhost:3000/activate-account?email=jentestingemailsforwork%2B202301160900%40gmail.com&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImplbnRlc3RpbmdlbWFpbHNmb3J3b3JrKzIwMjMwMTE2MDkwMEBnbWFpbC5jb20iLCJleHAiOjE2NzM4NzExNTcsImppdCI6IjcyNDFkNzcyLWYzZWYtNGU3OC1iMDZkLTU3ZWMxM2VkMTE4YiJ9.ZoPD-u3T10B-YEc2I0lD2BsT6KMYSGhie7PMtnycNHc

  const fetchData = async () => {
    try {
      const controller = new AbortController();
      const response = await axios.post(REGISTER_CHECK_TOKEN_ENDPOINT, {
        token: tokenToCheck,
      }, {
        signal: controller.signal,
      });

      if (response.status === 204) {
        setPageContent({
          title: 'Your email address has been verified',
          blurb: 'You can continue creating your account',
          buttonLabel: 'Continue',
          buttonNavigateTo: REGISTER_DETAILS_URL,
          buttonState: { state: { dataToSubmit: { emailAddress, token: tokenToCheck } } },
        });
      }
    } catch (err) {
      if (err.response.data.message === TOKEN_USED_TO_REGISTER) {
        navigate(ERROR_ACCOUNT_ALREADY_ACTIVE_URL, { state: { dataToSubmit: { emailAddress } } });
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [tokenToCheck, emailAddress]);

  if (Object.entries(pageContent).length === 0) { setPageContent({ blurb: '...Loading' }); }
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
          {pageContent.buttonLabel && (
            <button
              className="govuk-button"
              data-module="govuk-button"
              type="button"
              onClick={() => { navigate(pageContent.buttonNavigateTo, pageContent.buttonState); }}
            >
              {pageContent.buttonLabel}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default RegisterEmailVerified;
