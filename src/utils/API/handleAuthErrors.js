import { TOKEN_EXPIRED } from '../../constants/AppAPIConstants';
import { SIGN_IN_URL } from '../../constants/AppUrlConstants';
import Auth from '../Auth';

const handleAuthErrors = ({ error, navigate, redirectUrl }) => {
  let errorResponse;

  if (error?.response?.status === 422 || error?.response?.status === 401) {
    Auth.removeToken();
    navigate(SIGN_IN_URL, { state: { redirectURL: redirectUrl } });
  } else if (error?.response?.data?.msg === TOKEN_EXPIRED) {
    Auth.removeToken();
    navigate(SIGN_IN_URL, { state: { redirectURL: redirectUrl } });
  } else {
    errorResponse = error;
  }

  return errorResponse;
};

export default handleAuthErrors;
