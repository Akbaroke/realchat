import { firestore } from '@/config/firebase';
import { collection, getDocs, query } from 'firebase/firestore';

export interface UserInterface {
  id: string;
  email: string;
  name: string;
  rooms: string[];
  grups: string[];
  bio: string;
  foto: string;
}

export default async function getUsers(): Promise<UserInterface[]> {
  const allData = query(collection(firestore, 'users'));
  const snapshot = await getDocs(allData);
  const data = snapshot.docs.map((doc) => {
    const userData = doc.data();
    const user: UserInterface = {
      id: doc.id as string,
      email: userData.email as string,
      name: userData.name as string,
      rooms: userData.rooms as string[],
      grups: userData.grups as string[],
      bio: userData.bio as string,
      foto: userData.foto as string,
    };
    return user;
  });

  return data;
}
