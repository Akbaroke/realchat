import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
};

export default function GuestMiddleware({ children }: Props) {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  const location = useLocation();
  const from = location?.state?.from?.pathname || '/';

  if (isLoggedIn) {
    return <Navigate to={from} replace={true} />;
  }

  return children;
}
