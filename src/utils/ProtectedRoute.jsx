import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import { LANDING_URL } from '../constants/AppUrlConstants';

const ProtectedRoute = ({ component, user }) => {
  console.log(user);

  /* States to redirect to login (regardless of the state of other key/values in user)
     - no user.auth state
     - no user.name state
     - user.auth === false
  */
  if (!user.auth || !user.name || user.auth === false) {
    return <Navigate to={LANDING_URL} replace />; // replace replaces the current entry in the history stack, so back button will not go back to previous page
  }

  return component ? component : <Outlet />;
};

export default ProtectedRoute;

ProtectedRoute.propTypes = {
  user: PropTypes.object, // there may or may not be a user prop, if there is it must be an object
  component: PropTypes.element // there may or may not be a children prop, if there is it must be a React renderable element (if this breaks can change node - any renderable element)
};
