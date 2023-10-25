import { useState } from 'react';
import { motion as mo } from 'framer-motion';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { GrFormEdit } from 'react-icons/gr';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useSelector } from 'react-redux';
import { DEFAULT_FOTO } from '@/assets';
import { DataChats } from '@/hooks/useSnapshotChats';
import { RootState } from '@/store';
import cn from '@/utils/cn';
import isDeletedMe from '@/utils/isDeletedMe';
import {
  useClickOutside,
  useElementSize,
  useHover,
  useViewportSize,
} from '@mantine/hooks';
import CopyButtonChat from '../atoms/chat/CopyButtonChat';
import DeleteButtonChat from '../atoms/chat/DeleteButtonChat';
import DeletedChat from '../atoms/chat/DeletedChat';
import DownloadButtonChat from '../atoms/chat/DownloadButtonChat';
import ImageChat from '../atoms/chat/ImageChat';
import MessageChat from '../atoms/chat/MessageChat';
import OpenAiChat from '../atoms/chat/OpenAiChat';
import ReplyButtonChat from '../atoms/chat/ReplyButtonChat';
import ReplyChat from '../atoms/chat/ReplyChat';
import TimeDisplay from '../atoms/TimeDisplay';
import {
  itemVariants,
  listVariantFromLefttoRight,
  listVariantFromRighttoLeft,
} from '@/utils/VariantsMotion';

type Props = {
  chat: DataChats;
  scrollToChat: (chat_id: string) => void;
};

export default function CardLeftChat({ chat, scrollToChat }: Props) {
  const { hovered, ref } = useHover();
  const [isOpen, setIsOpen] = useState(false);
  const [isSett, setIsSett] = useState(false);
  const settRef = useClickOutside(() => setIsSett(false));
  const clickRef = useClickOutside(() => setIsOpen(false));
  const { user } = useSelector((state: RootState) => state.auth);
  const elementSize = useElementSize();
  const viewportSize = useViewportSize();

  const isCardOverFlow = elementSize.width > 200 && viewportSize.width <= 380;

  const isCopy = (): boolean => {
    return (
      !(chat.content?.type === 'picture' && chat?.message === '') &&
      !chat.isHide &&
      !chat.deleted_at
    );
  };

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
        <div className="flex items-end gap-2 w-full" ref={ref}>
          <LazyLoadImage
            alt="foto"
            effect="blur"
            src={chat.foto || DEFAULT_FOTO}
            referrerPolicy="no-referrer"
            width={30}
            height={30}
            className="rounded-lg h-max relative bottom-2 bg-gray-200"
          />
          <div className="flex flex-col gap-1">
            <div
              className="text-[14px] border rounded-xl bg-white w-max relative"
              ref={clickRef}>
              <div
                ref={elementSize.ref}
                className={cn(
                  'rounded-xl sm:max-w-[300px] max-w-[250px]',
                  chat?.content?.type === 'picture' &&
                    !chat?.reply?.id &&
                    !chat.message &&
                    !chat.isHide
                    ? 'px-2 pb-[1px]'
                    : 'p-2'
                )}>
                <mo.div
                  animate={{ opacity: isSett || hovered ? 1 : 0 }}
                  className="absolute -right-5 top-4 text-black cursor-pointer"
                  onClick={() => setIsOpen(!isOpen)}>
                  <BsThreeDotsVertical
                    size={16}
                    className="active:scale-50 transition-all duration-300"
                  />
                </mo.div>

                {!chat?.deleted_at ? (
                  !chat?.isHide ? (
                    <>
                      {chat?.reply?.id && (
                        <ReplyChat
                          chat={chat}
                          scrollToChat={scrollToChat}
                          varian="left"
                        />
                      )}

                      {chat.content && (
                        <div
                          className={cn(
                            chat?.reply?.id ??
                              !!(
                                chat.content.type === 'picture' &&
                                !chat?.message
                              )
                              ? 'pt-2'
                              : ''
                          )}>
                          {chat.content.type === 'picture' && (
                            <ImageChat chat={chat} />
                          )}
                          {chat.content.type === 'openai' && (
                            <OpenAiChat chat={chat} varian="left" />
                          )}
                        </div>
                      )}

                      {chat.message && (
                        <MessageChat chat={chat} varian="left" />
                      )}
                    </>
                  ) : (
                    <p className="text-black text-[14px] pb-[1px]">•••••</p>
                  )
                ) : (
                  <DeletedChat />
                )}
              </div>

              <mo.ul
                onClick={() => setIsOpen(false)}
                variants={
                  isCardOverFlow
                    ? listVariantFromLefttoRight
                    : listVariantFromRighttoLeft
                }
                className={cn(
                  'absolute -right-[90px] top-0 bg-black text-white border rounded-xl p-2 text-[12px] z-10',
                  chat?.content?.type === 'picture'
                    ? 'w-max -right-[100px]'
                    : 'w-20 -right-[90px]',
                  {
                    '-right-4': isCardOverFlow,
                  }
                )}>
                {isCopy() && (
                  <CopyButtonChat
                    chat={chat}
                    itemVariants={itemVariants}
                    varian="left"
                  />
                )}
                {!chat.isHide && (
                  <>
                    {chat?.content?.type === 'picture' && (
                      <DownloadButtonChat
                        chat={chat}
                        itemVariants={itemVariants}
                        varian="left"
                      />
                    )}
                    <ReplyButtonChat
                      chat={chat}
                      itemVariants={itemVariants}
                      varian="left"
                    />
                  </>
                )}
                <DeleteButtonChat
                  chat={chat}
                  itemVariants={itemVariants}
                  varian="left"
                />
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
