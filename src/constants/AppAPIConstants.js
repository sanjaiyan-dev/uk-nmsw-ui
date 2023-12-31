import { apiUrl } from './Config';

export const API_URL = apiUrl;

// Create account/register
export const REGISTER_ACCOUNT_ENDPOINT = `${apiUrl}/registration`;
export const REGISTER_CHECK_TOKEN_ENDPOINT = `${apiUrl}/check-token`;
export const REGISTER_RESEND_VERIFICATION_EMAIL_ENDPOINT = `${apiUrl}/resend-verification-email`;
export const PASSSWORD_RESET_ENDPOINT = `${apiUrl}/reset-password`;
export const SIGN_IN_ENDPOINT = `${apiUrl}/sign-in`;
export const SIGN_OUT_ENDPOINT = `${apiUrl}/sign-out`;

// Manager user
export const GROUP_ENDPOINT = `${apiUrl}/group`;
export const USER_ENDPOINT = `${apiUrl}/user`;

// Report a voyage
export const CREATE_VOYAGE_ENDPOINT = `${apiUrl}/declaration`;
export const ENDPOINT_DECLARATION_PATH = '/declaration';
export const ENDPOINT_FILE_UPLOAD_GENERAL_DECLARATION_PATH = '/upload-fal1';
export const ENDPOINT_FILE_UPLOAD_CREW_DETAILS_PATH = '/upload-fal5';
export const ENDPOINT_FILE_UPLOAD_PASSENGER_DETAILS_PATH = '/upload-fal6';
export const ENDPOINT_FILE_UPLOAD_SUPPORTING_DOCUMENTS_PATH = '/supporting';
export const ENDPOINT_DECLARATION_ATTACHMENTS_PATH = '/attachments';

// Responses
export const DUPLICATE_RECORDS = 'Duplicate person records found. Please check the upload (note that duplication could be across FAL5 and 6).';
export const FILE_MISSING = 'No file provided';
export const FILE_TOO_LARGE = 'Large file';
export const FILE_TYPE_INVALID_PREFIX = 'Invalid file type';
export const FILE_TYPE_INVALID_CSV_XLSX = "Invalid file type: Not a ['csv', 'xlsx']";
export const FAL5_IS_EMPTY = 'File has no crew data';
export const FAL6_IS_EMPTY = 'No data rows found in file.';
export const TOKEN_EXPIRED = 'Token has expired';
export const TOKEN_INVALID = 'Token is invalid or it has expired';
export const TOKEN_USED_TO_REGISTER = 'Token was already used';
export const USER_ALREADY_REGISTERED = 'User is already registered';
export const USER_ALREADY_VERIFIED = 'User already verified';
export const USER_ALREADY_VERIFIED_LOGIN = 'User already verified, please login';
export const USER_AWAITING_VERIFICATION = 'User is awaiting verification';
export const USER_NOT_REGISTERED = 'User is not registered';
export const USER_HAS_NOT_BEEN_VERIFIED = 'User has not been verified yet';
export const USER_NOT_VERIFIED = 'User not verified, please verify registration';
export const USER_SIGN_IN_DETAILS_INVALID = 'Email or password invalid';
export const USER_MUST_UPDATE_PASSWORD = 'To use this service you will need to create a new password';
