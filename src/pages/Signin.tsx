import Button from '@/components/atoms/Button';
import ButtonGoogle from '@/components/atoms/ButtonGoogle';
import Input from '@/components/atoms/Input';
import { auth } from '@/config/firebase';
import setProfileService, { UserDataType } from '@/services/setProfile.service';
import { UserType, login } from '@/store/slices/authSlice';
import { isEmail, useForm } from '@mantine/form';
import { signInWithPopup } from 'firebase/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

type FormType = {
  email: string;
  password: string;
};

export default function Signin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormType>({
    validateInputOnChange: true,
    validateInputOnBlur: true,
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: isEmail('Email is not valid.'),
      password: (value) =>
        value.length < 8 ? 'Password must be at least 8 characters.' : null,
    },
  });

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
    <div className="max-w-[400px] m-auto sm:mt-5 sm:shadow-md rounded-xl p-5 sm:p-8 flex flex-col gap-3">
      <div className="flex flex-col gap-6 mt-5">
        <h1 className="text-[18px] font-semibold">Sign in</h1>
        <ButtonGoogle onClick={handleGoogleSignin}>
          Sign in with google
        </ButtonGoogle>
      </div>
      <div className="flex items-center [&>span]:h-[1px] [&>span]:w-full [&>span]:bg-gray-100 gap-3 mt-2">
        <span></span>
        <p className="text-center text-[12px] text-gray-400">Or</p>
        <span></span>
      </div>
      <form className="flex flex-col gap-1">
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={form.values.email}
          errorLabel={form.errors.email as string}
          onChange={(e) => form.setFieldValue('email', e as string)}
        />
        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={form.values.password}
          errorLabel={form.errors.password as string}
          onChange={(e) => form.setFieldValue('password', e as string)}
        />
        <Button className="mt-5" isLoading={isLoading}>
          Sign in
        </Button>
      </form>
      <div className="text-[14px] m-auto mt-3 text-gray-400">
        Dont have an account ?{' '}
        <Link to="/signup" className="text-black font-semibold hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}
