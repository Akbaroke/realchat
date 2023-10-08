import Search from '@/components/atoms/Search';
import { useState } from 'react';
import CardRoom from '../molecules/CardRoom';

interface ListRooms {
  id: string;
  name: string;
  foto: string;
  lastMessage: string;
  updated_at: number;
  countUnread: number;
}

const listRooms: ListRooms[] = [
  {
    id: '1',
    name: 'Udin',
    foto: 'https://picsum.photos/200?random=1',
    lastMessage: 'Hallo',
    updated_at: 1696695559,
    countUnread: 2,
  },
  {
    id: '2',
    name: 'Joko',
    foto: 'https://picsum.photos/200?random=2',
    lastMessage: 'Good mornig broo ooooo oooooooooooo',
    updated_at: 1696695559,
    countUnread: 0,
  },
];

export default function PersonalView() {
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="px-5 flex flex-col gap-5">
      <Search searchValue={searchValue} setSearchValue={setSearchValue} />
      <div className="flex flex-col gap-2">
        {listRooms.map((room) => (
          <CardRoom
            key={room.id}
            href={`/personal/${room.id}`}
            name={room.name}
            lastMessage={room.lastMessage}
            foto={room.foto}
            countUnread={room.countUnread}
            updated_at={room.updated_at}
          />
        ))}
      </div>
    </div>
  );
}
