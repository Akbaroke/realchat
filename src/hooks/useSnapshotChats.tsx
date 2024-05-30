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
  type: 'picture' | 'coding' | 'generateAI';
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
  reply?: DataChats;
  isRead: boolean;
  isHide: boolean;
  isEdit: boolean;
  isDeletedUs: string[];
  deleted_at: number;
  updated_at: number;
  created_at: number;
}

const useSnapshotChats = (personal_id: string) => {
  const [chatsRealtime, setChatsRealtime] = useState<DataChats[]>([]);
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

          const reply_id = field.data()?.reply;
          if (reply_id) {
            const replyDoc = await getDoc(
              doc(collection(firestore, 'chats'), reply_id)
            );
            const replyData = replyDoc.data() as DataChats;
            const userDoc = await getDoc(
              doc(collection(firestore, 'users'), replyData.user_id)
            );
            const userInfo = userDoc.data() as UserType;

            const replyDataResult = {
              ...replyData,
              foto: userInfo.foto,
              name: userInfo.name,
              bio: userInfo.bio,
            };

            return {
              id: field.id,
              ...field.data(),
              foto: userData.foto,
              name: userData.name,
              bio: userData.bio,
              reply: replyDataResult,
            };
          }

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
