// External links
export const CROWN_COPYRIGHT_URL = 'https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/';
export const FEEDBACK_URL = '/';

// Pages
export const ACCESSIBILITY_URL = '/accessibility-statement';
export const COOKIE_URL = '/cookies';
export const DASHBOARD_PAGE_NAME = 'Your voyages';
export const DASHBOARD_URL = '/your-voyages';
export const FORM_CONFIRMATION_URL = '/confirmation';
export const LANDING_URL = '/';
export const PRIVACY_URL = '/privacy-notice';
export const SIGN_IN_PAGE_NAME = 'Sign in';
export const SIGN_IN_URL = '/sign-in';

// Create account/register pages
export const REGISTER_ACCOUNT_URL = '/create-account/email-address';
export const REGISTER_CONFIRMATION_URL = '/create-account/account-created';
export const REGISTER_EMAIL_URL = '/create-account/email-address';
export const REGISTER_EMAIL_CHECK_URL = '/create-account/check-your-email';
export const REGISTER_EMAIL_RESEND_URL = '/create-account/request-new-verification-link';
export const REGISTER_EMAIL_VERIFIED_URL = '/create-account/email-verified';
export const REGISTER_DETAILS_URL = '/create-account/your-details';
export const REGISTER_PASSWORD_URL = '/create-account/your-password';

// Error/message pages
export const ERROR_URL = '/error';
export const ERROR_ACCOUNT_ALREADY_ACTIVE_URL = '/create-account/account-already-exists';

//Voyage error pages
export const ERROR_CREW_DETAILS_UPLOAD= '/create-voyage/check-crew-details';

// Test pages
export const SECOND_PAGE_NAME = 'Second page';
export const SECOND_PAGE_URL = '/second-page';

// Pages were we should clear formData
export const TOP_LEVEL_PAGES = [ACCESSIBILITY_URL, COOKIE_URL, DASHBOARD_URL, LANDING_URL, PRIVACY_URL];

// Pages without back links
export const NO_BACK_LINKS = [
  ...TOP_LEVEL_PAGES,
  FORM_CONFIRMATION_URL,
  REGISTER_CONFIRMATION_URL,
  REGISTER_EMAIL_CHECK_URL,
  REGISTER_EMAIL_VERIFIED_URL,
  SIGN_IN_URL
];
