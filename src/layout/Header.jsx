import Nav from './Nav';

const Header = () => (
  <header className="govuk-header" role="banner" data-module="govuk-header">
    <a href="#content" className="govuk-skip-link">Skip to main content</a>
    <div className="govuk-header__container govuk-width-container">

      <Nav />
    </div>
  </header>
);
export default Header;
