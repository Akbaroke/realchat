import { firestore } from '@/config/firebase';
import { UserType } from '@/store/slices/authSlice';
import { doc, getDoc } from 'firebase/firestore';

export default async function getFriend(personal_id: string, user_id: string) {
  const userRef = doc(firestore, 'personal', personal_id);
  const res = await getDoc(userRef);
  const data = res.data();
  const friend_id = data?.users_id.find((val: string) => val !== user_id);
  const friendDoc = await getDoc(doc(firestore, 'users', friend_id));
  const friendData = friendDoc.data() as UserType;

  return friendData;
}
