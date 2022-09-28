import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import { LANDING_URL } from '../constants/AppUrlConstants';

const ProtectedRoutes = ({ user }) => {
  const isAuthenticated = (!user.auth || !user.name || user.auth === false) ? false : true;

  return (
    isAuthenticated ? <Outlet /> : <Navigate to={LANDING_URL} replace />
  );
};

export default ProtectedRoutes;

ProtectedRoutes.propTypes = {
  user: PropTypes.object, // there may or may not be a user prop, if there is it must be an object
};
