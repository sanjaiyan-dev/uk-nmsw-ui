import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LANDING_URL, YOUR_DETAILS_PAGE_NAME } from '../../constants/AppUrlConstants';

const mockedUserData = {
  fullName: 'John Doe',
  emailAddress: 'john@example.com',
  phoneNumber: '07123456576',
  country: 'England',
  userType: 'Standard user',
  company: 'Company 1',
  passwordChanged: '9 June 2021 14:22',
};

const YourDetails = () => {
  document.title = YOUR_DETAILS_PAGE_NAME;
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setFormData(mockedUserData);
  });

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <h1 className="govuk-heading-xl">Your details</h1>
        <dl className="govuk-summary-list">
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">
              Email address
            </dt>
            <dd className="govuk-summary-list__value">
              {formData.emailAddress}
            </dd>
          </div>

          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">
              Full name
            </dt>
            <dd className="govuk-summary-list__value">
              {formData.fullName}
            </dd>
          </div>

          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">
              Phone number
            </dt>
            <dd className="govuk-summary-list__value">
              {formData.phoneNumber}
            </dd>
          </div>

          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">
              Country
            </dt>
            <dd className="govuk-summary-list__value">
              {formData.country}
            </dd>
          </div>
        </dl>
        <Link className="govuk-link" to={LANDING_URL}>Change your details</Link>

        <h2 className="govuk-heading-m govuk-!-margin-top-6">Account details</h2>
        <dl className="govuk-summary-list">
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">
              User type
            </dt>
            <dd className="govuk-summary-list__value">
              {formData.userType}
            </dd>
          </div>

          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">
              Company
            </dt>
            <dd className="govuk-summary-list__value">
              {formData.company}
            </dd>
          </div>

          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">
              Password
              <br />
              <p className="govuk-body">
                <Link className="govuk-link" to={LANDING_URL}>Change your password</Link>
              </p>
            </dt>
            <dd className="govuk-summary-list__value govuk-hint">
              {`Last changed ${formData.passwordChanged}`}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default YourDetails;
