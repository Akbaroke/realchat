import { Loader, LoadingOverlay, Modal, useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { motion } from 'framer-motion';
import TimeDisplay from '../atoms/TimeDisplay';
import { BsCheck, BsCheckAll } from 'react-icons/bs';
import { useState } from 'react';
import { FiChevronLeft } from 'react-icons/fi';
import deleteMessage, { DeletedType } from '@/services/deleteMessage';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

type Props = {
  personal_id: string;
  id: string;
  message: string;
  time: number;
  isRead: boolean;
  children: React.ReactNode;
  deleted_at: number;
  isChatFriend?: boolean;
  isHide: boolean;
};

export default function ModalDeleteMessage({
  personal_id,
  id,
  children,
  message,
  time,
  isRead,
  deleted_at,
  isChatFriend,
  isHide,
}: Props) {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();

  const isDeleteble = (): boolean => {
    const chatCreatedAt = time;
    const currentTimeSeconds = Math.floor(new Date().getTime() / 1000.0);
    const threeDayInSeconds = 3 * 24 * 60 * 60; // 3 hari dalam detik
    const waktuEditeble = chatCreatedAt + threeDayInSeconds;

    return currentTimeSeconds > waktuEditeble;
  };

  const MessagePreview = () =>
    isChatFriend ? (
      <div className="flex flex-col gap-1">
        <div className="p-3 text-[14px] border rounded-xl bg-white w-max relative cursor-pointer">
          <p className="whitespace-pre-line sm:max-w-[300px] max-w-[250px] break-words">
            {!deleted_at ? (
              isHide ? (
                '•••••'
              ) : (
                message
              )
            ) : (
              <i className="font-light">Message has been deleted</i>
            )}
          </p>
        </div>
      </div>
    ) : (
      <div className="flex flex-col gap-1 items-end mb-4">
        <div className="relative">
          <p className="whitespace-pre-line inline-block p-3 text-[14px] rounded-xl bg-black text-white cursor-pointer sm:max-w-[300px] max-w-[200px] break-words">
            {message}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <TimeDisplay
            time={time}
            className="text-[12px] text-gray-400"
            isTimeOnly={true}
          />
          {isRead ? <BsCheckAll size={16} /> : <BsCheck size={16} />}
        </div>
      </div>
    );

  const handleDeleteMessage = (deletedType: DeletedType) => {
    setIsLoading(true);
    deleteMessage({
      personal_id: personal_id,
      message_id: id,
      user_id: user?.id || '',
      type: deletedType,
    }).finally(() => {
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
                    <FiChevronLeft size={16} />
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
                  {!isChatFriend && !(isDeleteble() || deleted_at) && (
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
