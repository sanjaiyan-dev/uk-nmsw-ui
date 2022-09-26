const setAnalyticCookie = (cookiePreference) => {
  if (cookiePreference === true ) {
    document.cookie = 'cookiePreference=true';
    console.log('GA ON');
  } else if (cookiePreference === false) {
    document.cookie = 'cookiePreference=false';
    console.log('GA OFF');
  } else {
    return;
  }
};

export default setAnalyticCookie;
