import { firestore } from '@/config/firebase';
import { LimitOpenaiType } from '@/store/slices/authSlice';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default async function setLimitOpenai(id: string) {
  const usersRef = doc(firestore, 'users', id);
  const data = await getDoc(usersRef);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const limitOpenai: LimitOpenaiType = {
    count: 5,
    date: today.getTime(),
  };

  if (data.data()?.limitOpenai) {
    const expiredDate = data.data()?.limitOpenai?.date;
    const expiredDateWithoutTime = new Date(expiredDate);
    expiredDateWithoutTime.setHours(0, 0, 0, 0);

    if (expiredDateWithoutTime.getTime() !== today.getTime()) {
      try {
        await updateDoc(usersRef, {
          ...data.data(),
          limitOpenai,
        });
        console.log('update limit openai success');
      } catch (error) {
        console.error(error);
      }
    }
  } else {
    try {
      await updateDoc(usersRef, {
        ...data.data(),
        limitOpenai,
      });
      console.log('set limit openai success');
    } catch (error) {
      console.error(error);
    }
  }
}
