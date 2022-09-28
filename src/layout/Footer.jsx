import { Link } from 'react-router-dom';
import { COOKIE_URL } from '../constants/AppUrlConstants';

const Footer = () => {
  return (
    <footer className="govuk-footer " role="contentinfo">
      <div className="govuk-width-container ">
        <div className="govuk-footer__meta">
          <div className="govuk-footer__meta-item govuk-footer__meta-item--grow">
            <h2 className="govuk-visually-hidden">Support links</h2>
            <ul className="govuk-footer__inline-list">
              <li className="govuk-footer__inline-list-item">
                <Link className="govuk-footer__link" to={COOKIE_URL}>
                  Cookies
                </Link>
              </li>
              {/* <li className="govuk-footer__inline-list-item">
                <a className="govuk-footer__link" href="#2">
                  Item 2
                </a>
              </li>
              <li className="govuk-footer__inline-list-item">
                <a className="govuk-footer__link" href="#3">
                  Item 3
                </a>
              </li> */}
            </ul>
          </div>
          <div className="govuk-footer__meta-item">
            <a className="govuk-footer__link govuk-footer__copyright-logo" href="/">© Crown copyright</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
