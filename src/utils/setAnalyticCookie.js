import ReactGA from 'react-ga4';
import { gaToken } from '../constants/Config';

const setAnalyticCookie = (cookiePreference) => {
  if (cookiePreference === true) {
    document.cookie = 'cookiePreference=true';
    window[`ga-disable-${gaToken}`] = false;
    ReactGA.send('pageview');
  } else if (cookiePreference === false) {
    document.cookie = 'cookiePreference=false';
    window[`ga-disable-${gaToken}`] = true;
  } else {
    window[`ga-disable-${gaToken}`] = true;
  }
};

export default setAnalyticCookie;
