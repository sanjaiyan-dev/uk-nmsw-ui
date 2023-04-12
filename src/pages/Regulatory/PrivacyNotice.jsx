import { SERVICE_NAME } from '../../constants/AppConstants';

const PrivacyNotice = () => {
  document.title = `Privacy notice for ${SERVICE_NAME}`;
  return (
    <>
      <h1 className="govuk-heading-xl">{`Privacy notice for ${SERVICE_NAME}`}</h1>
      <p className="govuk-body">
        {`Provision of the ${SERVICE_NAME} service is from the borders, immigration and citizenship system, which is part of the Home Office. Please visit the guidance at `}
        <a className="govuk-link" href="https://www.gov.uk/government/publications/personal-information-use-in-borders-immigration-and-citizenship">
          {' Borders, immigration and citizenship: privacy information notice'}
        </a>
        {' for full information on how your personal information may be used within the Home Office Borders, Immigration and Citizenship System.'}
      </p>
      <h2 className="govuk-heading-m">What data we need</h2>
      <p className="govuk-body">
        {`The personal data we collect from you, your passengers and crew members on the ${SERVICE_NAME} service may include:`}
      </p>
      <ul className="govuk-list govuk-list--bullet">
        <li>full name</li>
        <li>date of birth</li>
        <li>place of birth</li>
        <li>travel document information such as document number and expiry date</li>
        <li>nationality information including place of birth</li>
        <li>rank or rating</li>
        <li>information on who the person responsible for the voyage is</li>
        <li>
          information on how you use the site, using cookies and page tagging techniques:
          <ul className="govuk-list govuk-list--bullet">
            <li>{`the pages you visit on ${SERVICE_NAME}`}</li>
            <li>how long you spend on each page</li>
            <li>what you click on while you&apos;re visiting the site</li>
          </ul>
        </li>
      </ul>
      <p className="govuk-body">
        Under the Data Protection Act 2018, we are processing your personal information on a performance-of-a-public-task basis to allow Border Force to discharge our
        duties around your, your passengers&apos; and your crew&apos;s entry into the United Kingdom.
        {` We may process your information in systems other than the ${SERVICE_NAME} Service. `}
        The legislative basis for collecting this information is the Immigration Act of 1971 Paragraph 27B.
      </p>
      <p className="govuk-body">We collect your email address when you register on the service.</p>
      <p className="govuk-body">We use the email address you provide to help ensure that we can enforce access control and keep data secure.</p>
      <p className="govuk-body">We use information about your email and your name that we hold within the system when we send you a notification. We use the GOV.UK Notify service, to send you notifications from the service to your email address; the GOV.UK Notify service is operated and assured by the Cabinet Office.</p>
      <p className="govuk-body">The legal basis for processing your personal data is for the performance of a public task. Privacy and Electronic Communications Regulations (PECR) require either the subscriber&apos;s or the user&apos;s consent. </p>
    </>
  );
};

export default PrivacyNotice;
