import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import {
  toastError,
  toastLoading,
  toastSuccess,
} from '@/components/atoms/Toast';
import { auth } from '@/config/firebase';
import { RootState } from '@/store';
import { logout, updateAuth } from '@/store/slices/authSlice';
import { useForm } from '@mantine/form';
import { signOut } from 'firebase/auth';
import { FiArrowLeft } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import ModalProfilePicture from '@/components/molecules/ModalProfilePicture';
import updateProfile from '@/services/updateProfile';
import { useEffect, useState } from 'react';
import { DEFAULT_FOTO } from '@/assets';

type FormType = {
  name: string;
  bio: string;
  email: string;
};

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isChanged, setIsChanged] = useState(false);

  const form = useForm<FormType>({
    validateInputOnChange: true,
    validateInputOnBlur: true,
    initialValues: {
      name: user?.name || '',
      bio: user?.bio || '',
      email: user?.email || '',
    },
    validate: {
      name: (value) =>
        value.length < 8 ? 'Name must be at least 8 characters.' : null,
    },
  });

  useEffect(() => {
    const { name, bio } = form.values;
    if (name !== user?.name || bio !== user?.bio) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [form, user]);

  const handleOnsubmit = async () => {
    toastLoading('Update process...', 'update');
    if (user?.id) {
      await updateProfile(user.id, {
        name: form.values.name,
        bio: form.values.bio,
      });
      dispatch(
        updateAuth({
          ...user,
          name: form.values.name,
          bio: form.values.bio,
        })
      );
      toastSuccess('Update Success', 'update');
    } else {
      navigate('/signin');
      toastError('Logout Failed', 'logout');
    }
  };

  const handleLogout = async () => {
    toastLoading('Logout process...', 'logout');
    await signOut(auth);
    navigate('/signin');
    dispatch(logout());
    toastSuccess('Logout Success', 'logout');
  };

  return (
    <div className="flex flex-col justify-between min-h-screen">
      <form onSubmit={form.onSubmit(handleOnsubmit)}>
        <div className="flex items-center px-5 py-3 border-b-2 sticky top-0 justify-between">
          <div className="flex items-center gap-5">
            <Link to="/">
              <FiArrowLeft size={18} />
            </Link>
            <h1 className="font-medium">Profile</h1>
          </div>

          <Button
            type="submit"
            className="w-max"
            isDisabled={!(isChanged && form.isValid())}>
            Save
          </Button>
        </div>
        <div className="p-5">
          <div className="m-auto w-max relative">
            <ModalProfilePicture imgSrc={user?.foto}>
              <LazyLoadImage
                alt="foto"
                effect="blur"
                src={user?.foto || DEFAULT_FOTO}
                className="w-28 h-28 rounded-full"
              />
            </ModalProfilePicture>
          </div>
          <Input
            id="name"
            label="Name"
            type="text"
            placeholder="Enter your name"
            value={form.values.name}
            errorLabel={form.errors.name as string}
            onChange={(e) => form.setFieldValue('name', e as string)}
          />
          <Input
            id="bio"
            label="Bio"
            type="text"
            placeholder="Enter your bio"
            value={form.values.bio}
            errorLabel={form.errors.bio as string}
            onChange={(e) => form.setFieldValue('bio', e as string)}
          />
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={form.values.email}
            errorLabel={form.errors.email as string}
            onChange={(e) => form.setFieldValue('email', e as string)}
            disabled={true}
          />
        </div>
      </form>
      <div className="p-5">
        <Button
          variant="outline"
          className="hover:bg-red-600 hover:text-white"
          onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
}