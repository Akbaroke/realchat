import { firestore } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default async function getProfile(userId: string) {
  const userRef = doc(firestore, 'users', userId);
  const res = await getDoc(userRef);
  const data = res.data();
  return data;
}
