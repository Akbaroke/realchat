import { DataChats } from '@/hooks/useSnapshotChats';
import downloadImage from '@/utils/downloadImage';
import getDateTime from '@/utils/getDateTime';
import { Variants, motion } from 'framer-motion';
import { toastError, toastLoading, toastSuccess } from '../Toast';
import cn from '@/utils/cn';

type Props = {
  chat: DataChats;
  varian?: 'left' | 'right';
  itemVariants: Variants;
};

export default function DownloadButtonChat({
  chat,
  varian,
  itemVariants,
}: Props) {
  const handleDownloadImage = () => {
    const id = getDateTime();
    toastLoading('Download process...', 'download-' + id);
    downloadImage(chat.content?.data as string, `RealChat Image ${id}.jpg`)
      .then(() => {
        toastSuccess('Downloaded successful', 'download-' + id);
      })
      .catch(() => {
        toastError('Downloaded failed', 'download-' + id);
      });
  };

  return (
    <motion.li
      variants={itemVariants}
      onClick={
        chat?.deleted_at ?? chat.isHide ? () => null : handleDownloadImage
      }
      className={cn(
        'rounded-lg py-1 px-2 cursor-pointer',
        chat?.deleted_at ?? chat.isHide
          ? 'cursor-not-allowed text-gray-300'
          : 'hover:bg-black hover:text-white',
        {
          'hover:bg-white hover:text-black': varian === 'left',
        }
      )}>
      Download
    </motion.li>
  );
}
