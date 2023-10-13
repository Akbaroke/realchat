import { Input } from '@mantine/core';
import { MdAlternateEmail } from 'react-icons/md';

type Props = {
  setSearchValue: (value: string) => void;
};

export default function UserSearch({ setSearchValue }: Props) {
  return (
    <Input
      icon={<MdAlternateEmail />}
      variant="unstyled"
      placeholder="name or email user destination"
      onChange={(e) => setSearchValue(e.target.value)}
      className="border rounded-lg py-1"
    />
  );
}
