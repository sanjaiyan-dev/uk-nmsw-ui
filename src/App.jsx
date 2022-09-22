// Page Layout Components
import CookieBanner from './layout/CookieBanner';
import Footer from './layout/Footer';
import Header from './layout/Header';
import PhaseBanner from './layout/PhaseBanner';
// Pages
import Landing from './pages/LandingPage/Landing';

const App = () => {
  return (
    <>
      <CookieBanner />
      <Header />
      <div className="govuk-width-container">
        <PhaseBanner />
        {/* Back links will go in here and be visible on every page by default
        If we don't want that we will add logic on the back link component as to when 
        it should not show; */}
        <main className="govuk-main-wrapper govuk-main-wrapper--auto-spacing" id="content" role="main">
          {/* routing goes here, once in place replace Landing with route to landing */}
          <Landing />
        </main>
      </div>
      <Footer />
    </>
  );
};

export default App;
