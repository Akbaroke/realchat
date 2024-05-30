import { DataChats } from '@/hooks/useSnapshotChats';
import { RootState } from '@/store';
import cn from '@/utils/cn';
import { LuImage } from 'react-icons/lu';
import { RiRobot2Line } from 'react-icons/ri';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useSelector } from 'react-redux';

type Props = {
  chat: DataChats;
  varian?: VarianType;
  scrollToChat: (chat_id: string) => void;
};

type VarianType = 'left' | 'right';

function ChatContent({ chat }: { chat: DataChats }) {
  const { user } = useSelector((state: RootState) => state.auth);

  const contentIcon =
    chat?.reply?.content?.type === 'picture' ? (
      <LuImage size={13} />
    ) : chat?.reply?.content?.type === 'generateAI' ? (
      <RiRobot2Line size={13} />
    ) : null;

  return (
    <div>
      <h1 className="text-[15px] font-medium whitespace-nowrap overflow-hidden overflow-ellipsis w-full max-w-[150px]">
        {chat?.reply?.user_id === user?.id ? 'You' : chat?.reply?.name}
      </h1>
      <div className="flex items-center justify-start w-full gap-1">
        {contentIcon}
        <p
          className={cn(
            'whitespace-nowrap text-[12px] overflow-hidden overflow-ellipsis w-full max-w-[150px]',
            {
              capitalize: !chat?.reply?.message && chat?.reply?.content,
            }
          )}>
          {!chat?.reply?.message && chat?.reply?.content
            ? chat?.reply?.content?.type
            : chat?.reply?.message}
        </p>
      </div>
    </div>
  );
}

export default function ReplyChat({ chat, varian, scrollToChat }: Props) {
  const containerClassName = getContainerClassName(varian);

  return (
    <div
      className={containerClassName}
      onClick={() => scrollToChat(chat?.reply?.id || '')}>
      <div className="flex items-center gap-3">
        {chat?.reply?.content?.type === 'picture' && (
          <LazyLoadImage
            alt="foto"
            effect="blur"
            width={50}
            height={50}
            src={chat?.reply.content?.data as string}
            className="rounded-lg bg-gray-200 h-full object-cover shadow-md"
            referrerPolicy="no-referrer"
          />
        )}
        <ChatContent chat={chat} />
      </div>
    </div>
  );
}

function getContainerClassName(varian?: VarianType) {
  const baseClassName = 'p-3 rounded-lg cursor-pointer';
  return varian === 'left'
    ? `${baseClassName} text-black bg-gray-200 shadow-inner shadow-gray-300`
    : `${baseClassName} text-white bg-gray-900 shadow-inner shadow-gray-700`;
}
