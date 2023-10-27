import { BrowserRouter } from 'react-router-dom';
import Router from './router';
import useSnapshotPersonal from './hooks/useSnapshotPersonal';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import { useEffect } from 'react';
import { setLoading, setRoomPersonal } from './store/slices/roomSlice';

export default function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { personalRealtime, isLoading } = useSnapshotPersonal(user?.id || '');

  useEffect(() => {
    dispatch(setLoading(isLoading));
    dispatch(setRoomPersonal(personalRealtime));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personalRealtime, isLoading]);

  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}
