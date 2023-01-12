const findCookiePreference = (cookieName) => {
  const cookieArray = document.cookie.split(';');

  for (let i = 0; i < cookieArray.length; i++) {
    const cookiePair = cookieArray[i].split('=');
    if (cookieName === cookiePair[0].trim()) {
      if (cookiePair[1] === 'true') {
        return true;
      }
      return false;
    }
  }
  return null;
};

export default findCookiePreference;
