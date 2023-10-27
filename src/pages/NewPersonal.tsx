import UserSearch from '@/components/atoms/UserSearch';
import { useEffect, useState } from 'react';
import { FiChevronLeft } from 'react-icons/fi';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useNavigate } from 'react-router-dom';
import { motion as mo } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { useDebouncedState } from '@mantine/hooks';
import getUserDatas, { UserInterface } from '@/services/getUsers';
import { Loader, Transition } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { PersonalState, setPersonal } from '@/store/slices/personalSlice';
import { DEFAULT_FOTO } from '@/assets';
import { RootState } from '@/store';

export default function NewPersonal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);
  const { roomsPersonal } = useSelector((state: RootState) => state.rooms);
  const [value, setValue] = useDebouncedState('', 1000);
  const [listUsers, setListUsers] = useState<UserInterface[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (value.trim() !== '' && listUsers.length === 0) {
      setIsLoading(true);
      getUserDatas()
        .then((res) => setListUsers(res))
        .finally(() => setIsLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const filteredUsers = listUsers
    ?.filter(
      (user) =>
        user.name.toLowerCase().includes(value.toLowerCase()) ||
        user.email?.toLowerCase().includes(value.toLowerCase())
    )
    .filter((user) => user.id !== auth.user?.id);

  const handleDirectToPersonalRoom = (user: PersonalState) => {
    const userAlReady = roomsPersonal?.find((room) =>
      room.users_id.includes(user.user_id)
    );
    if (!userAlReady) {
      dispatch(setPersonal(user));
      navigate(`/personal/${user.personal_id}`);
    } else {
      navigate(`/personal/${userAlReady.id}`);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center px-5 py-3 border-b sticky top-0 gap-5">
        <div
          className="p-2 rounded-md border w-max text-gray-500 cursor-pointer hover:text-black transition-all"
          onClick={() => navigate('/')}>
          <FiChevronLeft size={16} />
        </div>
        <h1 className="font-medium">New Personal</h1>
      </div>
      <div className="p-5">
        <UserSearch setSearchValue={setValue} />
      </div>
      <Transition
        mounted={!!value}
        transition="slide-up"
        duration={400}
        timingFunction="ease">
        {(styles) => (
          <div className="px-5 bg-white z-10 relative" style={styles}>
            <h1 className="font-medium my-1">Search Result</h1>
            <div className="flex flex-col gap-1">
              {filteredUsers.map((user, index) => (
                <mo.div
                  initial={{ opacity: 0, transform: 'translateY(50px)' }}
                  animate={{ opacity: 1, transform: 'translateY(0px)' }}
                  transition={{ delay: index * 0.3, duration: 0.3 }}
                  key={index}>
                  <div
                    onClick={() =>
                      handleDirectToPersonalRoom({
                        ...user,
                        user_id: user.id,
                        personal_id: uuidv4(),
                      })
                    }
                    className="border-b border-gray-100 py-4 flex gap-3 cursor-pointer">
                    <LazyLoadImage
                      alt="foto"
                      effect="blur"
                      width={50}
                      height={50}
                      src={user.foto || DEFAULT_FOTO}
                      referrerPolicy="no-referrer"
                      className="rounded-lg"
                    />
                    <div className="grid grid-cols-3 w-full">
                      <div className="flex flex-col col-span-2">
                        <h1 className="text-[15px] font-medium">{user.name}</h1>
                        <p className="whitespace-nowrap w-full text-[13px] overflow-hidden overflow-ellipsis text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </mo.div>
              ))}
              {filteredUsers.length === 0 && (
                <p className="m-auto my-10 text-[14px] text-gray-400 italic">
                  User not found.
                </p>
              )}
            </div>
          </div>
        )}
      </Transition>
      <Transition
        mounted={isLoading}
        transition="slide-up"
        duration={400}
        timingFunction="ease">
        {(styles) => (
          <div className="m-auto my-10 z-0" style={styles}>
            <Loader color="dark" size="sm" variant="dots" />
          </div>
        )}
      </Transition>
    </div>
  );
}
