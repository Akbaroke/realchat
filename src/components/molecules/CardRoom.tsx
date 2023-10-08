import { Link } from 'react-router-dom';

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
        width={50}
        height={50}
        className="rounded-lg"
      />
      <div className="flex flex-1 justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-[14px] font-medium">{name}</h1>
          <p className="whitespace-nowrap w-[180px] text-[12px] overflow-hidden overflow-ellipsis">
            {lastMessage}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <p className="text-[12px] font-medium">{updated_at}</p>
          <span className="text-[12px] font-medium bg-black text-white py-[5px] px-[6px] leading-3 rounded-full">
            {countUnread}
          </span>
        </div>
      </div>
    </Link>
  );
}
