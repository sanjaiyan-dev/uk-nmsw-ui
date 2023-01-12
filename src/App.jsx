import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import AppRouter from './AppRouter';
import CookieBanner from './layout/CookieBanner';
import Footer from './layout/Footer';
import Header from './layout/Header';
import PhaseBanner from './layout/PhaseBanner';
// utils
import cookieToFind from './utils/cookieToFind';
import setAnalyticCookie from './utils/setAnalyticCookie';
import { NO_BACK_LINKS, TOP_LEVEL_PAGES } from './constants/AppUrlConstants';

const App = () => {
  const cookiePreference = cookieToFind('cookiePreference');
  const [isCookieBannerShown, setIsCookieBannerShown] = useState(true);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const topLevelPage = TOP_LEVEL_PAGES.includes(pathname);
  const pageWithoutBackLink = NO_BACK_LINKS.includes(pathname);

  useEffect(() => {
    setAnalyticCookie(cookiePreference);
    if (cookiePreference !== null) {
      setIsCookieBannerShown(false);
    }
  }, [cookiePreference]);

  useEffect(() => {
    // Removes formData in sessionStorage when on a top level page
    if (topLevelPage) {
      sessionStorage.removeItem('formData');
    }
  }, [pathname]);

  return (
    <>
      {isCookieBannerShown === true && <CookieBanner isCookieBannerShown={isCookieBannerShown} setIsCookieBannerShown={setIsCookieBannerShown} />}
      <Header />
      <div className="govuk-width-container">
        <PhaseBanner />
        {/* Back link with logic as to when it should/should not show; */}
        {!pageWithoutBackLink &&
          <nav aria-label="Back link" id="backLink">
            <a href="#back" className="govuk-back-link" onClick={() => { navigate(-1); }}>Back</a>
          </nav>}
        <main className="govuk-main-wrapper govuk-main-wrapper--auto-spacing" id="content" role="main">
          <AppRouter setIsCookieBannerShown={setIsCookieBannerShown} />
        </main>
      </div>
      <Footer />
    </>
  );
};

export default App;
