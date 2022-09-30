import { useEffect } from 'react';
import AppRouter from './AppRouter';
import CookieBanner from './layout/CookieBanner';
import Footer from './layout/Footer';
import Header from './layout/Header';
import PhaseBanner from './layout/PhaseBanner';
// utils
import cookieToFind from './utils/cookieToFind';
import setAnalyticCookie from './utils/setAnalyticCookie';

const App = () => {

  const cookiePreference = cookieToFind('cookiePreference');

  useEffect(() => {
    setAnalyticCookie(cookiePreference);
  }, [cookiePreference]);

  return (
    <>
      {cookiePreference === null && <CookieBanner />}
      <Header />
      <div className="govuk-width-container">
        <PhaseBanner />
        {/* Back links will go in here and be visible on every page by default
        If we don't want that we will add logic on the back link component as to when 
        it should not show; */}
        <main className="govuk-main-wrapper govuk-main-wrapper--auto-spacing" id="content" role="main">
          <AppRouter />
        </main>
      </div>
      <Footer />
    </>
  );
};

export default App;
