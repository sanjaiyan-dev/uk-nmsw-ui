import useUserIsPermitted from '../hooks/useUserIsPermitted';

const Nav = () => {
  const showNav = useUserIsPermitted();

  if (!showNav) { return; }
  return (
    <nav aria-label="Menu" className="govuk-header__navigation ">
      <button type="button" className="govuk-header__menu-button govuk-js-header-toggle" aria-controls="navigation" aria-label="Show or hide menu" hidden>Menu</button>

      <ul id="navigation" className="govuk-header__navigation-list">
        <li className="govuk-header__navigation-item govuk-header__navigation-item--active">
          <a className="govuk-header__link" href="#1">
            Navigation item 1
          </a>
        </li>
        <li className="govuk-header__navigation-item">
          <a className="govuk-header__link" href="#2">
            Navigation item 2
          </a>
        </li>
        <li className="govuk-header__navigation-item">
          <a className="govuk-header__link" href="#3">
            Navigation item 3
          </a>
        </li>
        <li className="govuk-header__navigation-item">
          <a className="govuk-header__link" href="#4">
            Navigation item 4
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
