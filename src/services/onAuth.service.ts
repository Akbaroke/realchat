import { auth } from '@/config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function onAuthService() {
  onAuthStateChanged(auth, (user) => {
    return user;
  });
}
