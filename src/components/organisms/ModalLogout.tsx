import { Modal, useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { motion } from 'framer-motion';
import { RxCross2 } from 'react-icons/rx';
import Button from '../atoms/Button';
import { HiOutlineLogout } from 'react-icons/hi';
import { signOut } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { toastLoading, toastSuccess } from '../atoms/Toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/slices/authSlice';

type Props = {
  children: React.ReactNode;
};

export default function ModalLogout({ children }: Props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();

  const handleLogout = async () => {
    toastLoading('Logout process...', 'logout');
    await signOut(auth);
    navigate('/signin');
    dispatch(logout());
    toastSuccess('Logout Success', 'logout');
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
                  <p className="font-medium">Logout</p>
                </div>
                <div className="p-5 flex flex-col gap-5 text-center">
                  <div className="w-16 h-16 rounded-full grid place-items-center bg-red-600 shadow-lg m-auto">
                    <HiOutlineLogout size={30} className="text-white ml-1" />
                  </div>
                  <p className="font-medium text-[14px]">
                    Are you sure you want to go out?{' '}
                  </p>
                </div>
                <div className="flex gap-4 p-5 px-7 items-center justify-center">
                  <Button variant="outline" onClick={close}>
                    Cancel
                  </Button>
                  <Button onClick={handleLogout}>Yes, Logout</Button>
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
