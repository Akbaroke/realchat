import { BLACK_OPENAI, WHITE_OPENAI } from '@/assets';
import { DataChats, OpenAiDataType } from '@/hooks/useSnapshotChats';
import cn from '@/utils/cn';
import { LazyLoadImage } from 'react-lazy-load-image-component';

type Props = {
  chat: DataChats;
  varian?: 'left' | 'right';
};

export default function OpenAiChat({ chat, varian }: Props) {
  const openaiData = chat?.content?.data as OpenAiDataType;
  const isLeft = varian === 'left';
  const containerClassName = isLeft
    ? 'text-black bg-gray-100'
    : 'text-white bg-gray-900';
  const iconSrc = isLeft ? WHITE_OPENAI : BLACK_OPENAI;

  return (
    <div
      className={cn(
        'p-3 rounded-lg flex flex-col gap-4 relative',
        containerClassName
      )}>
      <div
        className={cn(
          'absolute -right-1 -top-1 bg-white w-10 h-10 grid place-items-center p-1 rounded-full',
          {
            'bg-black': isLeft,
          }
        )}>
        <LazyLoadImage
          alt="foto"
          effect="blur"
          src={iconSrc}
          width={30}
          height={30}
        />
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
