// Site
export const SERVICE_NAME = 'National Maritime Single Window';
export const SERVICE_URL = 'https://nmsw.homeoffice.gov.uk';
export const SERVICE_CONTACT_EMAIL = 'nmsw@homeoffice.gov.uk'; // update on public/index.html as well

// Declarations
export const DECLARATION_STATUS_CANCELLED = 'Cancelled';
export const DECLARATION_STATUS_DRAFT = 'Draft';
export const DECLARATION_STATUS_FAILED = 'Failed';
export const DECLARATION_STATUS_PRECANCELLED = 'PreCancelled';
export const DECLARATION_STATUS_PRESUBMITTED = 'PreSubmitted';
export const DECLARATION_STATUS_SUBMITTED = 'Submitted';
export const DECLARATION_STEP_STATUS_COMPLETED = 'completed';
export const DECLARATION_STEP_STATUS_CANNOT_START = 'cannotStartYet';
export const DECLARATION_STEP_STATUS_NOT_STARTED = 'notStarted';
export const DECLARATION_STEP_STATUS_OPTIONAL = 'optional';
export const DECLARATION_STEP_STATUS_REQUIRED = 'required';

// Forms: display types
export const DISPLAY_DETAILS = 'details';
export const DISPLAY_GROUPED = 'grouped';
export const DISPLAY_SINGLE = 'single';
export const DISPLAY_PASSWORD = 'password';
// Forms: identifiers
export const EXPANDED_DETAILS = 'ExpandedDetails';
export const MULTI_PAGE_FORM = 'multiPageForm';
export const PASSWORD_FORM = 'passwordForm';
export const SIGN_IN_FORM = 'signInForm';
export const SINGLE_PAGE_FORM = 'singlePageForm';
// Forms: input types
export const FIELD_AUTOCOMPLETE = 'autocomplete';
export const FIELD_CONDITIONAL = 'conditional';
export const FIELD_EMAIL = 'email';
export const FIELD_PASSWORD = 'password';
export const FIELD_PHONE = 'tel';
export const FIELD_TEXT = 'text';
export const FIELD_RADIO = 'radio';
export const AUTOCOMPLETE_DIALCODE = 'dialCode';
// Forms: states
export const CHECKED_TRUE = true;
export const CHECKED_FALSE = false;
export const FILE_STATUS_PENDING = 'Pending';
export const FILE_STATUS_IN_PROGRESS = 'in progress';
export const FILE_STATUS_ERROR = 'Error';
export const FILE_STATUS_SUCCESS = 'Success';
// Forms: validation types
export const VALIDATE_CONDITIONAL = 'conditional';
export const VALIDATE_EMAIL_ADDRESS = 'emailAddress';
export const VALIDATE_FIELD_MATCH = 'match'; // not case sensitive e.g. `BaA` and `baa` will be a valid match
export const VALIDATE_FIELD_MATCH_CASE_SENSITIVE = 'matchCaseSensitive'; // e.g. `BaA` and `baa` will fail
export const VALIDATE_MAX_LENGTH = 'maxLength';
export const VALIDATE_MIN_LENGTH = 'minLength';
export const VALIDATE_PHONE_NUMBER = 'phoneNumber';
export const VALIDATE_REQUIRED = 'required';
export const VALIDATE_NO_SPACES = 'noSpaces';

// Pagination
export const ELLIPSIS = '...';
export const PAGINATION_PAGE_LABEL = 'Page';
export const PAGINATION_PREVIOUS_LABEL = 'Previous';
export const PAGINATION_NEXT_LABEL = 'Next';
export const PAGINATION_DEFAULT_PAGE_START_NUMBER = 0;
export const PAGINATION_DISPLAYABLE_PAGE_NUMBER_INCREMENTOR = 1;

// Templates
export const GENERAL_DECLARATION_TEMPLATE_NAME = 'General Declaration (FAL 1)';
export const CREW_DETAILS_TEMPLATE_NAME = 'Crew details (FAL 5)';
export const PASSENGER_DETAILS_TEMPLATE_NAME = 'Passenger details including supernumeraries (FAL 6)';
export const GENERAL_DECLARATION_LABEL = 'General Declaration (FAL 1)';
export const CREW_DETAILS_LABEL = 'Crew details (FAL 5)';
export const PASSENGER_DETAILS_LABEL = 'Any passenger details including supernumeraries (FAL 6)';
export const SUPPORTING_DOCUMENTS_LABEL = 'Supporting documents';
export const CHECK_YOUR_ANSWERS_LABEL = 'Check answers and submit';

// File upload
export const MAX_FILE_SIZE = 4194304;
export const MAX_FILE_SIZE_DISPLAY = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
export const MAX_SUPPORTING_FILE_SIZE = 1048576;
export const MAX_SUPPORTING_FILE_SIZE_DISPLAY = (MAX_SUPPORTING_FILE_SIZE / (1024 * 1024)).toFixed(0);

// User types
export const USER_TYPE_ADMIN = 'Admin';
export const USER_TYPE_ADMIN_LABEL = 'Administrator';
export const USER_TYPE_STANDARD = 'User';
export const USER_TYPE_STANDARD_LABEL = 'Standard user';
export const USER_GROUP_INTERNAL = 'Internal';
export const USER_GROUP_EXTERNAL = 'External';
export const INTERNAL_TEAMS = ['Border Force Team'];

export const RESTRICTED_EMAIL_PATTERNS = [
  'gov.uk',
  'police.uk',
];
