import { Routes, Route} from 'react-router-dom';
import ProtectedRoutes from './utils/ProtectedRoutes';

import useUserIsPermitted from './hooks/useUserIsPermitted';
// URLs
import {
  ACCESSIBILITY_URL,
  COOKIE_URL,
  DASHBOARD_URL,
  LANDING_URL,
  SIGN_IN_URL,
  SECOND_PAGE_URL,
} from './constants/AppUrlConstants';

// Pages
import AccessibilityStatement from './pages/Footer/AccessibilityStatement';
import CookiePolicy from './pages/Footer/CookiePolicy';
import Dashboard from './pages/Dashboard/Dashboard';
import Landing from './pages/Landing/Landing';
import SignIn from './pages/SignIn/SignIn';
import SecondPage from './pages/TempPages/SecondPage';

const AppRouter = () => {
  const isPermittedToView = useUserIsPermitted();

  return (
    <Routes>
      <Route path='/' element={<Landing />} />
      <Route path={LANDING_URL} element={<Landing />} />
      <Route path={SIGN_IN_URL} element={<SignIn />} />
      <Route path={ACCESSIBILITY_URL} element={<AccessibilityStatement />} />
      <Route path={COOKIE_URL} element={<CookiePolicy />} />
      <Route element={<ProtectedRoutes isPermittedToView={isPermittedToView} />}>
        <Route path={DASHBOARD_URL} element={<Dashboard />} />
        <Route path={SECOND_PAGE_URL} element={<SecondPage />} />
      </Route> 
    </Routes>
  );
};

export default AppRouter;
