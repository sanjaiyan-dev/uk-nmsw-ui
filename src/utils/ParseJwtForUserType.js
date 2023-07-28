import {
  USER_GROUP_EXTERNAL,
  USER_GROUP_INTERNAL,
  USER_TYPE_ADMIN,
  USER_TYPE_STANDARD,
} from '../constants/AppConstants';

function ParseJwtForUserType(token) {
  /**
   * Get the JSON payload & convert to base64
   * For each character in that
   * - get its code -> charCodeAt(0)
   * - make it a string -> char.charCodeAt(0).toString(16)
   * - add % to put it into url encoded format -> `%${(`00${char.charCodeAt(0).toString(16)}`)}`
   * - return it
   * Join the results of the map
   * Decode the result of the join
   */

  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => `%${(`${c.charCodeAt(0).toString(16)}`)}`).join(''));

  /**
   * Extract the roles into an object we can use elsewhere
   */
  const payloadRoles = JSON.parse(jsonPayload).resource_access['nmsw-backend'].roles;

  const userRoles = {
    user: !!payloadRoles.find((role) => role === USER_TYPE_STANDARD),
    admin: !!payloadRoles.find((role) => role === USER_TYPE_ADMIN),
    internal: !!payloadRoles.find((role) => role === USER_GROUP_INTERNAL),
    external: !!payloadRoles.find((role) => role === USER_GROUP_EXTERNAL),
  };

  return userRoles;
}

export default ParseJwtForUserType;
