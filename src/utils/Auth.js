import { INTERNAL_TEAMS, USER_TYPE_ADMIN } from '../constants/AppConstants';

class Auth {
  static storeToken(token) {
    sessionStorage.setItem('token', token);
  }

  static storeRefreshToken(refreshToken) {
    sessionStorage.setItem('refreshToken', refreshToken);
  }

  static storeUserType(user) {
    sessionStorage.setItem('user', JSON.stringify({
      admin: user.userType.name === USER_TYPE_ADMIN,
      internal: INTERNAL_TEAMS.includes(user.group.groupType.name),
    }));
  }

  static retrieveToken() {
    return sessionStorage.getItem('token');
  }

  static retrieveRefreshToken() {
    return sessionStorage.getItem('refreshToken');
  }

  static logout() {
    sessionStorage.clear();
  }

  static removeToken() {
    sessionStorage.removeItem('token');
  }

  static isAuthorized() {
    return this.retrieveToken();
  }
}

export default Auth;
