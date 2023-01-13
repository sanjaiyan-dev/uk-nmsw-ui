import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { REGISTER_CHECK_TOKEN_ENDPOINT } from '../../constants/AppAPIConstants';
import { REGISTER_DETAILS_URL } from '../../constants/AppUrlConstants';
import Auth from '../../utils/Auth';

const RegisterEmailVerified = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailAddress = searchParams.get('email');
  const tokenToCheck = searchParams.get('token');
  const [pageContent, setPageContent] = useState({});
  document.title = 'Your email address has been verified';

  // sample URL
  // http://localhost:3000/activate-account?email=jentestingemailsforwork%2B20230113%40gmail.com&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImplbnRlc3RpbmdlbWFpbHNmb3J3b3JrKzIwMjMwMTEzQGdtYWlsLmNvbSIsImV4cCI6MTY3MzYzMjYzNiwiaml0IjoiNDE4NTliMzQtMzI2ZC00MjUxLTgyNDQtMjgwMTg4YjJiZDU4In0.1bdZ2X7rxMX9wTD2Kwkx7VqktUuE3IzPJzxEVO3hNCw

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
      console.log('error', err);
      // name === 'AbortError' will be if the fetch is aborted with the AbortController
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
