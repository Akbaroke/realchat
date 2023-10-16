import { firestore } from '@/config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default async function updateMessage(
  message_id: string,
  message: string
) {
  const time = Math.floor(new Date().getTime() / 1000.0);
  const chatsRef = doc(firestore, 'chats', message_id);
  const chatsData = await getDoc(chatsRef);
  try {
    await updateDoc(chatsRef, {
      ...chatsData.data(),
      message,
      updated_at: time,
    });
  } catch (error) {
    console.log(error);
  }
}
