import { DataChats } from '@/hooks/useSnapshotChats';
import { Image } from 'primereact/image';

type Props = {
  chat: DataChats;
  varian?: 'left' | 'right';
};

export default function ImageChat({ chat }: Props) {
  return (
    <Image
      src={chat?.content?.data as string}
      alt="image"
      width="300"
      className="rounded-lg overflow-hidden [&>img]:sm:max-h-[300px] [&>img]:max-h-[250px] [&>img]:sm:w-[300px] [&>img]:w-[250px] [&>img]:object-cover [&>img]:object-center h-full"
      preview
    />
  );
}
