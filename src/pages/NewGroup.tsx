import UserSearch from '@/components/atoms/UserSearch';
import { Checkbox } from '@mantine/core';
import { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from 'react-router-dom';

interface SearchResult {
  id: string;
  name: string;
  email: string;
  foto: string;
}

const dummySearchResult: SearchResult[] = [
  {
    id: '1',
    name: 'Udin',
    email: '3U9nB@example.com',
    foto: 'https://picsum.photos/200?random=1',
  },
  {
    id: '2',
    name: 'Joni',
    email: '3U9nB@example.com',
    foto: 'https://picsum.photos/200?random=2',
  },
];

export default function NewGroup() {
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="flex flex-col">
      <div className="flex items-center px-5 py-3 border-b-2 sticky top-0 gap-5">
        <Link to="/">
          <FiArrowLeft size={18} />
        </Link>
        <h1 className="font-medium">New Personal</h1>
      </div>
      <div className="p-5">
        <UserSearch setSearchValue={setSearchValue} />
      </div>
      <div className="px-5">
        <h1>Search Result</h1>
        <div className="flex flex-col gap-1">
          {dummySearchResult.map((user, index) => (
            <div
              key={index}
              className="border-b border-gray-100 py-4 flex gap-3">
              <LazyLoadImage
                alt="foto"
                effect="blur"
                width={50}
                height={50}
                src={user.foto}
                className="rounded-lg"
              />
              <div className="grid grid-cols-3 w-full">
                <div className="flex flex-col col-span-2">
                  <h1 className="text-[15px] font-medium">{user.name}</h1>
                  <p className="whitespace-nowrap w-full text-[13px] overflow-hidden overflow-ellipsis text-gray-400">
                    {user.email}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Checkbox
                    radius="xl"
                    color="dark"
                    className="relative top-3"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
