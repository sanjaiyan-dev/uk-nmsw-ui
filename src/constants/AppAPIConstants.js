import { apiUrl } from '../constants/Config';

// Create account/register pages
export const REGISTER_ACCOUNT_ENDPOINT = `${apiUrl}/registration`;

// Responses
export const TOKEN_INVALID = 'Token is invalid or it has expired';
export const USER_ALREADY_REGISTERED = 'User is already registered';
