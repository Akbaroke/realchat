import { firestore } from '@/config/firebase';
import { getDoc, doc } from 'firebase/firestore';

export default async function checkValidatePersonal(
  user_id: string,
  personal_id: string
) {
  try {
    const personalRef = doc(firestore, 'personal', personal_id);
    const data = await getDoc(personalRef);
    const users_id = data.data()?.users_id;
    return users_id.includes(user_id);
  } catch (error) {
    console.log(error);
    return false;
  }
}
