import TimeDisplay from '../TimeDisplay';
import { useState } from 'react';
import { useClickOutside, useHover } from '@mantine/hooks';
import { Variants, motion as mo } from 'framer-motion';
import { DataChats } from '@/hooks/useSnapshotChats';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { DEFAULT_FOTO } from '@/assets';
import { GrFormEdit } from 'react-icons/gr';
import { CopyButton } from '@mantine/core';
import cn from '@/utils/cn';
import ModalDeleteMessage from '@/components/molecules/ModalDeleteMessage';
import { MdOutlineDoNotDisturbAlt } from 'react-icons/md';
import isDeletedMe from '@/utils/isDeletedMe';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Image } from 'primereact/image';
import downloadImage from '@/utils/downloadImage';
import getDateTime from '@/utils/getDateTime';

type Props = {
  chat: DataChats;
};

export default function LeftChat({ chat }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const clickRef = useClickOutside(() => setIsOpen(false));
  const [isSett, setIsSett] = useState(false);
  const settRef = useClickOutside(() => setIsSett(false));
  const { hovered, ref } = useHover();

  return (
    !isDeletedMe({
      deletedUs_userid: chat?.isDeletedUs || [],
      user_id: user?.id || '',
    }) && (
      <mo.div
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        ref={settRef}
        onClick={() => setIsSett(!isOpen)}>
        <div className="flex items-end gap-2 mb-4 w-full" ref={ref}>
          <LazyLoadImage
            alt="foto"
            effect="blur"
            src={chat.foto || DEFAULT_FOTO}
            width={30}
            height={30}
            className="rounded-lg h-max relative bottom-2 bg-gray-200"
          />
          <div className="flex flex-col gap-1">
            <div
              className="text-[14px] border rounded-xl bg-white w-max relative"
              ref={clickRef}>
              <div className="rounded-xl sm:max-w-[300px] max-w-[220px]">
                <mo.div
                  animate={{ opacity: isSett || hovered ? 1 : 0 }}
                  whileTap={{ scale: 0.5 }}
                  className="absolute -right-5 top-4 text-black cursor-pointer"
                  onClick={() => setIsOpen(!isOpen)}>
                  <BsThreeDotsVertical size={16} />
                </mo.div>

                {!chat?.deleted_at ? (
                  <>
                    <>
                      {!chat.isHide && chat.content?.type === 'picture' && (
                        <div
                          className={cn('p-2', chat.message ? 'pb-0' : 'pb-1')}>
                          <Image
                            src={chat.content.data as string}
                            alt="image"
                            width="300"
                            className="rounded-lg overflow-hidden"
                            preview
                          />
                        </div>
                      )}
                    </>
                    {chat.message && (
                      <p
                        className={cn(
                          'text-black sm:max-w-[300px] max-w-[250px] break-words whitespace-pre-line inline-block text-[14px]',
                          chat.message
                            ? chat.content?.type === 'picture'
                              ? chat.isHide
                                ? 'p-3'
                                : 'px-3 pb-3'
                              : 'p-3'
                            : ''
                        )}>
                        {chat.isHide ? '•••••' : chat.message}
                      </p>
                    )}
                    {chat.message === '' && chat.content && chat.isHide && (
                      <p className="text-black text-[14px] p-3">•••••</p>
                    )}
                  </>
                ) : (
                  <p className="font-light text-gray-400 italic inline-flex gap-1 items-center sm:text-[14px] text-[12px] p-3">
                    <MdOutlineDoNotDisturbAlt size={18} />
                    Message has been deleted
                  </p>
                )}
              </div>
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
                className={cn(
                  'absolute -right-[90px] top-0 bg-black text-white border rounded-xl p-2 text-[12px] z-10',
                  chat?.content?.type
                    ? 'w-max -right-[100px]'
                    : 'w-20 -right-[90px]'
                )}>
                {chat.message !== '' && (
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
                )}
                {chat?.content?.type === 'picture' && (
                  <mo.li
                    variants={itemVariants}
                    onClick={() =>
                      downloadImage(
                        chat.content?.data as string,
                        `RealChat Image ${getDateTime()}.jpg`
                      )
                    }
                    className={cn(
                      'rounded-lg py-1 px-2 cursor-pointer',
                      chat?.deleted_at
                        ? 'cursor-not-allowed text-gray-500'
                        : 'hover:bg-white hover:text-black'
                    )}>
                    Download
                  </mo.li>
                )}
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
                  personal_id={chat.personal_id}
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
            </div>
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
