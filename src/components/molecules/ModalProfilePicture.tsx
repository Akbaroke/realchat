import { Loader, Modal, useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { motion } from 'framer-motion';

type Props = {
  imgSrc?: string;
  children: React.ReactNode;
};

export default function ModalProfilePicture({
  imgSrc = 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg',
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
              <Loader color="dark" variant="bars" className="m-auto" />
            )}
            <motion.div
              initial={false}
              animate={{
                scale: opened ? 1 : 0,
                transition: {
                  duration: 0.3,
                },
              }}>
              {!isLoaded && (
                <Loader color="dark" variant="bars" className="m-auto" />
              )}
              <img
                src={imgSrc}
                alt="foto"
                className="rounded-full w-96 shadow-md"
                onLoad={() => setIsLoaded(true)}
              />
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
