import { Routes, Route} from 'react-router-dom';
import ProtectedRoutes from './utils/ProtectedRoutes';

import useUserIsPermitted from './hooks/useUserIsPermitted';
// URLs
import {
  DASHBOARD_URL,
  LANDING_URL,
  SIGN_IN_URL,
  SECOND_PAGE_URL,
} from './constants/AppUrlConstants';
// Pages
import Dashboard from './pages/Dashboard/Dashboard';
import Landing from './pages/Landing/Landing';
import SignIn from './pages/SignIn/SignIn';
import SecondPage from './pages/TempPages/SecondPage';

const AppRouter = () => {
  const isPermittedToView = useUserIsPermitted();

  return (
    <Routes>
      <Route path='/' element={<Landing />} />
      <Route path={LANDING_URL} element={<Landing />} />
      <Route path={SIGN_IN_URL} element={<SignIn />} />
      <Route element={<ProtectedRoutes isPermittedToView={isPermittedToView} />}>
        <Route path={DASHBOARD_URL} element={<Dashboard />} />
        <Route path={SECOND_PAGE_URL} element={<SecondPage />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
