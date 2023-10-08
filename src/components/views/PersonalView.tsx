import Search from '@/components/atoms/Search';
import { useState } from 'react';
import CardRoom from '../molecules/CardRoom';
import { motion as mo } from 'framer-motion';

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
    updated_at: 1696744212,
    countUnread: 2,
  },
  {
    id: '2',
    name: 'Joko',
    foto: 'https://picsum.photos/200?random=2',
    lastMessage:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    updated_at: 1664603412,
    countUnread: 0,
  },
  {
    id: '3',
    name: 'Udin',
    foto: 'https://picsum.photos/200?random=3',
    lastMessage: 'Hallo',
    updated_at: 1696744212,
    countUnread: 2,
  },
  {
    id: '4',
    name: 'Udin',
    foto: 'https://picsum.photos/200?random=4',
    lastMessage: 'Hallo',
    updated_at: 1696744212,
    countUnread: 2,
  },
  {
    id: '5',
    name: 'Udin',
    foto: 'https://picsum.photos/200?random=5',
    lastMessage: 'Hallo',
    updated_at: 1696744212,
    countUnread: 2,
  },
  {
    id: '6',
    name: 'Udin',
    foto: 'https://picsum.photos/200?random=6',
    lastMessage: 'Hallo',
    updated_at: 1696744212,
    countUnread: 2,
  },
];

export default function PersonalView() {
  const [searchValue, setSearchValue] = useState('');

  const filterRooms = (rooms: ListRooms[], searchValue: string) => {
    return rooms.filter(
      (room) =>
        room.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        room.lastMessage.toLowerCase().includes(searchValue.toLowerCase())
    );
  };

  const filteredRooms = filterRooms(listRooms, searchValue);

  return (
    <div className="px-5 flex flex-col gap-5">
      <Search searchValue={searchValue} setSearchValue={setSearchValue} />
      <div className="flex flex-col gap-2">
        {filteredRooms.map((room, index) => (
          <mo.div
            initial={{ opacity: 0, transform: 'translateY(50px)' }}
            animate={{ opacity: 1, transform: 'translateY(0px)' }}
            transition={{ delay: index * 0.3, duration: 0.3 }}
            key={room.id}>
            <CardRoom
              href={`/personal/${room.id}`}
              name={room.name}
              lastMessage={room.lastMessage}
              foto={room.foto}
              countUnread={room.countUnread}
              updated_at={room.updated_at}
            />
          </mo.div>
        ))}
      </div>
    </div>
  );
}
