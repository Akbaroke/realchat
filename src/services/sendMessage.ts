import { firestore } from '@/config/firebase';
import { Content } from '@/hooks/useSnapshotChats';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export interface DataMessage {
  id: string;
  user_id: string;
  personal_id: string;
  message: string;
  content?: Content;
  reply?: {
    id: string;
    name: string;
    message: string;
  };
}

export default async function sendMessage(dataChat: DataMessage) {
  const time = Math.floor(new Date().getTime() / 1000.0);
  const chatsRef = doc(firestore, 'chats', dataChat.id);
  const personalRef = doc(firestore, 'personal', dataChat.personal_id);
  const personalData = await getDoc(personalRef);
  try {
    await updateDoc(personalRef, {
      ...personalData.data(),
      lastMessage: chatsRef,
    });
    await setDoc(chatsRef, {
      ...dataChat,
      isRead: false,
      isHide: false,
      isEdit: false,
      updated_at: time,
      created_at: time,
    });
  } catch (error) {
    console.log(error);
  }
}
