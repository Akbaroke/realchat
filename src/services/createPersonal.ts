import { firestore } from '@/config/firebase';
import { DocumentReference, doc, setDoc } from 'firebase/firestore';

export interface DataNewPersonal {
  personal_id: string;
  lastMessage: DocumentReference;
  users_id: string[];
}

export default async function createPersonal(dataNewPersonal: DataNewPersonal) {
  const chatsRef = doc(firestore, 'personal', dataNewPersonal.personal_id);
  try {
    await setDoc(chatsRef, {
      ...dataNewPersonal,
      id: dataNewPersonal.personal_id,
    });
  } catch (error) {
    console.log(error);
  }
}
