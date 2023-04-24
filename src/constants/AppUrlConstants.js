// External links
export const CROWN_COPYRIGHT_URL = 'https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/';
export const FEEDBACK_URL = 'https://www.homeofficesurveys.homeoffice.gov.uk/s/6MBWPJ/';
export const PASSWORD_GUIDENCE_URL = 'https://www.ncsc.gov.uk/collection/top-tips-for-staying-secure-online/three-random-words#:~:text=Why%20does%20the%20NCSC%20recommend,enough%20for%20you%20to%20remember';
export const GOV_URL = 'https://www.gov.uk/';

// Register/Sign in pages
export const REGISTER_ACCOUNT_URL = '/create-account/email-address';
export const REGISTER_CONFIRMATION_URL = '/create-account/account-created';
export const REGISTER_EMAIL_URL = '/create-account/email-address';
export const REGISTER_EMAIL_CHECK_URL = '/create-account/check-your-email';
export const REGISTER_EMAIL_RESEND_URL = '/create-account/request-new-verification-link';
export const REGISTER_EMAIL_VERIFIED_URL = '/activate-account';
export const REGISTER_DETAILS_URL = '/create-account/your-details';
export const REGISTER_PASSWORD_URL = '/create-account/your-password';
export const REQUEST_PASSWORD_RESET_URL = '/forgotten-password';
export const REQUEST_PASSWORD_RESET_CONFIRMATION_URL = '/forgotten-password/check-your-email';
export const REQUEST_PASSWORD_RESET_RESEND_URL = '/forgotten-password/request-new-link';
export const RESET_YOUR_PASSWORD = '/new-password'; // this is a logged out version
export const SIGN_IN_PAGE_NAME = 'Sign in';
export const SIGN_IN_URL = '/sign-in';
export const LOGGED_IN_LANDING = '/your-voyages';

// Regulatory pages
export const ACCESSIBILITY_URL = '/accessibility-statement';
export const COOKIE_URL = '/cookies';
export const LANDING_URL = '/';
export const PRIVACY_URL = '/privacy-notice';
export const CONTACT_US_URL = '/contact-us';

// Voyage pages
export const URL_DECLARATIONID_IDENTIFIER = 'report';
export const FORM_CONFIRMATION_URL = '/report-voyage/confirmation';
export const VOYAGE_CHECK_YOUR_ANSWERS = '/report-voyage/check-your-answers';
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
export const FILE_UPLOAD_FIELD_ERRORS_URL = '/field-errors';
export const GENERIC_CONFIRMATION_URL = '/confirmation';
export const TEMPLATE_PAGE_NAME = 'Templates';
export const TEMPLATE_PAGE_URL = '/templates';
export const LOGGED_IN_HELP = '/help-page';
export const HELP_URL = '/help';
export const HELP_PAGE_NAME = 'Help';

// User details pages
export const YOUR_DETAILS_PAGE_NAME = 'Your details';
export const YOUR_DETAILS_PAGE_URL = '/your-details';
export const CHANGE_YOUR_DETAILS_PAGE_NAME = 'Change your details';
export const CHANGE_YOUR_DETAILS_PAGE_URL = '/change-your-details';
export const CHANGE_YOUR_PASSWORD_PAGE_NAME = 'Change your password';
export const CHANGE_YOUR_PASSWORD_PAGE_URL = '/change-your-password'; // this is a logged in version

// Error/message pages
export const MESSAGE_URL = '/message';
export const ERROR_ACCOUNT_ALREADY_ACTIVE_URL = '/create-account/account-already-exists';

// Top level pages - we use this to know to clear form session data
export const TOP_LEVEL_PAGES = [
  ACCESSIBILITY_URL,
  COOKIE_URL,
  YOUR_VOYAGES_URL,
  LANDING_URL,
  PRIVACY_URL,
  TEMPLATE_PAGE_URL,
  YOUR_DETAILS_PAGE_URL,
];

// Pages without back links
export const NO_BACK_LINKS = [
  ...TOP_LEVEL_PAGES,
  FORM_CONFIRMATION_URL,
  GENERIC_CONFIRMATION_URL,
  MESSAGE_URL,
  REGISTER_CONFIRMATION_URL,
  REGISTER_DETAILS_URL,
  REGISTER_EMAIL_CHECK_URL,
  REGISTER_EMAIL_VERIFIED_URL,
  SIGN_IN_URL,
];
