import { firestore } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';

async function getProfileById(userId: string) {
  const userRef = doc(firestore, 'users', userId);
  const res = await getDoc(userRef);
  const data = res.data();
  return data;
}

export { getProfileById };
