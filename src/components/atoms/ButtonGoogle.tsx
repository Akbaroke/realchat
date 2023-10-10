import { useState } from 'react';
import Button from './Button';
import { FcGoogle } from 'react-icons/fc';
import { GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { signInWithPopup } from 'firebase/auth';
import setProfileService, { UserDataType } from '@/services/setProfile.service';
import { UserType, login } from '@/store/slices/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
};

export default function ButtonGoogle({ children }: Props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignin = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      const { uid, displayName, email, photoURL } = res.user;
      const userData: UserDataType | UserType = {
        id: uid,
        name: displayName || '',
        email: email || '',
        foto: photoURL || '',
      };
      await setProfileService(userData);
      dispatch(login(userData as unknown as UserType));
      navigate('/');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className="flex items-center justify-center gap-2 bg-gray-100 text-gray-500 h-[40px]"
      variant="outline"
      isLoading={isLoading}
      onClick={handleGoogleSignin}>
      <FcGoogle size={18} />
      {children}
    </Button>
  );
}
