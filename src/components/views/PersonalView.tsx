import Search from '@/components/atoms/Search';
import { useState } from 'react';
import CardRoom from '../molecules/CardRoom';
import { motion as mo } from 'framer-motion';
import { DataChats } from '@/pages/Personal';
import useSnapshotPersonal from '@/hooks/useSnapshotPersonal';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { UserType } from '@/store/slices/authSlice';

export interface ListRooms {
  id: string;
  lastMessage: DataChats;
  countUnread: number;
  users: UserType[];
}

export default function PersonalView() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [searchValue, setSearchValue] = useState('');
  const personal = useSnapshotPersonal(user?.id || '');

  const filterRooms = (rooms: ListRooms[], searchValue: string) => {
    return rooms.filter((room) => {
      const otherUser = room.users.find((user) => user.id !== user?.id);
      const userMatch = otherUser?.name
        .toLowerCase()
        .includes(searchValue.toLowerCase());

      const messageMatch = room.lastMessage.message
        .toLowerCase()
        .includes(searchValue.toLowerCase());

      return userMatch || messageMatch;
    });
  };

  const filteredRooms = filterRooms(personal || [], searchValue);

  return (
    <div className="px-5 flex flex-col gap-5">
      <Search searchValue={searchValue} setSearchValue={setSearchValue} />
      <div className="flex flex-col gap-2">
        {filteredRooms?.map((room, index) => (
          <mo.div
            initial={{ opacity: 0, transform: 'translateY(50px)' }}
            animate={{ opacity: 1, transform: 'translateY(0px)' }}
            transition={{ delay: index * 0.3, duration: 0.3 }}
            key={room.id}>
            <CardRoom room={room} />
          </mo.div>
        ))}
      </div>
    </div>
  );
}
