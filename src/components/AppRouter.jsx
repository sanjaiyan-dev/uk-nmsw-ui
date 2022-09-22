import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
// Pages
import Landing from '../pages/Landing/Landing';
import SignIn from '../pages/SignIn/SignIn';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/sign-in" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
