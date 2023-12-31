import LoadingView from '@/components/views/LoadingView';
import { auth } from '@/config/firebase';
import getProfile from '@/services/getProfile';
import setLimitOpenai from '@/services/setLimitOpenai';
import { RootState } from '@/store';
import { UserType, login } from '@/store/slices/authSlice';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
};

export default function UserMiddleware({ children }: Props) {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        getProfile(user.uid).then((data) => {
          if (data) {
            dispatch(login(data as unknown as UserType));
          }
        });
        setLimitOpenai(user.uid);
      }
      setIsLoading(false);
    });
  }, [dispatch]);

  if (!isLoggedIn) {
    return <Navigate to="/signin" state={{ from: location }} replace={true} />;
  }

  return (
    <>
      {isLoading && <LoadingView />}
      {children}
    </>
  );
}
