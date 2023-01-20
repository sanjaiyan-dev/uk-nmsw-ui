import { Link } from 'react-router-dom';
import {
  ACCESSIBILITY_URL,
  COOKIE_URL,
  CROWN_COPYRIGHT_URL,
  PRIVACY_URL,
} from '../constants/AppUrlConstants';

const Footer = () => (
  <footer className="govuk-footer " role="contentinfo">
    <div className="govuk-width-container ">
      <div className="govuk-footer__meta">
        <div className="govuk-footer__meta-item govuk-footer__meta-item--grow">
          <h2 className="govuk-visually-hidden">Support links</h2>
          <ul className="govuk-footer__inline-list">
            <li className="govuk-footer__inline-list-item">
              <Link className="govuk-footer__link" to={PRIVACY_URL}>
                Privacy
              </Link>
            </li>
            <li className="govuk-footer__inline-list-item">
              <Link className="govuk-footer__link" to={COOKIE_URL}>
                Cookies
              </Link>
            </li>
            <li className="govuk-footer__inline-list-item">
              <Link className="govuk-footer__link" to={ACCESSIBILITY_URL}>
                Accessibility
              </Link>
            </li>
          </ul>
        </div>
        <div className="govuk-footer__meta-item">
          <a className="govuk-footer__link govuk-footer__copyright-logo" target="_blank" rel="noreferrer noopener" href={CROWN_COPYRIGHT_URL}>© Crown copyright</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
