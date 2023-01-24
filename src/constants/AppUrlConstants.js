// External links
export const CROWN_COPYRIGHT_URL = 'https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/';
export const FEEDBACK_URL = '/';
export const PASSWORD_GUIDENCE_URL = 'https://www.ncsc.gov.uk/collection/top-tips-for-staying-secure-online/three-random-words#:~:text=Why%20does%20the%20NCSC%20recommend,enough%20for%20you%20to%20remember';

// Register/Sign in pages
export const REGISTER_ACCOUNT_URL = '/create-account/email-address';
export const REGISTER_CONFIRMATION_URL = '/create-account/account-created';
export const REGISTER_EMAIL_URL = '/create-account/email-address';
export const REGISTER_EMAIL_CHECK_URL = '/create-account/check-your-email';
export const REGISTER_EMAIL_RESEND_URL = '/create-account/request-new-verification-link';
export const REGISTER_EMAIL_VERIFIED_URL = '/activate-account';
export const REGISTER_DETAILS_URL = '/create-account/your-details';
export const REGISTER_PASSWORD_URL = '/create-account/your-password';
export const SIGN_IN_PAGE_NAME = 'Sign in';
export const SIGN_IN_URL = '/sign-in';

// Regulatory pages
export const ACCESSIBILITY_URL = '/accessibility-statement';
export const COOKIE_URL = '/cookies';
export const LANDING_URL = '/';
export const PRIVACY_URL = '/privacy-notice';

// Voyage pages
export const ERROR_CREW_DETAILS_UPLOAD_URL = '/create-voyage/check-crew-details';
export const VOYAGE_CHECK_YOUR_ANSWERS = '/your-voyages/check-your-answers';
export const VOYAGE_CREW_UPLOAD_URL = '/report-voyage/upload-crew-details';
export const VOYAGE_CREW_CONFIRMATION_URL = '/report-voyage/crew-details-uploaded';
export const VOYAGE_DELETE_DRAFT_CHECK_URL = '/report-voyage/confirm-delete-draft';
export const VOYAGE_GENERAL_DECLARATION_UPLOAD_URL = '/report-voyage/upload-general-declaration';
export const VOYAGE_GENERAL_DECLARATION_CONFIRMATION_URL = '/report-voyage/general-declaration-uploaded';
export const VOYAGE_PASSENGERS_URL = '/report-voyage/passenger-details';
export const VOYAGE_PASSENGER_UPLOAD_URL = '/report-voyage/upload-passenger-details';
export const VOYAGE_PASSENGER_CONFIRMATION_URL = '/report-voyage/passenger-details-uploaded';
export const VOYAGE_SUPPORTING_DOCS_UPLOAD_URL = '/report-voyage/upload-supporting-documents';
export const VOYAGE_TASK_LIST_URL = '/report-voyage';
export const YOUR_VOYAGES_PAGE_NAME = 'Your voyages';
export const YOUR_VOYAGES_URL = '/your-voyages';

// Other pages
export const FORM_CONFIRMATION_URL = '/confirmation';
export const TEMPLATE_PAGE_NAME = 'Templates';
export const TEMPLATE_PAGE_URL = '/templates';

// Error/message pages
export const MESSAGE_URL = '/message';
export const ERROR_ACCOUNT_ALREADY_ACTIVE_URL = '/create-account/account-already-exists';
export const ERROR_VERIFICATION_FAILED_URL = '/create-account/verification-failed';

// Top level pages - we use this to know to clear form session data
export const TOP_LEVEL_PAGES = [
  ACCESSIBILITY_URL,
  COOKIE_URL,
  YOUR_VOYAGES_URL,
  LANDING_URL,
  PRIVACY_URL,
  TEMPLATE_PAGE_URL,
];

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
