import { useContext } from 'react';
import { UserContext } from '../context/userContext';

const useUserIsPermitted = () => {
  const { isAuthorized } = useContext(UserContext);
  const isAuthenticated = isAuthorized() ? true : false;

  return isAuthenticated;
};

export default useUserIsPermitted;
