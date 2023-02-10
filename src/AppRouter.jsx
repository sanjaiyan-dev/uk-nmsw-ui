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
  YOUR_DETAILS_PAGE_URL,
  CHANGE_YOUR_DETAILS_PAGE_URL,
  CHANGE_YOUR_PASSWORD_PAGE_URL,
  GENERIC_CONFIRMATION_URL,
} from './constants/AppUrlConstants';

import LoadingSpinner from './components/LoadingSpinner';

// Lazy loaded routes (js loads on demand)
// Error/Message pages
const GenericMessage = lazy(() => import('./pages/Message/GenericMessage'));
// Register/Sign in pages
const AccountAlreadyActive = lazy(() => import('./pages/Message/AccountAlreadyActive'));
const RegisterConfirmation = lazy(() => import('./pages/Register/RegisterConfirmation'));
const RegisterEmailAddress = lazy(() => import('./pages/Register/RegisterEmailAddress'));
const RegisterEmailCheck = lazy(() => import('./pages/Register/RegisterEmailCheck'));
const RegisterEmailResend = lazy(() => import('./pages/Register/RegisterEmailResend'));
const RegisterEmailVerified = lazy(() => import('./pages/Register/RegisterEmailVerified'));
const RegisterYourDetails = lazy(() => import('./pages/Register/RegisterYourDetails'));
const RegisterYourPassword = lazy(() => import('./pages/Register/RegisterYourPassword'));
const SignIn = lazy(() => import('./pages/SignIn/SignIn'));
// Regulatory pages
const AccessibilityStatement = lazy(() => import('./pages/Regulatory/AccessibilityStatement'));
const CookiePolicy = lazy(() => import('./pages/Regulatory/CookiePolicy'));
const Landing = lazy(() => import('./pages/Landing/Landing'));
const PrivacyNotice = lazy(() => import('./pages/Regulatory/PrivacyNotice'));
// Voyage pages
const FileUploadConfirmation = lazy(() => import('./pages/Voyage/FileUploadConfirmation'));
const VoyageCheckYourAnswers = lazy(() => import('./pages/Voyage/VoyageCheckYourAnswers'));
const VoyageCrew = lazy(() => import('./pages/Voyage/VoyageCrew'));
const VoyageDeleteDraftCheck = lazy(() => import('./pages/Voyage/VoyageDeleteDraftCheck'));
const VoyageGeneralDeclaration = lazy(() => import('./pages/Voyage/VoyageGeneralDeclaration'));
const VoyagePassengers = lazy(() => import('./pages/Voyage/VoyagePassengers'));
const VoyagePassengerUpload = lazy(() => import('./pages/Voyage/VoyagePassengerUpload'));
const VoyageSupportingDocsUpload = lazy(() => import('./pages/Voyage/VoyageSupportingDocsUpload'));
const VoyageTaskList = lazy(() => import('./pages/Voyage/VoyageTaskList'));
const YourVoyages = lazy(() => import('./pages/NavPages/YourVoyages'));
const ErrorsCrewUpload = lazy(() => import('./pages/Voyage/ErrorsCrewUpload'));
// Other pages
const FormConfirmationPage = lazy(() => import('./pages/Message/FormConfirmationPage'));
const GenericConfirmationPage = lazy(() => import('./pages/Message/GenericConfirmation'));
const Templates = lazy(() => import('./pages/NavPages/Templates'));
const YourDetails = lazy(() => import('./pages/NavPages/YourDetails/YourDetails'));
const ChangeYourDetails = lazy(() => import('./pages/NavPages/YourDetails/ChangeYourDetails'));
const ChangeYourPassword = lazy(() => import('./pages/NavPages/YourDetails/ChangeYourPassword'));

const AppRouter = ({ setIsCookieBannerShown }) => {
  document.title = SERVICE_NAME;
  const isPermittedToView = useUserIsPermitted();

  return (
    <ScrollToTopOnNewPage>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path={MESSAGE_URL} element={<GenericMessage />} />

          <Route path={ERROR_ACCOUNT_ALREADY_ACTIVE_URL} element={<AccountAlreadyActive />} />
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
            <Route path={CHANGE_YOUR_DETAILS_PAGE_URL} element={<ChangeYourDetails />} />
            <Route path={CHANGE_YOUR_PASSWORD_PAGE_URL} element={<ChangeYourPassword />} />
            <Route path={FORM_CONFIRMATION_URL} element={<FormConfirmationPage />} />
            <Route path={GENERIC_CONFIRMATION_URL} element={<GenericConfirmationPage />} />
            <Route path={TEMPLATE_PAGE_URL} element={<Templates />} />
            <Route path={YOUR_DETAILS_PAGE_URL} element={<YourDetails />} />
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
      </Suspense>
    </ScrollToTopOnNewPage>
  );
};

export default AppRouter;

AppRouter.propTypes = {
  setIsCookieBannerShown: PropTypes.func,
};
