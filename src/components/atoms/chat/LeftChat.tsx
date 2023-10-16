import TimeDisplay from '../TimeDisplay';
import { useState } from 'react';
import { useClickOutside } from '@mantine/hooks';
import { Variants, motion as mo } from 'framer-motion';
import { DataChats } from '@/hooks/useSnapshotChats';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { DEFAULT_FOTO } from '@/assets';
import { GrFormEdit } from 'react-icons/gr';
import { CopyButton } from '@mantine/core';
import cn from '@/utils/cn';
import ModalDeleteMessage from '@/components/molecules/ModalDeleteMessage';

type Props = {
  chat: DataChats;
};

export default function LeftChat({ chat }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickOutside(() => setIsOpen(false));

  return (
    <mo.div initial={false} animate={isOpen ? 'open' : 'closed'}>
      <div className="flex items-end gap-2 mb-4">
        <LazyLoadImage
          alt="foto"
          effect="blur"
          src={chat.foto || DEFAULT_FOTO}
          width={30}
          height={30}
          className="rounded-lg h-max relative bottom-2 bg-gray-200"
        />
        <div className="flex flex-col gap-1" ref={ref}>
          <mo.div
            className="p-3 text-[14px] border rounded-xl bg-white w-max relative cursor-pointer"
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}>
            <p className="whitespace-pre-line sm:max-w-[300px] max-w-[250px] break-words">
              {!chat?.deleted_at ? (
                chat.isHide ? (
                  '•••••'
                ) : (
                  chat.message
                )
              ) : (
                <i className="font-light">Message has been deleted</i>
              )}
            </p>
            <mo.ul
              variants={{
                open: {
                  clipPath: 'inset(0% 0% 0% 0% round 10px)',
                  opacity: 1,
                  transition: {
                    type: 'spring',
                    bounce: 0,
                    delayChildren: 0.3,
                    staggerChildren: 0.05,
                  },
                },
                closed: {
                  clipPath: 'inset(20% 100% 80% 0% round 10px)',
                  opacity: 0,
                  transition: {
                    type: 'spring',
                    bounce: 0,
                    duration: 0.3,
                  },
                },
              }}
              className="absolute -right-[90px] top-0 bg-black text-white border rounded-xl p-2 w-20 text-[12px] z-10">
              <CopyButton value={chat.message}>
                {({ copied, copy }) => (
                  <mo.li
                    variants={itemVariants}
                    onClick={chat?.deleted_at ? () => {} : copy}
                    className={cn(
                      'rounded-lg py-1 px-2 cursor-pointer',
                      chat?.deleted_at
                        ? 'cursor-not-allowed text-gray-500'
                        : 'hover:bg-white hover:text-black'
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
                    ? 'cursor-not-allowed text-gray-500'
                    : 'hover:bg-white hover:text-black'
                )}>
                Reply
              </mo.li>
              <ModalDeleteMessage
                isChatFriend={true}
                id={chat.id}
                message={chat.message}
                time={chat.created_at}
                isRead={chat.isRead}
                isHide={chat.isHide}
                deleted_at={chat.deleted_at}>
                <mo.li
                  variants={itemVariants}
                  className="rounded-lg py-1 px-2 cursor-pointer hover:bg-white hover:text-black">
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
          </div>
        </div>
      </div>
    </mo.div>
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
