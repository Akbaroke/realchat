import TimeDisplay from '../TimeDisplay';
import { BsCheckAll, BsCheck } from 'react-icons/bs';
import { GrFormEdit } from 'react-icons/gr';
import { Variants, motion as mo } from 'framer-motion';
import { useState } from 'react';
import { useClickOutside } from '@mantine/hooks';
import { DataChats } from '@/hooks/useSnapshotChats';
import ModalEditMessage from '@/components/molecules/ModalEditMessage';
import hideShowMessage from '@/services/hideShowMessage';
import ModalDeleteMessage from '@/components/molecules/ModalDeleteMessage';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import isDeletedMe from '@/utils/isDeletedMe';
import cn from '@/utils/cn';
import { CopyButton } from '@mantine/core';

type Props = {
  chat: DataChats;
};

export default function RightChat({ chat }: Props) {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [isMessageHide, setIsMessageHide] = useState(chat.isHide);
  const ref = useClickOutside(() => setIsOpen(false));

  const toggleHideShowMessage = () => {
    setIsMessageHide(!isMessageHide);
    hideShowMessage(chat.id, !isMessageHide);
  };

  const isEditeble = (): boolean => {
    const currentTimeSeconds = Math.floor(new Date().getTime() / 1000.0);
    const chatCreatedAt = chat.created_at;
    const threeDayInSeconds = 1 * 24 * 60 * 60; // 1 hari dalam detik
    const waktuEditeble = chatCreatedAt + threeDayInSeconds;

    return currentTimeSeconds > waktuEditeble;
  };

  const isHideble = (): boolean => {
    const chatCreatedAt = chat.created_at;
    const currentTimeSeconds = Math.floor(new Date().getTime() / 1000.0);
    const threeDayInSeconds = 3 * 24 * 60 * 60; // 7 hari dalam detik
    const waktuEditeble = chatCreatedAt + threeDayInSeconds;

    return currentTimeSeconds > waktuEditeble;
  };

  return (
    !isDeletedMe({
      deletedUs_userid: chat?.isDeletedUs || [],
      user_id: user?.id || '',
    }) && (
      <mo.div initial={false} animate={isOpen ? 'open' : 'closed'}>
        <div className="flex flex-col gap-1 items-end mb-4">
          <mo.div className="relative" ref={ref}>
            <mo.p
              whileTap={{ scale: 0.9 }}
              className="whitespace-pre-line inline-block p-3 text-[14px] rounded-xl bg-black text-white cursor-pointer sm:max-w-[300px] max-w-[250px] break-words"
              onClick={() => setIsOpen(!isOpen)}>
              {!chat?.deleted_at ? (
                isMessageHide ? (
                  '•••••'
                ) : (
                  chat.message
                )
              ) : (
                <i className="font-light">Message has been deleted</i>
              )}
            </mo.p>
            <mo.ul
              onClick={() => setIsOpen(false)}
              variants={{
                open: {
                  clipPath: 'inset(0% 0% 0% 0% round 10px)',
                  transition: {
                    type: 'spring',
                    bounce: 0,
                    delayChildren: 0.3,
                    staggerChildren: 0.05,
                  },
                },
                closed: {
                  clipPath: 'inset(20% 0% 80% 100% round 10px)',
                  transition: {
                    type: 'spring',
                    bounce: 0,
                    duration: 0.3,
                  },
                },
              }}
              className="absolute -left-[90px] top-0 bg-white text-black border rounded-xl p-2 w-20 text-[12px] z-10">
              <CopyButton value={chat.message}>
                {({ copied, copy }) => (
                  <mo.li
                    variants={itemVariants}
                    onClick={chat?.deleted_at ? () => {} : copy}
                    className={cn(
                      'rounded-lg py-1 px-2 cursor-pointer',
                      chat?.deleted_at
                        ? 'cursor-not-allowed text-gray-300'
                        : 'hover:bg-black hover:text-white'
                    )}>
                    {copied ? 'Copied' : 'Copy'}
                  </mo.li>
                )}
              </CopyButton>
              <mo.li
                variants={itemVariants}
                className={cn(
                  'rounded-lg py-1 px-2 cursor-pointer',
                  chat?.deleted_at
                    ? 'cursor-not-allowed text-gray-300'
                    : 'hover:bg-black hover:text-white'
                )}>
                Reply
              </mo.li>
              <mo.li
                variants={itemVariants}
                onClick={
                  isHideble() || chat?.deleted_at
                    ? () => {}
                    : toggleHideShowMessage
                }
                className={cn(
                  'rounded-lg py-1 px-2 cursor-pointer',
                  isHideble() || chat?.deleted_at
                    ? 'cursor-not-allowed text-gray-300'
                    : 'hover:bg-black hover:text-white'
                )}>
                {isMessageHide ? 'Show' : 'Hide'}
              </mo.li>
              <ModalEditMessage
                isDisabled={isEditeble() || !!(chat?.deleted_at || false)}
                id={chat.id}
                message={chat.message}
                time={chat.created_at}
                isRead={chat.isRead}>
                <mo.li
                  variants={itemVariants}
                  className={cn(
                    'rounded-lg py-1 px-2 cursor-pointer',
                    isEditeble() || chat?.deleted_at
                      ? 'cursor-not-allowed text-gray-300'
                      : 'hover:bg-black hover:text-white'
                  )}>
                  Edit
                </mo.li>
              </ModalEditMessage>
              <ModalDeleteMessage
                id={chat.id}
                message={chat.message}
                time={chat.created_at}
                isRead={chat.isRead}
                isHide={chat.isHide}
                deleted_at={chat.deleted_at}>
                <mo.li
                  variants={itemVariants}
                  className="rounded-lg py-1 px-2 cursor-pointer hover:bg-black hover:text-white">
                  Delete
                </mo.li>
              </ModalDeleteMessage>
            </mo.ul>
          </mo.div>
          <div className="flex items-center gap-1">
            <TimeDisplay
              time={chat.created_at}
              className="text-[12px] text-gray-400"
              isTimeOnly={true}
            />
            {chat.isEdit && <GrFormEdit size={16} />}
            {chat.isRead ? <BsCheckAll size={16} /> : <BsCheck size={16} />}
          </div>
        </div>
      </mo.div>
    )
  );
}

const itemVariants: Variants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
  closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
};
