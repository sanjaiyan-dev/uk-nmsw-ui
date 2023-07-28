import { INTERNAL_TEAMS, USER_TYPE_ADMIN } from '../constants/AppConstants';

class Auth {
  static storeToken(token) {
    sessionStorage.setItem('token', token);
  }

  static storeRefreshToken(refreshToken) {
    sessionStorage.setItem('refreshToken', refreshToken);
  }

  static storeUserType({ userData, tokenData }) {
    // for added security we check both user and token before setting true
    sessionStorage.setItem('user', JSON.stringify({
      admin: userData.userType.name === USER_TYPE_ADMIN && tokenData.admin,
      internal: INTERNAL_TEAMS.includes(userData.group.groupType.name) && tokenData.internal
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
