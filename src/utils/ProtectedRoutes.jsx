import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import { LANDING_URL } from '../constants/AppUrlConstants';

const ProtectedRoutes = ({ isPermittedToView }) => {
  return (
    isPermittedToView ? <Outlet /> : <Navigate to={LANDING_URL} replace />
  );
};

export default ProtectedRoutes;

ProtectedRoutes.propTypes = {
  isPermittedToView: PropTypes.bool.isRequired,
};
