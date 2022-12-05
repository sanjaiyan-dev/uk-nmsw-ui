import { Navigate, Routes, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import useUserIsPermitted from './hooks/useUserIsPermitted';
import ProtectedRoutes from './utils/ProtectedRoutes';
import ScrollToTopOnNewPage from './utils/ScrollToTopOnNewPage';

// URLs
import {
  ACCESSIBILITY_URL,
  COOKIE_URL,
  DASHBOARD_URL,
  FORM_CONFIRMATION_URL,
  LANDING_URL,
  PRIVACY_URL,
  SIGN_IN_URL,
  SECOND_PAGE_URL,
} from './constants/AppUrlConstants';

// Pages
import AccessibilityStatement from './pages/Regulatory/AccessibilityStatement';
import CookiePolicy from './pages/Regulatory/CookiePolicy';
import Dashboard from './pages/Dashboard/Dashboard';
import FormConfirmationPage from './pages/Confirmation/FormConfirmationPage';
import Landing from './pages/Landing/Landing';
import PrivacyNotice from './pages/Regulatory/PrivacyNotice';
import SignIn from './pages/SignIn/SignIn';
import SecondPage from './pages/TempPages/SecondPage';


const AppRouter = ({ setIsCookieBannerShown }) => {
  const isPermittedToView = useUserIsPermitted();

  return (
    <ScrollToTopOnNewPage>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path={ACCESSIBILITY_URL} element={<AccessibilityStatement />} />
        <Route path={COOKIE_URL} element={<CookiePolicy setIsCookieBannerShown={setIsCookieBannerShown} />} />
        <Route path={FORM_CONFIRMATION_URL} element={<FormConfirmationPage />} />
        <Route path={LANDING_URL} element={<Landing />} />
        <Route path={PRIVACY_URL} element={<PrivacyNotice />} />
        <Route path={SIGN_IN_URL} element={<SignIn />} />
        <Route element={<ProtectedRoutes isPermittedToView={isPermittedToView} />}>
          <Route path={DASHBOARD_URL} element={<Dashboard />} />
          <Route path={SECOND_PAGE_URL} element={<SecondPage />} />
        </Route>
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </ScrollToTopOnNewPage>
  );
};

export default AppRouter;

AppRouter.propTypes = {
  setIsCookieBannerShown: PropTypes.func,
};
