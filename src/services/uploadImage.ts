import { storage } from '@/config/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export default async function uploadImage(folderRef: string, imageFile: File) {
  const storageRef = ref(storage, folderRef);
  try {
    await uploadBytes(storageRef, imageFile);
    const res = await getDownloadURL(storageRef);
    return res;
  } catch (error) {
    console.log('upload image failed', error);
    return 'upload image failed';
  }
}
