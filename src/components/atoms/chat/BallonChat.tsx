import { DataChats } from '@/pages/Personal';
import LeftChat from './LeftChat';
import RightChat from './RightChat';

type Props = {
  varian: 'left' | 'right';
  chat: DataChats;
};

export default function BallonChat({ varian, chat }: Props) {
  return varian === 'left' ? (
    <LeftChat chat={chat} />
  ) : (
    <RightChat chat={chat} />
  );
}
