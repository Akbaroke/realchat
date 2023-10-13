import { Link } from 'react-router-dom';
import TimeDisplay from '../atoms/TimeDisplay';
import cn from '@/utils/cn';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { ListRooms } from '../views/PersonalView';
import { BsCheck, BsCheckAll } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

type Props = {
  room: ListRooms;
};

export default function CardRoom({ room }: Props) {
  const { user } = useSelector((state: RootState) => state.auth);
  const users = room.users.find((val) => val.id !== user?.id);

  return (
    <Link
      to={`/personal/${room.id}`}
      className="border-b border-gray-100 py-4 flex gap-3">
      <LazyLoadImage
        alt="foto"
        effect="blur"
        width={50}
        height={50}
        src={users?.foto}
        className="rounded-lg"
      />
      <div className="grid grid-cols-3 w-full">
        <div className="flex flex-col col-span-2">
          <h1 className="text-[15px] font-medium">{users?.name}</h1>
          <p
            className={cn(
              'whitespace-nowrap w-full text-[13px] overflow-hidden overflow-ellipsis',
              {
                'text-gray-400': room.countUnread === 0,
              }
            )}>
            {room.lastMessage.message}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <TimeDisplay
            time={room.lastMessage.updated_at}
            className="text-[13px] font-medium"
          />
          {room.lastMessage.user_id === users?.id ? (
            <span
              className={cn(
                'text-[12px] font-medium bg-black text-white py-[4px] px-[5px] leading-3 rounded-full',
                {
                  hidden: room.countUnread === 0,
                }
              )}>
              {room.countUnread}
            </span>
          ) : room.lastMessage.isRead ? (
            <BsCheckAll size={18} />
          ) : (
            <BsCheck size={18} />
          )}
        </div>
      </div>
    </Link>
  );
}
