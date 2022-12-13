import axios from 'axios';
import Auth from '../utils/Auth';

const usePostData = ({url, dataToSubmit, pageSource}) => {
  const source = pageSource || location.pathname.substring(1);
  const data = axios.post(url, dataToSubmit, {
    headers: { Authorization: `Bearer ${Auth.retrieveToken()}` },
  })
    .then((resp) => { return resp.data; })
    .catch((err) => {
      if (err.response) {
        switch (err.response.status) {
          case 401:
          case 422:
          case 405: window.location.assign(`/sign-in?source=${source}`); break;
          default: return ({ errors: true, status: err.response.status, message: err.response.data?.message });
        }
      }
    });
  return data;
};

export default usePostData;
