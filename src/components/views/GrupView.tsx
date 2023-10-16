// import { useState } from 'react';
// import Search from '../atoms/Search';
import { BiTimer } from 'react-icons/bi';

export default function GrupView() {
  // const [searchValue, setSearchValue] = useState('');

  return (
    <div className="px-5 flex flex-col gap-5">
      {/* <Search searchValue={searchValue} setSearchValue={setSearchValue} /> */}
      <div className="flex flex-col gap-2 items-center justify-center h-[300px]">
        <div className="text-gray-400 flex flex-col justify-center items-center gap-2">
          <BiTimer size={30} />
          <p className="italic text-[14px] font-light">Coming soon</p>
        </div>
      </div>
    </div>
  );
}
