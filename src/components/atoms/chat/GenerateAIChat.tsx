import { DataChats, OpenAiDataType } from '@/hooks/useSnapshotChats';
import cn from '@/utils/cn';
import { RiRobot2Line } from 'react-icons/ri';

type Props = {
  chat: DataChats;
  varian?: 'left' | 'right';
};

export default function GenerateAIChat({ chat, varian }: Props) {
  const openaiData = chat?.content?.data as OpenAiDataType;
  const isLeft = varian === 'left';
  const containerClassName = isLeft
    ? 'text-black bg-gray-100'
    : 'text-white bg-gray-900';

  return (
    <div
      className={cn(
        'p-3 rounded-lg flex flex-col gap-4 relative',
        containerClassName
      )}>
      <div
        className={cn(
          'absolute -right-0 -top-0 bg-white w-9 h-9 grid place-items-center p-1 rounded-full',
          {
            'bg-black': isLeft,
          }
        )}>
        <RiRobot2Line className={cn(
          'text-black text-2xl',
          {
            'text-white': isLeft,
          }
        )} />
      </div>
      <div>
        <h1 className="italic text-gray-500 text-[14px]">Question ~</h1>
        <p className="break-words whitespace-pre-line text-[14px] font-medium leading-6">
          {openaiData.question}
        </p>
      </div>
      <div>
        <h1 className="italic text-gray-500 text-[14px]">Result ~</h1>
        <p className="break-words whitespace-pre-line text-[14px] font-medium leading-6">
          {openaiData.result}
        </p>
      </div>
    </div>
  );
}
