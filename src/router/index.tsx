import { Route, Routes } from 'react-router';
import Signin from '@/pages/Signin';
import Signup from '@/pages/Signup';
import UserMiddleware from '@/middlewares/UserMiddleware';
import Home from '@/pages/Home';
import Personal from '@/pages/Personal';
import Profile from '@/pages/Profile';
import GuestMiddleware from '@/middlewares/GuestMiddleware';
import NewPersonal from '@/pages/NewPersonal';
import EditProfile from '@/pages/EditProfile';

type DataRouteType = {
  path: string;
  element: React.ReactElement;
  middleware: 'guest' | 'user';
};

export default function Root() {
  const dataRoute: DataRouteType[] = [
    {
      path: '/signin',
      element: <Signin />,
      middleware: 'guest',
    },
    {
      path: '/signup',
      element: <Signup />,
      middleware: 'guest',
    },
    {
      path: '/',
      element: <Home />,
      middleware: 'user',
    },
    {
      path: '/profile',
      element: <Profile />,
      middleware: 'user',
    },
    {
      path: '/profile/edit',
      element: <EditProfile />,
      middleware: 'user',
    },
    {
      path: '/personal',
      element: <NewPersonal />,
      middleware: 'user',
    },
    {
      path: '/personal/:id',
      element: <Personal />,
      middleware: 'user',
    },
  ];

  return (
    <Routes>
      {dataRoute.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          element={
            route.middleware === 'guest' ? (
              <GuestMiddleware>{route.element}</GuestMiddleware>
            ) : (
              <UserMiddleware>{route.element}</UserMiddleware>
            )
          }
        />
      ))}
    </Routes>
  );
}
