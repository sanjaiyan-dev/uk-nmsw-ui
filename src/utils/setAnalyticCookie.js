const setAnalyticCookie = (cookiePreference, type) => {
  if (cookiePreference === true || type === 'accept') {
    document.cookie = 'cookiePreference=true';
    console.log('GA ON');
  } else if (cookiePreference === false || type === 'reject') {
    document.cookie = 'cookiePreference=false';
    console.log('GA OFF');
  } else {
    return;
  }
};

export default setAnalyticCookie;
