import { Loader, Modal, useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { motion } from 'framer-motion';
import TimeDisplay from '../atoms/TimeDisplay';
import { BsCheck, BsCheckAll } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import InputChat from '../atoms/InputChat';
import cn from '@/utils/cn';
import { FiChevronLeft } from 'react-icons/fi';
import updateMessage from '@/services/updateMessage';

type Props = {
  id: string;
  message: string;
  time: number;
  isRead: boolean;
  children: React.ReactNode;
  isDisabled?: boolean;
};

export default function ModalEditMessage({
  id,
  children,
  message,
  time,
  isRead,
  isDisabled,
}: Props) {
  const [textChat, setTextChat] = useState(message);
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [isChanged, setIsChanged] = useState(false);
  const theme = useMantineTheme();

  useEffect(() => {
    if (textChat.trim() !== message && textChat.trim() !== '') {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [message, textChat]);

  const MessagePreview = () => (
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

  const handleUpdateMessage = () => {
    setIsLoadingBtn(true);
    updateMessage(id, textChat).finally(() => {
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
                    <FiChevronLeft size={16} />
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
