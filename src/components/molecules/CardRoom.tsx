import { Link } from 'react-router-dom';
import TimeDisplay from '../atoms/TimeDisplay';
import cn from '@/utils/cn';

type Props = {
  href: string;
  name: string;
  foto: string;
  lastMessage: string;
  updated_at: number;
  countUnread: number;
};

export default function CardRoom({
  href,
  name,
  foto,
  lastMessage,
  updated_at,
  countUnread,
}: Props) {
  return (
    <Link to={href} className="border-b py-4 flex gap-3">
      <img
        src={foto}
        alt={name}
        width={40}
        height={40}
        className="rounded-lg"
      />
      <div className="grid grid-cols-3 w-full">
        <div className="flex flex-col col-span-2">
          <h1 className="text-[14px] font-medium">{name}</h1>
          <p
            className={cn(
              'whitespace-nowrap w-full text-[12px] overflow-hidden overflow-ellipsis',
              {
                'text-gray-400': countUnread === 0,
              }
            )}>
            {lastMessage}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <TimeDisplay time={updated_at} className="text-[12px] font-medium" />
          <span
            className={cn(
              'text-[12px] font-medium bg-black text-white py-[4px] px-[5px] leading-3 rounded-full',
              {
                hidden: countUnread === 0,
              }
            )}>
            {countUnread}
          </span>
        </div>
      </div>
    </Link>
  );
}
