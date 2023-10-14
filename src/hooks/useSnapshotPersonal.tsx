import { ListRooms } from '@/components/views/PersonalView';
import { firestore } from '@/config/firebase';
import { UserType } from '@/store/slices/authSlice';
import {
  onSnapshot,
  collection,
  DocumentReference,
  getDoc,
  doc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

const useSnapshotPersonal = (id: string) => {
  const [personalUpdated, setPersonalUpdated] = useState<ListRooms[]>();

  useEffect(() => {
    const personalCollection = collection(firestore, 'personal');
    const chatsCollection = collection(firestore, 'chats');

    // Listen to updates in the 'personal' collection
    const personalUnsubscribe = onSnapshot(
      personalCollection,
      async (snapshot) => {
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

        setPersonalUpdated(data as ListRooms[]);
      }
    );

    // Listen to updates in the 'chats' collection
    const chatsUnsubscribe = onSnapshot(chatsCollection, async (snapshot) => {
      const updatedPersonal = personalUpdated?.map((room) => {
        const chatsFilter = snapshot.docs.filter(
          (doc) => doc.data().personal_id === room.id && !doc.data().isRead
        );
        return {
          ...room,
          countUnread: chatsFilter.length,
        };
      });

      setPersonalUpdated(updatedPersonal);
    });

    return () => {
      personalUnsubscribe();
      chatsUnsubscribe();
    };
  }, [id, personalUpdated]);

  return personalUpdated;
};

export default useSnapshotPersonal;
