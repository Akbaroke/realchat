import { ListRooms } from '@/components/views/PersonalView';
import { firestore } from '@/config/firebase';
import { UserType } from '@/store/slices/authSlice';
import {
  onSnapshot,
  collection,
  DocumentReference,
  getDoc,
  doc,
  getDocs,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

const useSnapshotPersonal = (id: string) => {
  const [personalRealtime, setPersonalRealtime] = useState<ListRooms[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const personalCollection = collection(firestore, 'personal');
    const chatsCollection = collection(firestore, 'chats');

    const fetchData = async () => {
      setIsLoading(true);
      const personalSnapshot = await getDocs(personalCollection);
      const updatedData = await Promise.all(
        personalSnapshot.docs.map(async (field) => {
          const lastMessageRef = field.data().lastMessage as DocumentReference;
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
          const chatsSnapshot = await getDocs(chatsCollection);
          const chatsFilter = chatsSnapshot.docs.filter(
            (doc) =>
              doc.data().personal_id === field.get('personal_id') &&
              !doc.data().isRead
          );

          return {
            ...field.data(),
            id: field.id,
            lastMessage: lastMessagePath,
            users: users,
            countUnread: chatsFilter.length,
          };
        })
      );

      setPersonalRealtime(updatedData as ListRooms[]);
      setIsLoading(false);
    };

    const personalUnsubscribe = onSnapshot(personalCollection, fetchData);
    const chatsUnsubscribe = onSnapshot(chatsCollection, fetchData);

    return () => {
      personalUnsubscribe();
      chatsUnsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return { personalRealtime, isLoading };
};

export default useSnapshotPersonal;
