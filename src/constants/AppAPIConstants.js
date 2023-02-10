import { apiUrl } from './Config';

// Create account/register
export const REGISTER_ACCOUNT_ENDPOINT = `${apiUrl}/registration`;
export const REGISTER_CHECK_TOKEN_ENDPOINT = `${apiUrl}/check-token`;
export const REGISTER_RESEND_VERIFICATION_EMAIL_ENDPOINT = `${apiUrl}/resend-verification-email`;
export const SIGN_IN_ENDPOINT = `${apiUrl}/sign-in`;
export const SIGN_OUT_ENDPOINT = `${apiUrl}/sign-out`;

// Report a voyage
export const CREATE_VOYAGE_ENDPOINT = `${apiUrl}/user/declaration`;

// Responses
export const TOKEN_EXPIRED = 'Token has expired';
export const TOKEN_INVALID = 'Token is invalid or it has expired';
export const TOKEN_USED_TO_REGISTER = 'Token was already used';
export const USER_ALREADY_REGISTERED = 'User is already registered';
export const USER_ALREADY_VERIFIED = 'User already verified, please login';
export const USER_AWAITING_VERIFICATION = 'User is awaiting verification';
export const USER_NOT_REGISTERED = 'User is not registered';
export const USER_NOT_VERIFIED = 'User not verified, please verify registration';
export const USER_SIGN_IN_DETAILS_INVALID = 'Email or password invalid';
