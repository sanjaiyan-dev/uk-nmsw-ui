import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import { LANDING_URL } from '../constants/AppUrlConstants';

const ProtectedRoute = ({ children, user }) => {
  if (!user) {
    return <Navigate to={LANDING_URL} replace />; // replace replaces the current entry in the history stack, so back button will not go back to previous page
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;

ProtectedRoute.propTypes = {
  user: PropTypes.objectOf({
    name: PropTypes.string,
  }),
  children: PropTypes.element // element indicates a React element should be rendered
  // children: PropTypes.node // node means anything can be rendered
};
