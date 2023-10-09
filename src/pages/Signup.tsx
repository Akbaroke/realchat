import Button from '@/components/atoms/Button';
import ButtonGoogle from '@/components/atoms/ButtonGoogle';
import Input from '@/components/atoms/Input';
import { isEmail, useForm } from '@mantine/form';
import { Link } from 'react-router-dom';

type FormType = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Signup() {
  const form = useForm<FormType>({
    validateInputOnChange: true,
    validateInputOnBlur: true,
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      email: isEmail('Email is not valid.'),
      password: (value) =>
        value.length < 8 ? 'Password must be at least 8 characters.' : null,
    },
  });

  return (
    <div className="max-w-[400px] m-auto sm:mt-5 sm:shadow-md rounded-xl p-5 sm:p-8 flex flex-col gap-3">
      <div className="flex flex-col gap-6 mt-5">
        <h1 className="text-[18px] font-semibold">Sign up</h1>
        <ButtonGoogle>Sign up with google</ButtonGoogle>
      </div>
      <div className="flex items-center [&>span]:h-[1px] [&>span]:w-full [&>span]:bg-gray-100 gap-3 mt-2">
        <span></span>
        <p className="text-center text-[12px] text-gray-400">Or</p>
        <span></span>
      </div>
      <form className="flex flex-col gap-1">
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
        <Input
          id="confirm password"
          label="Confirm password"
          type="password"
          placeholder="Enter your confirm password"
          value={form.values.confirmPassword}
          errorLabel={form.errors.confirmPassword as string}
          onChange={(e) => form.setFieldValue('confirmPassword', e as string)}
        />
        <Button className="mt-5">Sign up</Button>
      </form>
      <div className="text-[14px] m-auto mt-3 text-gray-400">
        Dont have an account ?{' '}
        <Link to="/signin" className="text-black font-semibold hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
