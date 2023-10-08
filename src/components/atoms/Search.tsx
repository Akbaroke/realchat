import { Input } from '@mantine/core';
import { FiSearch } from 'react-icons/fi';

type Props = {
  searchValue: string;
  setSearchValue: (value: string) => void;
};

export default function Search({ searchValue, setSearchValue }: Props) {
  return (
    <Input
      icon={<FiSearch />}
      variant="unstyled"
      placeholder="Search"
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      className="border rounded-lg py-1"
    />
  );
}
