import { useState } from 'react';
import Search from '../atoms/Search';

export default function GrupView() {
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="px-5 flex flex-col gap-5">
      <Search searchValue={searchValue} setSearchValue={setSearchValue} />
      <div className="flex flex-col gap-2"></div>
    </div>
  );
}
