import { useContext } from 'react';
import { UserContext } from '../context/userContext';

const useUserIsPermitted = () => {
  const { user } = useContext(UserContext);
  const isAuthenticated = !user?.token  ? false : true;

  return isAuthenticated;
};

export default useUserIsPermitted;
