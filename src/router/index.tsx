import { Route, Routes } from 'react-router';
import Signin from '@/pages/Signin';
import Signup from '@/pages/Signup';
import UserMiddleware from '@/middlewares/UserMiddleware';
import Home from '@/pages/Home';
import Personal from '@/pages/Personal';

export default function Root() {
  return (
    <Routes>
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/personal/:id" element={<Personal />} />
      <Route
        path="/"
        element={
          <UserMiddleware>
            <Home />
          </UserMiddleware>
        }
      />
    </Routes>
  );
}
