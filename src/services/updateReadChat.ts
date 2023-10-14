import { firestore } from '@/config/firebase';
import { DataChats } from '@/hooks/useSnapshotChats';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function updateReadChat(
  dataChats: DataChats[],
  user_id: string
) {
  const friendChats = dataChats?.filter((val) => val.user_id !== user_id);

  try {
    friendChats.map((val) => {
      if (!val.isRead) {
        funcReadChat(val.id);
      }
    });
  } catch (error) {
    console.log('update failed', error);
  }
}

const funcReadChat = async (id: string) => {
  const usersRef = doc(firestore, 'chats', id);
  const data = await getDoc(usersRef);
  if (data.data()) {
    await updateDoc(usersRef, {
      ...data.data(),
      isRead: true,
    });
  }
  console.log('update success');
};
