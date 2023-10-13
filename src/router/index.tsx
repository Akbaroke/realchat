import { Route, Routes } from 'react-router';
import Signin from '@/pages/Signin';
import Signup from '@/pages/Signup';
import UserMiddleware from '@/middlewares/UserMiddleware';
import Home from '@/pages/Home';
import Personal from '@/pages/Personal';
import Profile from '@/pages/Profile';
import GuestMiddleware from '@/middlewares/GuestMiddleware';

export default function Root() {
  return (
    <Routes>
      <Route
        path="/signin"
        element={
          <GuestMiddleware>
            <Signin />
          </GuestMiddleware>
        }
      />
      <Route
        path="/signup"
        element={
          <GuestMiddleware>
            <Signup />
          </GuestMiddleware>
        }
      />
      <Route
        path="/personal/:id"
        element={
          <UserMiddleware>
            <Personal />
          </UserMiddleware>
        }
      />
      <Route
        path="/profile"
        element={
          <UserMiddleware>
            <Profile />
          </UserMiddleware>
        }
      />
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
