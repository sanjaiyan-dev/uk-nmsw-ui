import {
  USER_GROUP_EXTERNAL,
  USER_GROUP_INTERNAL,
  USER_TYPE_ADMIN,
  USER_TYPE_STANDARD,
} from '../constants/AppConstants';

function ParseJwtForUserType(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(window.atob(base64).split('').map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join(''));
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
