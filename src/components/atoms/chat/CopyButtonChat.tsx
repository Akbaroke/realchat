import { DataChats, OpenAiDataType } from '@/hooks/useSnapshotChats';
import { CopyButton } from '@mantine/core';
import { toastSuccess } from '../Toast';
import { Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import cn from '@/utils/cn';

type Props = {
  chat: DataChats;
  varian?: 'left' | 'right';
  itemVariants: Variants;
};

export default function CopyButtonChat({ chat, varian, itemVariants }: Props) {
  const openaiData = chat?.content?.data as OpenAiDataType;
  const copyOpenAiWithMessage = `Question ~
${openaiData?.question}

Result ~
${openaiData?.result}

${chat?.message && 'Message ~'}
${chat?.message}`;

  return (
    <CopyButton
      value={
        chat.content?.type === 'generateAI' ? copyOpenAiWithMessage : chat.message
      }>
      {({ copied, copy }) => (
        <motion.li
          variants={itemVariants}
          onClick={
            chat?.deleted_at
              ? () => null
              : () => {
                  copy();
                  toastSuccess(
                    'Copied to clipboard',
                    'copy-' + new Date().getTime()
                  );
                }
          }
          className={cn(
            'rounded-lg py-1 px-2 cursor-pointer',
            chat?.deleted_at
              ? 'cursor-not-allowed text-gray-300'
              : 'hover:bg-black hover:text-white',
            {
              'hover:bg-white hover:text-black': varian === 'left',
            }
          )}>
          {copied ? 'Copied' : 'Copy'}
        </motion.li>
      )}
    </CopyButton>
  );
}
