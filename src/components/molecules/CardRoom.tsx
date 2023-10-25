import { useNavigate } from 'react-router-dom';
import TimeDisplay from '../atoms/TimeDisplay';
import cn from '@/utils/cn';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { ListRooms } from '../views/PersonalView';
import { BsCheck, BsCheckAll } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setPersonal } from '@/store/slices/personalSlice';
import { DEFAULT_FOTO } from '@/assets';
import { GrFormEdit } from 'react-icons/gr';
import isDeletedMe from '@/utils/isDeletedMe';
import { LuImage } from 'react-icons/lu';
import { SiOpenai } from 'react-icons/si';

type Props = {
  room: ListRooms;
};

export default function CardRoom({ room }: Props) {
  const { user } = useSelector((state: RootState) => state.auth);
  const users = room.users.find((val) => val.id !== user?.id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDirectToPersonalRoom = () => {
    dispatch(
      setPersonal({
        user_id: users?.id || '',
        personal_id: room.id,
        name: users?.name || '',
        email: users?.email || '',
        foto: users?.foto || '',
      })
    );

    navigate(`/personal/${room.id}`);
  };

  return (
    <div
      onClick={handleDirectToPersonalRoom}
      className="border-b border-gray-100 py-4 flex gap-3 cursor-pointer">
      <LazyLoadImage
        alt="foto"
        effect="blur"
        width={50}
        height={50}
        src={users?.foto || DEFAULT_FOTO}
        className="rounded-lg bg-gray-200"
        referrerPolicy="no-referrer"
      />
      <div className="grid grid-cols-3 w-full">
        <div className="flex flex-col col-span-2">
          <h1 className="text-[15px] font-medium overflow-ellipsis overflow-hidden whitespace-nowrap sm:max-w-[250px] max-w-[120px]">
            {users?.name}
          </h1>
          <div className="flex items-center justify-start w-full gap-1">
            {room?.lastMessage?.content?.type === 'picture' && (
              <LuImage
                size={13}
                className={cn({
                  'text-gray-400': room?.countUnread === 0,
                })}
              />
            )}
            {room?.lastMessage?.content?.type === 'openai' && (
              <SiOpenai
                size={13}
                className={cn({
                  'text-gray-400': room?.countUnread === 0,
                })}
              />
            )}
            <p
              className={cn(
                'whitespace-nowrap text-[13px] overflow-hidden overflow-ellipsis w-max flex-1',
                {
                  'text-gray-400': room?.countUnread === 0,
                }
              )}>
              {room?.lastMessage?.deleted_at ? (
                <i className="font-light">Message has been deleted</i>
              ) : !isDeletedMe({
                  deletedUs_userid: room?.lastMessage?.isDeletedUs || [],
                  user_id: user?.id || '',
                }) ? (
                room?.lastMessage?.isHide ? (
                  '•••••'
                ) : room?.lastMessage?.content &&
                  room?.lastMessage?.message === '' ? (
                  <i className="font-light capitalize">
                    {room?.lastMessage?.content?.type}
                  </i>
                ) : (
                  room?.lastMessage?.message
                )
              ) : (
                <i className="font-light">Message has been deleted for me</i>
              )}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <TimeDisplay
            time={room?.lastMessage?.updated_at}
            className="text-[13px] font-medium"
          />
          <div className="flex items-center gap-1">
            {room?.lastMessage?.isEdit && <GrFormEdit size={16} />}
            {room?.lastMessage?.user_id === users?.id ? (
              room?.countUnread > 0 && (
                <span className="text-[12px] font-medium bg-black text-white py-[4px] px-[5px] leading-3 rounded-full">
                  {room?.countUnread}
                </span>
              )
            ) : room?.lastMessage?.isRead ? (
              <BsCheckAll size={18} />
            ) : (
              <BsCheck size={18} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
