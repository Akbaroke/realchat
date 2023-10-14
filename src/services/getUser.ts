import { firestore } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';

export interface UserInterface {
  id: string;
  email: string;
  name: string;
  rooms: string[];
  grups: string[];
  bio: string;
  foto: string;
}

export default async function getUsers(id: string): Promise<UserInterface> {
  const usersRef = doc(firestore, 'users', id);
  const snapshot = await getDoc(usersRef);
  const data = snapshot.data();

  const result = {
    id: snapshot.id as string,
    email: data?.email as string,
    name: data?.name as string,
    rooms: data?.rooms as string[],
    grups: data?.grups as string[],
    bio: data?.bio as string,
    foto: data?.foto as string,
  };

  return result;
}
