class Auth {
  static storeToken(token) {
    sessionStorage.setItem('token', token);
  }

  static storeRefreshToken(refreshToken) {
    sessionStorage.setItem('refreshToken', refreshToken);
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
