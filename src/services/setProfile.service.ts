import { firestore } from '@/config/firebase';
import { UserType } from '@/store/slices/authSlice';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export default async function setProfileService(userData: UserType) {
  const { id, name, email, foto } = userData;
  const usersRef = doc(firestore, 'users', id);
  const data = await getDoc(usersRef);
  if (data.data()) {
    try {
      await updateDoc(usersRef, {
        ...data.data(),
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
      });
      console.log('create success');
    } catch (error) {
      console.error(error);
    }
  }
}
