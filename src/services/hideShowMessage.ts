import { firestore } from '@/config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default async function hideShowMessage(
  message_id: string,
  isHide: boolean
) {
  const time = Math.floor(new Date().getTime() / 1000.0);
  const chatsRef = doc(firestore, 'chats', message_id);
  const chatsData = await getDoc(chatsRef);
  try {
    await updateDoc(chatsRef, {
      ...chatsData.data(),
      isHide,
      updated_at: time,
    });
  } catch (error) {
    console.log(error);
  }
}
