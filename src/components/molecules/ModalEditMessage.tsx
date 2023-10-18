import { Loader, Modal, useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { motion } from 'framer-motion';
import TimeDisplay from '../atoms/TimeDisplay';
import { BsCheck, BsCheckAll } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import InputChat from '../atoms/InputChat';
import cn from '@/utils/cn';
import { RxCross2 } from 'react-icons/rx';
import updateMessage from '@/services/updateMessage';
import { DataChats } from '@/hooks/useSnapshotChats';
import { MdOutlineDoNotDisturbAlt } from 'react-icons/md';
import { Image } from 'primereact/image';

type Props = {
  chat: DataChats
  children: React.ReactNode;
  isDisabled?: boolean;
};

export default function ModalEditMessage({
  chat,
  children,
  isDisabled,
}: Props) {
  const [textChat, setTextChat] = useState(chat.message);
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [isChanged, setIsChanged] = useState(false);
  const theme = useMantineTheme();

  useEffect(() => {
    if (textChat.trim() !== chat.message && textChat.trim() !== '') {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [chat.message, textChat]);

  const MessagePreview = () => (
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

  const handleUpdateMessage = () => {
    setIsLoadingBtn(true);
    updateMessage(chat.id, textChat).finally(() => {
      setIsLoadingBtn(false);
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
                  <p className="font-medium">Edit Message</p>
                </div>
                <div className="p-5">
                  <MessagePreview />
                </div>
                <div className="h-max border-t flex gap-1 p-5">
                  <InputChat
                    value={textChat}
                    onChange={(e) => setTextChat(e.target.value)}
                    className="flex-1"
                  />
                  <button
                    className={cn('font-semibold cursor-pointer text-[14px]', {
                      'cursor-not-allowed': isLoadingBtn || !isChanged,
                      'text-gray-500': !isChanged,
                    })}
                    disabled={isLoadingBtn || !isChanged || isDisabled}
                    onClick={handleUpdateMessage}>
                    {isLoadingBtn ? (
                      <Loader color="dark" size="xs" variant="oval" />
                    ) : (
                      'Update'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>

      <div onClick={isDisabled ? () => null : open} className="cursor-pointer">
        {children}
      </div>
    </>
  );
}
