// External links
export const CROWN_COPYRIGHT_URL = 'https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/';
export const FEEDBACK_URL = '/';
export const PASSWORD_GUIDENCE_URL = 'https://www.ncsc.gov.uk/collection/top-tips-for-staying-secure-online/three-random-words#:~:text=Why%20does%20the%20NCSC%20recommend,enough%20for%20you%20to%20remember';

// Pages
export const ACCESSIBILITY_URL = '/accessibility-statement';
export const COOKIE_URL = '/cookies';
export const YOUR_VOYAGES_PAGE_NAME = 'Your voyages';
export const YOUR_VOYAGES_URL = '/your-voyages';
export const FORM_CONFIRMATION_URL = '/confirmation';
export const LANDING_URL = '/';
export const PRIVACY_URL = '/privacy-notice';
export const SIGN_IN_PAGE_NAME = 'Sign in';
export const SIGN_IN_URL = '/sign-in';
export const TEMPLATE_PAGE_NAME = 'Templates';
export const TEMPLATE_PAGE_URL = '/templates';

// Create account/register pages
export const REGISTER_ACCOUNT_URL = '/create-account/email-address';
export const REGISTER_CONFIRMATION_URL = '/create-account/account-created';
export const REGISTER_EMAIL_URL = '/create-account/email-address';
export const REGISTER_EMAIL_CHECK_URL = '/create-account/check-your-email';
export const REGISTER_EMAIL_RESEND_URL = '/create-account/request-new-verification-link';
export const REGISTER_EMAIL_VERIFIED_URL = '/activate-account';
export const REGISTER_DETAILS_URL = '/create-account/your-details';
export const REGISTER_PASSWORD_URL = '/create-account/your-password';

// Error/message pages
export const MESSAGE_URL = '/message';
export const ERROR_ACCOUNT_ALREADY_ACTIVE_URL = '/create-account/account-already-exists';
export const ERROR_VERIFICATION_FAILED_URL = '/create-account/verification-failed';

// Voyage error pages
export const ERROR_CREW_DETAILS_UPLOAD_URL = '/create-voyage/check-crew-details';

// Test pages
export const SECOND_PAGE_NAME = 'Second page';
export const SECOND_PAGE_URL = '/second-page';

// Pages were we should clear formData
export const TOP_LEVEL_PAGES = [ACCESSIBILITY_URL, COOKIE_URL, YOUR_VOYAGES_URL, LANDING_URL, PRIVACY_URL];

// Pages without back links
export const NO_BACK_LINKS = [
  ...TOP_LEVEL_PAGES,
  ERROR_VERIFICATION_FAILED_URL,
  FORM_CONFIRMATION_URL,
  MESSAGE_URL,
  REGISTER_CONFIRMATION_URL,
  REGISTER_EMAIL_CHECK_URL,
  REGISTER_EMAIL_VERIFIED_URL,
  SIGN_IN_URL,
];
