import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Nav from './Nav';

const Header = () => {
  const { pathname } = useLocation();
  const ref = useRef(null);

  const handleSkipLink = (e) => {
    e.preventDefault();
    document.getElementById('main-content').scrollIntoView();
    document.getElementById('main-content').focus();
  };

  // remove once react-router accessibility issue is fixed
  // https://github.com/ReactTraining/react-router/issues/5210
  useEffect(() => {
    ref.current?.focus();
  }, [pathname]);

  return (
    <header className="govuk-header" role="banner" data-module="govuk-header">
      <span ref={ref} tabIndex={-1} />
      <button
        type="button"
        className="govuk-skip-link"
        id="skip-link"
        onClick={((e) => handleSkipLink(e))}
      >
        Skip to main content
      </button>
      <div className="govuk-header__container govuk-width-container">

        <Nav />
      </div>
    </header>
  );
};
export default Header;
