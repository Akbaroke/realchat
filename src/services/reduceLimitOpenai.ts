import { firestore } from '@/config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default async function reduceLimitOpenai(user_id: string) {
  try {
    const usersRef = doc(firestore, 'users', user_id);
    const data = await getDoc(usersRef);
    const limitOpenai = data.data()?.limitOpenai.count;
    await updateDoc(usersRef, {
      ...data.data(),
      limitOpenai: {
        ...data.data()?.limitOpenai,
        count: limitOpenai - 1,
      },
    });
    console.log('success reduce limit openai');
  } catch (error) {
    console.log(error);
  }
}
