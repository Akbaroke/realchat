import TimeDisplay from '../TimeDisplay';
import { BsCheckAll, BsCheck, BsThreeDotsVertical } from 'react-icons/bs';
import { GrFormEdit } from 'react-icons/gr';
import { Variants, motion as mo } from 'framer-motion';
import { useState } from 'react';
import { useClickOutside, useHover } from '@mantine/hooks';
import { DataChats, OpenAiDataType } from '@/hooks/useSnapshotChats';
import ModalEditMessage from '@/components/organisms/ModalEditMessage';
import hideShowMessage from '@/services/hideShowMessage';
import ModalDeleteMessage from '@/components/organisms/ModalDeleteMessage';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import isDeletedMe from '@/utils/isDeletedMe';
import cn from '@/utils/cn';
import { CopyButton } from '@mantine/core';
import { Image } from 'primereact/image';
import { MdOutlineDoNotDisturbAlt } from 'react-icons/md';
import downloadImage from '@/utils/downloadImage';
import getDateTime from '@/utils/getDateTime';
import { BLACK_OPENAI } from '@/assets';
import { LazyLoadImage } from 'react-lazy-load-image-component';

type Props = {
  chat: DataChats;
};

export default function RightChat({ chat }: Props) {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [isMessageHide, setIsMessageHide] = useState(chat.isHide);
  const clickRef = useClickOutside(() => setIsOpen(false));
  const { hovered, ref } = useHover();

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

  const openaiData = chat?.content?.data as OpenAiDataType;

  return (
    !isDeletedMe({
      deletedUs_userid: chat?.isDeletedUs || [],
      user_id: user?.id || '',
    }) && (
      <mo.div initial={false} animate={isOpen ? 'open' : 'closed'}>
        <div className="flex flex-col gap-1 items-end mb-4" ref={ref}>
          <mo.div className="relative" ref={clickRef}>
            <div className="rounded-xl bg-black sm:max-w-[300px] max-w-[220px]">
              <mo.div
                animate={{ opacity: hovered ? 1 : 0 }}
                className="absolute -left-5 top-4 text-black cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}>
                <BsThreeDotsVertical
                  size={16}
                  className="active:scale-50 transition-all duration-300"
                />
              </mo.div>

              {!chat?.deleted_at ? (
                <>
                  <div
                    className={cn(
                      'px-3 pt-3',
                      !chat.content && 'hidden',
                      chat.content?.type === 'openai' && !chat.message && 'pb-3'
                    )}>
                    {!isMessageHide && chat.content?.type === 'picture' && (
                      <div className={cn(chat.message ? 'pb-0' : 'pb-2')}>
                        <Image
                          src={chat.content.data as string}
                          alt="image"
                          width="300"
                          className="rounded-lg overflow-hidden"
                          preview
                        />
                      </div>
                    )}
                    {!isMessageHide && chat.content?.type === 'openai' && (
                      <div className="p-3 rounded-lg flex flex-col gap-4 relative text-white bg-gray-900">
                        <div className="absolute -right-1 -top-1 bg-white w-10 h-10 grid place-items-center p-1 rounded-full">
                          <LazyLoadImage
                            alt="foto"
                            effect="blur"
                            src={BLACK_OPENAI}
                            width={30}
                            height={30}
                          />
                        </div>
                        <div>
                          <h1 className="italic text-gray-500 text-[14px]">
                            Question ~
                          </h1>
                          <p className="break-words whitespace-pre-line text-[14px] font-medium leading-6">
                            {openaiData.question}
                          </p>
                        </div>
                        <div>
                          <h1 className="italic text-gray-500 text-[14px]">
                            Result ~
                          </h1>
                          <p className="break-words whitespace-pre-line text-[14px] font-medium leading-6">
                            {openaiData.result}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  {chat.message && (
                    <p
                      className={cn(
                        'text-white sm:max-w-[300px] max-w-[250px] break-words whitespace-pre-line inline-block text-[14px]',
                        chat.message
                          ? chat.content?.type === 'picture'
                            ? isMessageHide
                              ? 'p-3'
                              : 'px-3 pb-3'
                            : 'p-3'
                          : ''
                      )}>
                      {isMessageHide ? '•••••' : chat.message}
                    </p>
                  )}
                  {chat.message === '' && chat.content && isMessageHide && (
                    <p className="text-white text-[14px] p-3">•••••</p>
                  )}
                </>
              ) : (
                <p className="font-light p-3 text-gray-300 italic inline-flex gap-1 items-center sm:text-[14px] text-[12px]">
                  <MdOutlineDoNotDisturbAlt size={18} />
                  Message has been deleted
                </p>
              )}
            </div>
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
              className={cn(
                'absolute top-0 bg-white text-black border rounded-xl p-2  text-[12px] z-10',
                chat?.content?.type === 'picture'
                  ? 'w-max -left-[100px]'
                  : 'w-20 -left-[90px]'
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
                          ? 'cursor-not-allowed text-gray-300'
                          : 'hover:bg-black hover:text-white'
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
                      ? 'cursor-not-allowed text-gray-300'
                      : 'hover:bg-black hover:text-white'
                  )}>
                  Download
                </mo.li>
              )}
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
              {chat.message !== '' && (
                <ModalEditMessage
                  isDisabled={isEditeble() || !!(chat?.deleted_at || false)}
                  chat={chat}>
                  <mo.li
                    variants={itemVariants}
                    className={cn(
                      'rounded-lg py-1 px-2 cursor-pointer',
                      isEditeble() || !!(chat?.deleted_at || false)
                        ? 'cursor-not-allowed text-gray-300'
                        : 'hover:bg-black hover:text-white'
                    )}>
                    Edit
                  </mo.li>
                </ModalEditMessage>
              )}
              <ModalDeleteMessage chat={chat}>
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
