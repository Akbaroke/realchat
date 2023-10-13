import { ListRooms } from '@/components/views/PersonalView';
import { firestore } from '@/config/firebase';
import { UserType } from '@/store/slices/authSlice';
import {
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
  DocumentReference,
  getDoc,
  doc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

const useSnapshotPersonal = (id: string) => {
  const [personalUpdated, setPersonalUpdated] = useState<ListRooms[]>();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, 'personal'),
      async () => {
        const q = query(
          collection(firestore, 'personal'),
          where('users_id', 'array-contains', id)
        );
        const snapshot = await getDocs(q);

        const data = await Promise.all(
          snapshot.docs.map(async (field) => {
            const lastMessageRef = field.data()
              .lastMessage as DocumentReference;
            const lastMessageDoc = await getDoc(lastMessageRef);
            const lastMessagePath = lastMessageDoc.data();

            const userPromises = field
              .data()
              .users_id.map(async (userId: string | undefined) => {
                const userDoc = await getDoc(
                  doc(collection(firestore, 'users'), userId)
                );
                return userDoc.data() as UserType;
              });

            const users = await Promise.all(userPromises);

            return {
              id: field.id,
              ...field.data(),
              lastMessage: lastMessagePath,
              users: users,
            };
          })
        );

        setPersonalUpdated(data as unknown as ListRooms[]);
      }
    );

    return unsubscribe;
  }, [id]);

  return personalUpdated;
};

export default useSnapshotPersonal;
