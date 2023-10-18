import Search from '@/components/atoms/Search';
import { useState } from 'react';
import CardRoom from '../molecules/CardRoom';
import { motion as mo } from 'framer-motion';
import useSnapshotPersonal from '@/hooks/useSnapshotPersonal';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { UserType } from '@/store/slices/authSlice';
import { DataChats } from '@/hooks/useSnapshotChats';
import { Loader } from '@mantine/core';

export interface ListRooms {
  id: string;
  lastMessage: DataChats;
  countUnread: number;
  users: UserType[];
}

export default function PersonalView() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [searchValue, setSearchValue] = useState('');
  const { personalRealtime, isLoading } = useSnapshotPersonal(user?.id || '');

  const filterRooms = (rooms: ListRooms[], searchValue: string) => {
    return rooms
      ?.filter((room) => {
        const otherUser = room?.users?.find((value) => value?.id !== user?.id);
        const userMatch = otherUser?.name
          .toLowerCase()
          .includes(searchValue.toLowerCase());
        const messageMatch = room?.lastMessage?.message
          .toLowerCase()
          .includes(searchValue.toLowerCase());
        return userMatch || messageMatch;
      })
      .sort((a, b) => {
        const dateA = new Date(a.lastMessage.updated_at);
        const dateB = new Date(b.lastMessage.updated_at);
        if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
          return dateB.getTime() - dateA.getTime();
        }
        return 0;
      });
  };

  const filteredRooms = filterRooms(personalRealtime, searchValue);

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
        {isLoading && personalRealtime.length === 0 && (
          <Loader color="dark" size="sm" variant="dots" className="m-auto" />
        )}
      </div>
    </div>
  );
}
