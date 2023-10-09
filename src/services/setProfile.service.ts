import { firestore } from '@/config/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export type UserDataType = {
  id: string;
  name: string;
  email: string;
  foto: string;
};

export default async function setProfileService(userData: UserDataType) {
  const { id, name, email, foto } = userData;
  const usersRef = doc(firestore, 'users', id);
  const data = await getDoc(usersRef);
  if (data.data()) {
    try {
      await updateDoc(usersRef, {
        ...data.data(),
        id: id,
        name: name,
        email: email,
        foto: foto,
      });
      console.log('update success');
    } catch (error) {
      console.error(error);
    }
  } else {
    try {
      await setDoc(usersRef, {
        id: id,
        name: name,
        email: email,
        foto: foto,
        bio: '',
        rooms: [],
        grups: [],
      });
      console.log('create success');
    } catch (error) {
      console.error(error);
    }
  }
}
