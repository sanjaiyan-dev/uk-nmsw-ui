/* eslint-disable max-len */
import { SERVICE_CONTACT_EMAIL, SERVICE_NAME, SERVICE_URL } from '../../constants/AppConstants';

const AccessibilityStatement = () => {
  const abilityNetUrl = 'https://mcmw.abilitynet.org.uk';
  const escalateComplaintUrl = 'https://www.equalityadvisoryservice.com';
  const escalateComplaintNIUrl = 'https://www.equalityni.org/Home';
  const w3orgUrl = 'https://www.w3.org/TR/WCAG21';
  const alternativeFormatRequestEmail = 'alternativeformats@homeoffice.gov.uk';

  document.title = `Accessibility statement for ${SERVICE_NAME}`;

  return (
    <>
      <h1 className="govuk-heading-xl">{`Accessibility statement for ${SERVICE_NAME}`}</h1>

      <p>
        This accessibility statement applies to the service at <a className="govuk-link" href={SERVICE_URL} target="_blank" rel="noopener noreferrer">{SERVICE_NAME}</a>.
      </p>
      <p>
        This website is run by the Home Office. We want as many people as possible to be able to use this website. For example, that means you should be able to:
      </p>
      <ul>
        <li>Change colours, contrast levels and fonts</li>
        <li>Zoom in up to 250% without the text spilling off the screen</li>
        <li>Navigate most of the website using just a keyboard</li>
        <li>Navigate most of the website using speech recognition software</li>
        <li>Listen to most of the website using a screen reader (including the most recent versions of JAWS, NVDA and VoiceOver)</li>
      </ul>
      <p>
        We&apos;ve also made the website text as simple as possible to understand. <a className="govuk-link" href={abilityNetUrl} target="_blank" rel="noopener noreferrer">AbilityNet</a> has advice on making your device easier to use if you have a disability.
      </p>

      <h2 className="govuk-heading-l">How accessible this website is</h2>
      <p>
        We know some parts of this website are not fully accessible. You can see a full list of any issues we currently know about in the Non-accessible content section of this statement.
      </p>

      <h2 className="govuk-heading-l">Feedback and contact information</h2>
      <p>
        If you need information on this website in a different format like accessible PDF, large print, easy read, audio recording or braille, email <a className="govuk-link" href={`mailto: ${alternativeFormatRequestEmail}`}>{alternativeFormatRequestEmail}</a>.
      </p>

      <h2 className="govuk-heading-l">Reporting accessibility problems with this website</h2>
      <p>
        We&apos;re always looking to improve the accessibility of this website. If you find any problems not listed on this page or think we&apos;re not meeting accessibility requirements, contact <a className="govuk-link" href={`mailto: ${SERVICE_CONTACT_EMAIL}`}>{SERVICE_CONTACT_EMAIL}</a>.
      </p>

      <h2 className="govuk-heading-l">Enforcement procedure</h2>
      <p>
        The Equality and Human Rights Commission (EHRC) is responsible for enforcing the Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018 (the &apos;accessibility regulations&apos;). If you&apos;re not happy with how we respond to your complaint, <a className="govuk-link" href={escalateComplaintUrl} target="_blank" rel="noopener noreferrer">contact the Equality Advisory and Support Website (EASS)</a>.
      </p>
      <p>
        If you are in Northern Ireland and are not happy with how we respond to your complaint you can contact the <a className="govuk-link" href={escalateComplaintNIUrl} target="_blank" rel="noopener noreferrer">Equalities Commission for Northern Ireland</a> who are responsible for enforcing the Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018 (the &apos;accessibility regulations&apos;) in Northern Ireland.
      </p>
      <h2 className="govuk-heading-l">Technical information about this website&apos;s accessibility</h2>
      <p>
        The Home Office is committed to making its website accessible, in accordance with the Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018.
      </p>
      <h2 className="govuk-heading-l">Compliance status</h2>
      <p>
        This website is partially compliant with the <a className="govuk-link" href={w3orgUrl} target="_blank" rel="noopener noreferrer">Web Content Accessibility Guidelines version 2.1</a> AA standard, due to the non-compliances listed below.
      </p>
      <h3 className="govuk-heading-m">Non-accessible content</h3>
      <p>
        The content listed below is non-accessible for the following reasons.
      </p>
      <ul>
        <li>
          For dial code and country input fields, the purpose of the input field that collects information about the user cannot be understood by assistive technologies and browsers by using autocomplete.
        </li>
        <li>
          Features with the upload functionality are not identified in a consistent way.
        </li>
        <li>
          Password fields do not allow a user to view and check the entry.
        </li>
        <li>
          When uploading supporting documents that exceed the maximum number, JAWS  reader  reads the error but not NVDA.
        </li>
      </ul>
      <h3 className="govuk-heading-m">Non-compliance with the accessibility regulations</h3>
      <p>
        All content tested is compliant with the WCAG guidelines to the best of our knowledge. If you find areas in the site that are inaccessible, please contact us.
      </p>
      <h3 className="govuk-heading-m">Disproportionate burden</h3>
      <p>
        At this time, we have not made any disproportionate burden claims.
      </p>
      <h3 className="govuk-heading-m">Content that&apos;s not within the scope of the accessibility regulations</h3>
      <p>
        At this time, we have not identified any content that is not within scope of the accessibility regulations.
      </p>
      <h3 className="govuk-heading-m">What we&apos;re doing to improve accessibility</h3>
      <p>
        We will fix issues that fail to meet the Web Content Accessibility Guidelines version 2.1 AA standard. We will update this page when issues are fixed.
      </p>
      <h2 className="govuk-heading-l">Preparation of this accessibility statement</h2>
      <p>
        This statement was prepared on 31 March 2023. It was last reviewed on 31 March 2023.
      </p>
      <p>
        This website was last tested on 31 March 2023.
      </p>
      <p>
        Testing was carried out internally by the Home Office.
      </p>
      <p>
        We tested the website based on a user&apos;s ability to complete key journeys. All parts of the chosen journeys were tested, including documents. Journeys were chosen on a number of factors including usage statistics, risk assessments and subject matter.
      </p>
    </>
  );
};

export default AccessibilityStatement;
