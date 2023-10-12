import { auth } from '@/config/firebase';
import { RootState } from '@/store';
import { onAuthStateChanged } from 'firebase/auth';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
};

export default function UserMiddleware({ children }: Props) {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  const location = useLocation();

  onAuthStateChanged(auth, (user) => {
    console.log(user);
  });

  if (!isLoggedIn) {
    return <Navigate to="/signin" state={{ from: location }} replace={true} />;
  }

  return children;
}
