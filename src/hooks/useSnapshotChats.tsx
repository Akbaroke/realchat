import { firestore } from '@/config/firebase';
import { UserType } from '@/store/slices/authSlice';
import {
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

export interface DataChats {
  id: string;
  user_id: string;
  name: string;
  foto?: string;
  message: string;
  content?: {
    type: 'picture' | 'coding' | 'openai';
    data: File | string;
  };
  reply?: {
    id: string;
    name: string;
    message: string;
  };
  isRead: boolean;
  isHide: boolean;
  isEdit: boolean;
  deleted_at: number;
  updated_at: number;
  created_at: number;
}

const useSnapshotChats = (personal_id: string) => {
  const [chatsUpdated, setChatsUpdated] = useState<DataChats[]>();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, 'chats'), async () => {
      const q = query(
        collection(firestore, 'chats'),
        where('personal_id', '==', personal_id)
      );
      const snapshot = await getDocs(q);

      const data = await Promise.all(
        snapshot.docs.map(async (field) => {
          const user_id = field.data().user_id;
          const userDoc = await getDoc(
            doc(collection(firestore, 'users'), user_id)
          );
          const userData = userDoc.data() as UserType;

          return {
            id: field.id,
            ...field.data(),
            foto: userData.foto,
            name: userData.name,
          };
        })
      );

      setChatsUpdated(data as unknown as DataChats[]);
    });

    return unsubscribe;
  }, [personal_id]);

  return chatsUpdated;
};

export default useSnapshotChats;
