import { useContext } from 'react';
import { UserContext } from '../context/userContext';

const useUserIsPermitted = () => {
  const { user } = useContext(UserContext);
  // TODO: review why this only works with specified false/true
  // eslint-disable-next-line no-unneeded-ternary
  const isAuthenticated = !user?.token ? false : true;

  return isAuthenticated;
};

export default useUserIsPermitted;
