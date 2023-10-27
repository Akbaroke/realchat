import Search from '@/components/atoms/Search';
import { useState } from 'react';
import CardRoom from '../molecules/CardRoom';
import { motion as mo } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { UserType } from '@/store/slices/authSlice';
import { DataChats } from '@/hooks/useSnapshotChats';
import { Loader, Transition } from '@mantine/core';
import { TbMessage2Plus } from 'react-icons/tb';
import Button from '../atoms/Button';
import { useNavigate } from 'react-router-dom';

export interface ListRooms {
  users_id: string[];
  id: string;
  lastMessage: DataChats;
  countUnread: number;
  users: UserType[];
}

export default function PersonalView() {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [searchValue, setSearchValue] = useState('');
  const { isLoading, roomsPersonal } = useSelector(
    (state: RootState) => state.rooms
  );

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
        const dateA = new Date(a.lastMessage?.created_at);
        const dateB = new Date(b.lastMessage?.created_at);
        if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
          return dateB.getTime() - dateA.getTime();
        }
        return 0;
      });
  };

  const filteredRooms = filterRooms(roomsPersonal, searchValue);

  return (
    <div className="px-5 flex flex-col gap-5">
      <Transition
        mounted={roomsPersonal.length > 0 ? true : false}
        transition="slide-up"
        duration={400}
        timingFunction="ease">
        {(styles) => (
          <div style={styles}>
            <Search searchValue={searchValue} setSearchValue={setSearchValue} />
          </div>
        )}
      </Transition>

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
        {isLoading && roomsPersonal.length === 0 && (
          <Loader color="dark" size="sm" variant="dots" className="m-auto" />
        )}
      </div>

      <Transition
        mounted={roomsPersonal.length === 0 && !isLoading ? true : false}
        transition="slide-up"
        duration={400}
        timingFunction="ease">
        {(styles) => (
          <div style={styles}>
            <div className="flex flex-col gap-8 items-center justify-center h-[300px]">
              <div className="text-gray-400 flex flex-col justify-center items-center gap-2">
                <TbMessage2Plus size={30} />
                <p className="italic text-[14px] font-light">No message yet</p>
              </div>
              <Button
                className="w-max px-5 active:scale-90"
                onClick={() => navigate('/personal')}>
                Make Now
              </Button>
            </div>
          </div>
        )}
      </Transition>
    </div>
  );
}
