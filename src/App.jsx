import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
// Page Layout Components
import CookieBanner from './layout/CookieBanner';
import Footer from './layout/Footer';
import Header from './layout/Header';
import PhaseBanner from './layout/PhaseBanner';
// Pages
import Landing from './pages/Landing/Landing';
import SignIn from './pages/SignIn/SignIn';

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
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/sign-in" element={<SignIn />} />
            </Routes>
          </BrowserRouter>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default App;
