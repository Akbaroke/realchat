import { DataChats } from '@/hooks/useSnapshotChats';
import cn from '@/utils/cn';

type Props = {
  chat: DataChats;
  varian?: 'left' | 'right';
};

export default function MessageChat({ chat, varian }: Props) {
  return (
    <p
      className={cn(
        'sm:max-w-[300px] max-w-[250px] break-words whitespace-pre-line text-[14px] p-1',
        varian === 'left' ? 'text-black' : 'text-white'
      )}>
      {chat.message}
    </p>
  );
}
