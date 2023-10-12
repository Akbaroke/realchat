import Input from '@/components/atoms/Input';
import { RootState } from '@/store';
import { useForm } from '@mantine/form';
import { FiArrowLeft } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

type FormType = {
  name: string;
  bio: string;
  email: string;
};

export default function Profile() {
  const { user } = useSelector((state: RootState) => state.auth);
  console.log(user);

  const form = useForm<FormType>({
    validateInputOnChange: true,
    validateInputOnBlur: true,
    initialValues: {
      name: user?.name || '',
      bio: '',
      email: user?.email || '',
    },
    validate: {
      name: (value) =>
        value.length < 8 ? 'Name must be at least 8 characters.' : null,
      bio: (value) =>
        value.length < 8 ? 'Bio must be at least 8 characters.' : null,
    },
  });

  const handleOnsubmit = () => {
    console.log(form.values);
  };

  return (
    <form onSubmit={form.onSubmit(handleOnsubmit)}>
      <div className="flex items-center p-5 border-b-2 sticky top-0 justify-between">
        <div className="flex items-center gap-5">
          <Link to="/">
            <FiArrowLeft size={18} />
          </Link>
          <h1 className="font-medium">Profile</h1>
        </div>
        <button type="submit">Save</button>
      </div>
      <div className="p-5">
        <img
          src={
            user?.foto ||
            'https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg'
          }
          alt=""
          className="w-28 h-28 rounded-full m-auto "
        />
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
  );
}
