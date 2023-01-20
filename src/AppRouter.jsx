import { Navigate, Routes, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import useUserIsPermitted from './hooks/useUserIsPermitted';
import ProtectedRoutes from './utils/ProtectedRoutes';
import ScrollToTopOnNewPage from './utils/ScrollToTopOnNewPage';

import { SERVICE_NAME } from './constants/AppConstants';

// URLs
import {
  ACCESSIBILITY_URL,
  COOKIE_URL,
  ERROR_ACCOUNT_ALREADY_ACTIVE_URL,
  ERROR_CREW_DETAILS_UPLOAD_URL,
  ERROR_VERIFICATION_FAILED_URL,
  FORM_CONFIRMATION_URL,
  LANDING_URL,
  MESSAGE_URL,
  PRIVACY_URL,
  REGISTER_ACCOUNT_URL,
  REGISTER_CONFIRMATION_URL,
  REGISTER_EMAIL_URL,
  REGISTER_EMAIL_CHECK_URL,
  REGISTER_EMAIL_RESEND_URL,
  REGISTER_EMAIL_VERIFIED_URL,
  REGISTER_DETAILS_URL,
  REGISTER_PASSWORD_URL,
  SIGN_IN_URL,
  SECOND_PAGE_URL,
  YOUR_VOYAGES_URL,
  TEMPLATE_PAGE_URL,
} from './constants/AppUrlConstants';

// Regulatory pages
import AccessibilityStatement from './pages/Regulatory/AccessibilityStatement';
import CookiePolicy from './pages/Regulatory/CookiePolicy';
import Landing from './pages/Landing/Landing';
import PrivacyNotice from './pages/Regulatory/PrivacyNotice';
// Register/Sign in pages
import RegisterConfirmation from './pages/Register/RegisterConfirmation';
import RegisterEmailAddress from './pages/Register/RegisterEmailAddress';
import RegisterEmailCheck from './pages/Register/RegisterEmailCheck';
import RegisterEmailResend from './pages/Register/RegisterEmailResend';
import RegisterEmailVerified from './pages/Register/RegisterEmailVerified';
import RegisterYourDetails from './pages/Register/RegisterYourDetails';
import RegisterYourPassword from './pages/Register/RegisterYourPassword';
import SignIn from './pages/SignIn/SignIn';
// Error/Message pages
import GenericMessage from './pages/Message/GenericMessage';
import AccountAlreadyActive from './pages/Message/AccountAlreadyActive';
import VerificationLinkFailed from './pages/Message/VerificationLinkFailed';
// Other pages (could be protected or not)
import FormConfirmationPage from './pages/Message/FormConfirmationPage';
// Protected pages
import YourVoyages from './pages/NavPages/YourVoyages';
import ErrorsCrewUpload from './pages/Voyage/ErrorsCrewUpload';

// Temp Pages
import SecondPage from './pages/TempPages/SecondPage';
import Templates from './pages/NavPages/Templates';

const AppRouter = ({ setIsCookieBannerShown }) => {
  document.title = SERVICE_NAME;
  const isPermittedToView = useUserIsPermitted();

  return (
    <ScrollToTopOnNewPage>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path={ACCESSIBILITY_URL} element={<AccessibilityStatement />} />
        <Route path={COOKIE_URL} element={<CookiePolicy setIsCookieBannerShown={setIsCookieBannerShown} />} />
        <Route path={LANDING_URL} element={<Landing />} />
        <Route path={PRIVACY_URL} element={<PrivacyNotice />} />

        <Route path={REGISTER_CONFIRMATION_URL} element={<RegisterConfirmation />} />
        <Route path={REGISTER_ACCOUNT_URL} element={<RegisterEmailAddress />} />
        <Route path={REGISTER_EMAIL_URL} element={<RegisterEmailAddress />} />
        <Route path={REGISTER_EMAIL_CHECK_URL} element={<RegisterEmailCheck />} />
        <Route path={REGISTER_EMAIL_RESEND_URL} element={<RegisterEmailResend />} />
        <Route path={REGISTER_EMAIL_VERIFIED_URL} element={<RegisterEmailVerified />} />
        <Route path={REGISTER_DETAILS_URL} element={<RegisterYourDetails />} />
        <Route path={REGISTER_PASSWORD_URL} element={<RegisterYourPassword />} />
        <Route path={SIGN_IN_URL} element={<SignIn />} />

        <Route path={MESSAGE_URL} element={<GenericMessage />} />
        <Route path={ERROR_ACCOUNT_ALREADY_ACTIVE_URL} element={<AccountAlreadyActive />} />
        <Route path={ERROR_VERIFICATION_FAILED_URL} element={<VerificationLinkFailed />} />

        <Route path={FORM_CONFIRMATION_URL} element={<FormConfirmationPage />} />

        <Route element={<ProtectedRoutes isPermittedToView={isPermittedToView} />}>
          <Route path={YOUR_VOYAGES_URL} element={<YourVoyages />} />
          <Route path={SECOND_PAGE_URL} element={<SecondPage />} />
          <Route path={TEMPLATE_PAGE_URL} element={<Templates />} />
          <Route path={ERROR_CREW_DETAILS_UPLOAD_URL} element={<ErrorsCrewUpload />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ScrollToTopOnNewPage>
  );
};

export default AppRouter;

AppRouter.propTypes = {
  setIsCookieBannerShown: PropTypes.func,
};
