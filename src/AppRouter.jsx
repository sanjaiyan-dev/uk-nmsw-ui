import {
  Routes,
  Route,
} from 'react-router-dom';
// URLs
import {
  ACCESSIBILITY_URL,
  COOKIE_URL,
  LANDING_URL,
  SIGN_IN_URL,
} from './constants/AppUrlConstants';

// Pages
import AccessibilityStatement from './pages/Footer/AccessibilityStatement';
import CookiePolicy from './pages/Footer/CookiePolicy';
import Landing from './pages/Landing/Landing';
import SignIn from './pages/SignIn/SignIn';

const AppRouter = () => {
  return (
    <Routes>
      <Route path='/' element={<Landing />} />
      <Route path={LANDING_URL} element={<Landing />} />
      <Route path={SIGN_IN_URL} element={<SignIn />} />
      <Route path={COOKIE_URL} element={<CookiePolicy />} />
      <Route path={ACCESSIBILITY_URL} element={<AccessibilityStatement />} />
    </Routes>
  );
};

export default AppRouter;
