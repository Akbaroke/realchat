import ModalDeleteMessage from '@/components/organisms/ModalDeleteMessage';
import { DataChats } from '@/hooks/useSnapshotChats';
import { RootState } from '@/store';
import cn from '@/utils/cn';
import { Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

type Props = {
  chat: DataChats;
  varian?: 'left' | 'right';
  itemVariants: Variants;
};

export default function DeleteButtonChat({
  chat,
  varian,
  itemVariants,
}: Props) {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <ModalDeleteMessage chat={chat} isChatFriend={chat.user_id === user?.id}>
      <motion.li
        variants={itemVariants}
        className={cn(
          'rounded-lg py-1 px-2 cursor-pointer hover:bg-black hover:text-white',
          {
            'hover:bg-white hover:text-black': varian === 'left',
          }
        )}>
        Delete
      </motion.li>
    </ModalDeleteMessage>
  );
}
