import { firestore } from '@/config/firebase';
import { getDoc, updateDoc, doc } from 'firebase/firestore';

type NewDataType = {
  name: string;
  bio: string;
};

export default async function updateProfile(id: string, newData: NewDataType) {
  const usersRef = doc(firestore, 'users', id);
  const data = await getDoc(usersRef);
  if (data.data()) {
    await updateDoc(usersRef, {
      ...data.data(),
      name: newData.name,
      bio: newData.bio,
    });
  }
}
