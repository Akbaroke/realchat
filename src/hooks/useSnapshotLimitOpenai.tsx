import { firestore } from '@/config/firebase';
import { onSnapshot, collection, getDoc, doc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const useSnapshotLimitOpenai = (user_id: string) => {
  const [limitCountOpenai, setLimitCountOpenai] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, 'users'), async () => {
      const usersRef = doc(firestore, 'users', user_id);
      const snapshot = await getDoc(usersRef);

      setLimitCountOpenai(snapshot.data()?.limitOpenai.count);
    });

    return unsubscribe;
  }, [user_id]);

  return limitCountOpenai;
};

export default useSnapshotLimitOpenai;
