import { firestore, storage } from '@/config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';

export type DeletedType = 'everyone' | 'me';

type Props = {
  personal_id: string;
  message_id: string;
  user_id: string;
  type: DeletedType;
  withImage?: boolean;
};

export default async function deleteMessage({
  personal_id,
  message_id,
  user_id,
  type,
  withImage,
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
      if (withImage) {
        await deleteObject(
          ref(storage, `personal/${personal_id}/${message_id}.jpg`)
        );
      }
      await updateDoc(chatsRef, {
        ...chatsData.data(),
        deleted_at: time,
      });
    }
  } catch (error) {
    console.log(error);
  }
}
