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

export interface Content {
  type: 'picture' | 'coding' | 'openai';
  data: File | string | OpenAiDataType;
}

export type OpenAiDataType = {
  question: string;
  result: string;
};

export interface DataChats {
  id: string;
  personal_id: string;
  user_id: string;
  name: string;
  foto?: string;
  bio?: string;
  message: string;
  content?: Content;
  reply?: {
    id: string;
    name: string;
    message: string;
  };
  isRead: boolean;
  isHide: boolean;
  isEdit: boolean;
  isDeletedUs: string[];
  deleted_at: number;
  updated_at: number;
  created_at: number;
}

const useSnapshotChats = (personal_id: string) => {
  const [chatsRealtime, setChatsRealtime] = useState<DataChats[]>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, 'chats'), async () => {
      setIsLoading(true);
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
            bio: userData.bio,
          };
        })
      );

      setChatsRealtime(data as unknown as DataChats[]);
      setIsLoading(false);
    });

    return unsubscribe;
  }, [personal_id]);

  return { chatsRealtime, isLoading };
};

export default useSnapshotChats;
