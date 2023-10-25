import ModalEditMessage from '@/components/organisms/ModalEditMessage';
import { DataChats } from '@/hooks/useSnapshotChats';
import cn from '@/utils/cn';
import { Variants, motion } from 'framer-motion';

type Props = {
  chat: DataChats;
  itemVariants: Variants;
};

export default function EditButtonChat({ chat, itemVariants }: Props) {
  return (
    <ModalEditMessage
      isDisabled={isEditeble(chat.created_at) || !!(chat?.deleted_at || false)}
      chat={chat}>
      <motion.li
        variants={itemVariants}
        className={cn(
          'rounded-lg py-1 px-2 cursor-pointer',
          isEditeble(chat.created_at) || !!(chat?.deleted_at || false)
            ? 'cursor-not-allowed text-gray-300'
            : 'hover:bg-black hover:text-white'
        )}>
        Edit
      </motion.li>
    </ModalEditMessage>
  );
}

const isEditeble = (timeStart: number): boolean => {
  const currentTimeSeconds = Math.floor(new Date().getTime() / 1000.0);
  const chatCreatedAt = timeStart;
  const oneDayInSeconds = 1 * 24 * 60 * 60; // 1 hari dalam detik
  const waktuEditeble = chatCreatedAt + oneDayInSeconds;

  return currentTimeSeconds > waktuEditeble;
};
