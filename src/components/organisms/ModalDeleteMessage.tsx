import { Loader, LoadingOverlay, Modal, useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { motion } from 'framer-motion';
import TimeDisplay from '../atoms/TimeDisplay';
import { BsCheck, BsCheckAll } from 'react-icons/bs';
import { useState } from 'react';
import deleteMessage, { DeletedType } from '@/services/deleteMessage';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { DataChats } from '@/hooks/useSnapshotChats';
import { MdOutlineDoNotDisturbAlt } from 'react-icons/md';
import { Image } from 'primereact/image';
import cn from '@/utils/cn';
import { DEFAULT_FOTO } from '@/assets';
import { RxCross2 } from 'react-icons/rx';
import { toastLoading, toastSuccess } from '../atoms/Toast';

type Props = {
  chat: DataChats;
  isChatFriend?: boolean;
  children: React.ReactNode;
};

export default function ModalDeleteMessage({
  isChatFriend,
  children,
  chat,
}: Props) {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();

  const isDeleteble = (): boolean => {
    const chatCreatedAt = chat.created_at;
    const currentTimeSeconds = Math.floor(new Date().getTime() / 1000.0);
    const threeDayInSeconds = 3 * 24 * 60 * 60; // 3 hari dalam detik
    const waktuEditeble = chatCreatedAt + threeDayInSeconds;

    return currentTimeSeconds > waktuEditeble;
  };

  const MessagePreview = () =>
    isChatFriend ? (
      <div className="flex items-end gap-2 mb-4 w-full">
        <img
          alt="foto"
          src={chat.foto || DEFAULT_FOTO}
          width={30}
          height={30}
          className="rounded-lg h-max relative bottom-2 bg-gray-200"
        />
        <div className="flex flex-col gap-1">
          <div className="text-[14px] border rounded-xl bg-white w-max relative sm:max-w-[300px] max-w-[250px]">
            <div className="rounded-xl sm:max-w-[300px] max-w-[220px]">
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
          </div>
          <div className="flex items-center gap-1">
            <TimeDisplay
              time={chat.created_at}
              className="text-[12px] text-gray-400"
              isTimeOnly={true}
            />
          </div>
        </div>
      </div>
    ) : (
      <div className="flex flex-col gap-1 items-end mb-4">
        <div className="rounded-xl bg-black sm:max-w-[300px] max-w-[220px]">
          {!chat?.deleted_at ? (
            <>
              <>
                {!chat.isHide && chat.content?.type === 'picture' && (
                  <div className={cn('p-2', chat.message ? 'pb-0' : 'pb-1')}>
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
                    'text-white sm:max-w-[300px] max-w-[250px] break-words whitespace-pre-line inline-block text-[14px]',
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
        <div className="flex items-center gap-1">
          <TimeDisplay
            time={chat.created_at}
            className="text-[12px] text-gray-400"
            isTimeOnly={true}
          />
          {chat.isRead ? <BsCheckAll size={16} /> : <BsCheck size={16} />}
        </div>
      </div>
    );

  const handleDeleteMessage = (deletedType: DeletedType) => {
    setIsLoading(true);
    toastLoading('Delete process...', 'delete-' + chat.id);
    deleteMessage({
      personal_id: chat.personal_id,
      message_id: chat.id,
      user_id: user?.id || '',
      type: deletedType,
      withImage: chat.content?.type === 'picture' ? true : false,
    })
      .then(() => {
        toastSuccess('Deleted successful', 'delete-' + chat.id);
      })
      .catch(() => {
        toastSuccess('Deleted failed', 'delete-' + chat.id);
      })
      .finally(() => {
        setIsLoading(false);
        close();
      });
  };

  return (
    <>
      <Modal.Root
        opened={opened}
        onClose={close}
        className="w-max"
        size="100%"
        centered>
        <Modal.Overlay color={theme.colors.dark[9]} opacity={0.3} blur={7} />
        <Modal.Content
          bg="#00000000"
          className="shadow-none p-0 grid place-content-center"
          opacity={0.3}>
          <Modal.Body className="p-0">
            <motion.div
              initial={false}
              animate={{
                scale: opened ? 1 : 0,
                transition: {
                  duration: 0.3,
                },
              }}>
              <div className="bg-white rounded-lg min-w-[300px]">
                <div className="px-5 py-4 flex gap-4 items-center border-b">
                  <div
                    className="p-2 rounded-md border w-max text-gray-500 cursor-pointer hover:text-black transition-all"
                    onClick={close}>
                    <RxCross2 size={16} />
                  </div>
                  <p className="font-medium">Delete Message ?</p>
                </div>
                <div className="p-5">
                  <MessagePreview />
                </div>
                <div className="h-max border-t flex gap-2 p-5 flex-col items-end relative text-[14px] [&>p]:cursor-pointer hover:[&>p]:underline font-medium text-red-600 last:[&>p]:text-black">
                  <LoadingOverlay
                    visible={isLoading}
                    overlayBlur={2}
                    loader={<Loader color="dark" size="xs" variant="oval" />}
                  />
                  {!isChatFriend && !(isDeleteble() || chat.deleted_at) && (
                    <p onClick={() => handleDeleteMessage('everyone')}>
                      Delete for everyone
                    </p>
                  )}

                  <p onClick={() => handleDeleteMessage('me')}>Delete for me</p>
                  <p onClick={close}>Cancel</p>
                </div>
              </div>
            </motion.div>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>

      <div onClick={open} className="cursor-pointer">
        {children}
      </div>
    </>
  );
}
