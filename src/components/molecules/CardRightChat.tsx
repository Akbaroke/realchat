import { useEffect, useState } from 'react';
import { motion as mo } from 'framer-motion';
import { BsCheck, BsCheckAll, BsThreeDotsVertical } from 'react-icons/bs';
import { GrFormEdit } from 'react-icons/gr';
import { useSelector } from 'react-redux';
import { DataChats } from '@/hooks/useSnapshotChats';
import hideShowMessage from '@/services/hideShowMessage';
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
import EditButtonChat from '../atoms/chat/EditButtonChat';
import HideButtonChat from '../atoms/chat/HideButtonChat';
import ImageChat from '../atoms/chat/ImageChat';
import MessageChat from '../atoms/chat/MessageChat';
import GenerateAIChat from '../atoms/chat/GenerateAIChat';
import ReplyButtonChat from '../atoms/chat/ReplyButtonChat';
import ReplyChat from '../atoms/chat/ReplyChat';
import TimeDisplay from '../atoms/TimeDisplay';
import {
  itemVariants,
  listVariantFromLefttoRight,
  listVariantFromRighttoLeft,
} from '@/utils/VariantsMotion';
import useLinkPreview from '@/hooks/useLinkPreview';
import LinkPreview from './LinkPreview';
import detectUrls from '@/utils/detectUrls';

type Props = {
  chat: DataChats;
  scrollToChat: (chat_id: string) => void;
};

export default function CardRightChat({ chat, scrollToChat }: Props) {
  const { hovered, ref } = useHover();
  const [isOpen, setIsOpen] = useState(false);
  const clickRef = useClickOutside(() => setIsOpen(false));
  const { user } = useSelector((state: RootState) => state.auth);
  const [isMessageHide, setIsMessageHide] = useState(chat.isHide);
  const elementSize = useElementSize();
  const viewportSize = useViewportSize();
  const [urlPreview, setUrlPreview] = useState('')
  const linkPreviewResult = useLinkPreview(urlPreview);
  const isCardOverFlow = elementSize.width > 200 && viewportSize.width <= 380;

  useEffect(() => {
    const fineUrl = detectUrls(chat?.message)
    if(fineUrl.length !== 0){
      console.log(fineUrl)
      setUrlPreview(fineUrl[0])
    }else {
      setUrlPreview('')
    }

  }, [chat.message])

  const toggleHideShowMessage = () => {
    setIsMessageHide(!isMessageHide);
    hideShowMessage(chat.id, !isMessageHide);
  };

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
      <mo.div initial={false} animate={isOpen ? 'open' : 'closed'}>
        <div className="flex flex-col gap-1 items-end" ref={ref}>
          <mo.div className="relative" ref={clickRef}>
            <div
              ref={elementSize.ref}
              className={cn(
                'rounded-xl bg-black sm:max-w-[300px] max-w-[250px]',
                chat?.content?.type === 'picture' &&
                  !chat?.reply?.id &&
                  !chat.message &&
                  !isMessageHide
                  ? 'px-2 pb-[1px]'
                  : 'p-2'
              )}>
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
                !isMessageHide ? (
                  <>
                    {chat?.reply?.id && (
                      <ReplyChat
                        chat={chat}
                        scrollToChat={scrollToChat}
                        varian="right"
                      />
                    )}

                    {chat.content && (
                      <div
                        className={cn(
                          chat?.reply?.id ??
                            !!(
                              chat.content.type === 'picture' && !chat?.message
                            )
                            ? 'pt-2'
                            : ''
                        )}>
                        {chat.content.type === 'picture' && (
                          <ImageChat chat={chat} />
                        )}
                        {chat.content.type === 'generateAI' && (
                          <GenerateAIChat chat={chat} varian="right" />
                        )}
                      </div>
                    )}

                    {!!(linkPreviewResult.data && chat?.message) && <LinkPreview data={linkPreviewResult.data} type='right' isLoading={linkPreviewResult.loading} />}

                    {chat.message && <MessageChat chat={chat} varian="right" />}
                  </>
                ) : (
                  <p className="text-white text-[14px] pb-[1px]">•••••</p>
                )
              ) : (
                <DeletedChat />
              )}
            </div>
            <mo.ul
              onClick={() => setIsOpen(false)}
              variants={
                isCardOverFlow
                  ? listVariantFromRighttoLeft
                  : listVariantFromLefttoRight
              }
              className={cn(
                'absolute top-0 bg-white text-black border rounded-xl p-2 text-[12px] z-10',
                chat?.content?.type === 'picture'
                  ? 'w-max -left-[100px]'
                  : 'w-20 -left-[90px]',
                {
                  '-left-4': isCardOverFlow,
                }
              )}>
              {isCopy() && (
                <CopyButtonChat chat={chat} itemVariants={itemVariants} />
              )}
              {!chat.isHide && (
                <>
                  {chat?.content?.type === 'picture' && (
                    <DownloadButtonChat
                      chat={chat}
                      itemVariants={itemVariants}
                    />
                  )}
                  <ReplyButtonChat chat={chat} itemVariants={itemVariants} />
                </>
              )}
              <HideButtonChat
                chat={chat}
                itemVariants={itemVariants}
                toggleHideShowMessage={toggleHideShowMessage}
              />
              {chat.message && (
                <EditButtonChat chat={chat} itemVariants={itemVariants} />
              )}
              <DeleteButtonChat chat={chat} itemVariants={itemVariants} />
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
