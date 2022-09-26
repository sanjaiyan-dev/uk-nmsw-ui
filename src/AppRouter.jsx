import {
  Routes,
  Route,
} from 'react-router-dom';
// URLs
import {
  LANDING_URL,
  SIGN_IN_URL,
} from './constants/AppUrlConstants';
// Pages
import Landing from './pages/Landing/Landing';
import SignIn from './pages/SignIn/SignIn';

const AppRouter = () => {
  return (
    <Routes>
      <Route path='/' element={<Landing />} />
      <Route path={LANDING_URL} element={<Landing />} />
      <Route path={SIGN_IN_URL} element={<SignIn />} />
    </Routes>
  );
};

export default AppRouter;
