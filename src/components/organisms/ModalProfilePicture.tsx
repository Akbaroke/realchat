import { Loader, Modal, useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { DEFAULT_FOTO } from '@/assets';

type Props = {
  imgSrc?: string;
  children: React.ReactNode;
};

export default function ModalProfilePicture({
  imgSrc = DEFAULT_FOTO,
  children,
}: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const theme = useMantineTheme();

  return (
    <>
      <Modal.Root
        opened={opened}
        onClose={close}
        className="w-max"
        size="50%"
        centered>
        <Modal.Overlay color={theme.colors.dark[9]} opacity={0.3} blur={7} />
        <Modal.Content
          bg="#00000000"
          className="rounded-full shadow-none p-0 grid place-content-center"
          opacity={0.3}>
          <Modal.Body className="p-0">
            {!isLoaded && (
              <Loader
                color="dark"
                variant="bars"
                size="sm"
                className="m-auto"
              />
            )}
            <motion.div
              initial={false}
              animate={{
                scale: opened ? 1 : 0,
                transition: {
                  duration: 0.3,
                },
              }}>
              <img
                src={imgSrc}
                referrerPolicy="no-referrer"
                alt="foto"
                className="rounded-full w-96 shadow-md"
                onLoad={() => setIsLoaded(true)}
              />
            </motion.div>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>

      <div onClick={open} className="cursor-pointer grid place-items-center">
        {children}
      </div>
    </>
  );
}
