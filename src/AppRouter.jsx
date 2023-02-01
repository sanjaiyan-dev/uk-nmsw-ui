import { lazy, Suspense } from 'react';
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
  TEMPLATE_PAGE_URL,
  VOYAGE_CHECK_YOUR_ANSWERS,
  VOYAGE_CREW_UPLOAD_URL,
  VOYAGE_CREW_CONFIRMATION_URL,
  VOYAGE_DELETE_DRAFT_CHECK_URL,
  VOYAGE_GENERAL_DECLARATION_UPLOAD_URL,
  VOYAGE_GENERAL_DECLARATION_CONFIRMATION_URL,
  VOYAGE_PASSENGERS_URL,
  VOYAGE_PASSENGER_UPLOAD_URL,
  VOYAGE_PASSENGER_CONFIRMATION_URL,
  VOYAGE_SUPPORTING_DOCS_UPLOAD_URL,
  VOYAGE_TASK_LIST_URL,
  YOUR_VOYAGES_URL,
} from './constants/AppUrlConstants';

// Error/Message pages
import GenericMessage from './pages/Message/GenericMessage';
// Register/Sign in pages
import AccountAlreadyActive from './pages/Message/AccountAlreadyActive';
import VerificationLinkFailed from './pages/Message/VerificationLinkFailed';
import RegisterConfirmation from './pages/Register/RegisterConfirmation';
import RegisterEmailAddress from './pages/Register/RegisterEmailAddress';
import RegisterEmailCheck from './pages/Register/RegisterEmailCheck';
import RegisterEmailResend from './pages/Register/RegisterEmailResend';
import RegisterEmailVerified from './pages/Register/RegisterEmailVerified';
import RegisterYourDetails from './pages/Register/RegisterYourDetails';
import RegisterYourPassword from './pages/Register/RegisterYourPassword';
import SignIn from './pages/SignIn/SignIn';
// Regulatory pages
import AccessibilityStatement from './pages/Regulatory/AccessibilityStatement';
import CookiePolicy from './pages/Regulatory/CookiePolicy';
import Landing from './pages/Landing/Landing';
import PrivacyNotice from './pages/Regulatory/PrivacyNotice';

// PROTECTED PAGES
// Voyage pages
import FileUploadConfirmation from './pages/Voyage/FileUploadConfirmation';
import VoyageCheckYourAnswers from './pages/Voyage/VoyageCheckYourAnswers';
import VoyageCrew from './pages/Voyage/VoyageCrew';
import VoyageDeleteDraftCheck from './pages/Voyage/VoyageDeleteDraftCheck';
import VoyageGeneralDeclaration from './pages/Voyage/VoyageGeneralDeclaration';
import VoyagePassengers from './pages/Voyage/VoyagePassengers';
import VoyagePassengerUpload from './pages/Voyage/VoyagePassengerUpload';
import VoyageSupportingDocsUpload from './pages/Voyage/VoyageSupportingDocsUpload';
import VoyageTaskList from './pages/Voyage/VoyageTaskList';
import YourVoyages from './pages/NavPages/YourVoyages';
import ErrorsCrewUpload from './pages/Voyage/ErrorsCrewUpload';
// Other pages
import FormConfirmationPage from './pages/Message/FormConfirmationPage';
import LoadingSpinner from './components/LoadingSpinner';

const Templates = lazy(() => import('./pages/NavPages/Templates'));

const AppRouter = ({ setIsCookieBannerShown }) => {
  document.title = SERVICE_NAME;
  const isPermittedToView = useUserIsPermitted();

  return (
    <ScrollToTopOnNewPage>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path={MESSAGE_URL} element={<GenericMessage />} />

        <Route path={ERROR_ACCOUNT_ALREADY_ACTIVE_URL} element={<AccountAlreadyActive />} />
        <Route path={ERROR_VERIFICATION_FAILED_URL} element={<VerificationLinkFailed />} />
        <Route path={REGISTER_CONFIRMATION_URL} element={<RegisterConfirmation />} />
        <Route path={REGISTER_ACCOUNT_URL} element={<RegisterEmailAddress />} />
        <Route path={REGISTER_EMAIL_URL} element={<RegisterEmailAddress />} />
        <Route path={REGISTER_EMAIL_CHECK_URL} element={<RegisterEmailCheck />} />
        <Route path={REGISTER_EMAIL_RESEND_URL} element={<RegisterEmailResend />} />
        <Route path={REGISTER_EMAIL_VERIFIED_URL} element={<RegisterEmailVerified />} />
        <Route path={REGISTER_DETAILS_URL} element={<RegisterYourDetails />} />
        <Route path={REGISTER_PASSWORD_URL} element={<RegisterYourPassword />} />
        <Route path={SIGN_IN_URL} element={<SignIn />} />

        <Route path={ACCESSIBILITY_URL} element={<AccessibilityStatement />} />
        <Route path={COOKIE_URL} element={<CookiePolicy setIsCookieBannerShown={setIsCookieBannerShown} />} />
        <Route path={LANDING_URL} element={<Landing />} />
        <Route path={PRIVACY_URL} element={<PrivacyNotice />} />

        <Route element={<ProtectedRoutes isPermittedToView={isPermittedToView} />}>
          <Route path={FORM_CONFIRMATION_URL} element={<FormConfirmationPage />} />
          <Route path={TEMPLATE_PAGE_URL} element={<Suspense fallback={<LoadingSpinner />}><Templates /></Suspense>} />

          <Route path={YOUR_VOYAGES_URL} element={<YourVoyages />} />
          <Route path={VOYAGE_CHECK_YOUR_ANSWERS} element={<VoyageCheckYourAnswers />} />
          <Route path={VOYAGE_CREW_UPLOAD_URL} element={<VoyageCrew />} />
          <Route path={VOYAGE_CREW_CONFIRMATION_URL} element={<FileUploadConfirmation />} />
          <Route path={VOYAGE_DELETE_DRAFT_CHECK_URL} element={<VoyageDeleteDraftCheck />} />
          <Route path={VOYAGE_GENERAL_DECLARATION_UPLOAD_URL} element={<VoyageGeneralDeclaration />} />
          <Route path={VOYAGE_GENERAL_DECLARATION_CONFIRMATION_URL} element={<FileUploadConfirmation />} />
          <Route path={VOYAGE_PASSENGERS_URL} element={<VoyagePassengers />} />
          <Route path={VOYAGE_PASSENGER_UPLOAD_URL} element={<VoyagePassengerUpload />} />
          <Route path={VOYAGE_PASSENGER_CONFIRMATION_URL} element={<FileUploadConfirmation />} />
          <Route path={VOYAGE_SUPPORTING_DOCS_UPLOAD_URL} element={<VoyageSupportingDocsUpload />} />
          <Route path={VOYAGE_TASK_LIST_URL} element={<VoyageTaskList />} />
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
