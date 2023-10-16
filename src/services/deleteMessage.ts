import { firestore } from '@/config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export type DeletedType = 'everyone' | 'me';

type Props = {
  message_id: string;
  user_id: string;
  type: DeletedType;
};

export default async function deleteMessage({
  message_id,
  user_id,
  type,
}: Props) {
  const time = Math.floor(new Date().getTime() / 1000.0);
  const chatsRef = doc(firestore, 'chats', message_id);
  const chatsData = await getDoc(chatsRef);
  const deletedUs_userid = chatsData.data()?.isDeletedUs || [];
  try {
    if (type === 'me') {
      await updateDoc(chatsRef, {
        ...chatsData.data(),
        isDeletedUs: [...deletedUs_userid, user_id],
      });
    } else {
      await updateDoc(chatsRef, {
        ...chatsData.data(),
        deleted_at: time,
      });
    }
  } catch (error) {
    console.log(error);
  }
}
