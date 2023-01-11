import { apiUrl } from './Config';

// Create account/register pages
export const REGISTER_ACCOUNT_ENDPOINT = `${apiUrl}/registration`;
export const REGISTER_CHECK_TOKEN_ENDPOINT = `${apiUrl}/check-token`;

// Responses
export const AXIOS_ERROR = 'Network Error';
export const TOKEN_INVALID = 'Token is invalid or it has expired';
export const USER_ALREADY_REGISTERED = 'User is already registered';
