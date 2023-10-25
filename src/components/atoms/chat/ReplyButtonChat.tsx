import { DataChats } from '@/hooks/useSnapshotChats';
import { setReply } from '@/store/slices/replySlice';
import cn from '@/utils/cn';
import { Variants, motion } from 'framer-motion';
import { useDispatch } from 'react-redux';

type Props = {
  chat: DataChats;
  varian?: 'left' | 'right';
  itemVariants: Variants;
};

export default function ReplyButtonChat({ chat, varian, itemVariants }: Props) {
  const dispatch = useDispatch();

  return (
    <motion.li
      variants={itemVariants}
      className={cn(
        'rounded-lg py-1 px-2 cursor-pointer',
        chat?.deleted_at ?? chat.isHide
          ? 'cursor-not-allowed text-gray-300'
          : 'hover:bg-black hover:text-white',
        {
          'hover:bg-white hover:text-black': varian === 'left',
        }
      )}
      onClick={() =>
        chat?.deleted_at ?? chat.isHide ? null : dispatch(setReply({ chat }))
      }>
      Reply
    </motion.li>
  );
}
