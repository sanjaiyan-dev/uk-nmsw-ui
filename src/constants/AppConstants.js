// Site
export const SERVICE_NAME = 'National Maritime Single Window';
export const SERVICE_URL = 'https://nmsw.homeoffice.gov.uk';
export const SERVICE_CONTACT_EMAIL = 'sgmrsupport@digital.homeoffice.gov.uk';

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
// Templates
export const GENERAL_DECLARATION_TEMPLATE_NAME = 'General Declaration (FAL 1)';
export const CREW_DETAILS_TEMPLATE_NAME = 'Crew details including supernumeraries (FAL 5)';
export const PASSENGER_DETAILS_TEMPLATE_NAME = 'Passenger details (FAL 6)';

// Templates
export const GENERAL_DECLARATION_LABEL = 'General Declaration (FAL 1)';
export const CREW_DETAILS_LABEL = 'Crew details including supernumeraries (FAL 5)';
export const PASSENGER_DETAILS_LABEL = 'Any passenger details (FAL 6)';
export const SUPPORTING_DOCUMENTS_LABEL = 'Supporting documents';
export const CHECK_YOUR_ANSWERS_LABEL = 'Check answers and submit';

// File upload
export const MAX_FILE_SIZE = 4194304;
export const MAX_FILE_SIZE_DISPLAY = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
export const MAX_SUPPORTING_FILE_SIZE = 1048576;
export const MAX_SUPPORTING_FILE_SIZE_DISPLAY = (MAX_SUPPORTING_FILE_SIZE / (1024 * 1024)).toFixed(0);
