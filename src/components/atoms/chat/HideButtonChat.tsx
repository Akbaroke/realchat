import { DataChats } from '@/hooks/useSnapshotChats';
import cn from '@/utils/cn';
import { Variants, motion } from 'framer-motion';

type Props = {
  chat: DataChats;
  itemVariants: Variants;
  toggleHideShowMessage: () => void;
};

export default function HideButtonChat({
  chat,
  itemVariants,
  toggleHideShowMessage,
}: Props) {
  return (
    <motion.li
      variants={itemVariants}
      onClick={
        isHideble(chat.created_at) ?? chat?.deleted_at
          ? () => null
          : toggleHideShowMessage
      }
      className={cn(
        'rounded-lg py-1 px-2 cursor-pointer',
        isHideble(chat.created_at) || chat?.deleted_at
          ? 'cursor-not-allowed text-gray-300'
          : 'hover:bg-black hover:text-white'
      )}>
      {chat.isHide ? 'Show' : 'Hide'}
    </motion.li>
  );
}

const isHideble = (timeStart: number): boolean => {
  const chatCreatedAt = timeStart;
  const currentTimeSeconds = Math.floor(new Date().getTime() / 1000.0);
  const threeDayInSeconds = 3 * 24 * 60 * 60; // 3 hari dalam detik
  const waktuEditeble = chatCreatedAt + threeDayInSeconds;

  return currentTimeSeconds > waktuEditeble;
};
