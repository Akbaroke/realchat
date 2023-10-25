import { Modal, Rating, Textarea, useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { motion } from 'framer-motion';
import { RxCross2 } from 'react-icons/rx';
import Button from '../atoms/Button';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import ModalProfilePicture from './ModalProfilePicture';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { DEFAULT_FOTO } from '@/assets';
import axios from 'axios';
import { toastError, toastSuccess } from '../atoms/Toast';
import { Review, fetchReviews } from '@/store/slices/reviewSlice';

type Props = {
  review?: Review;
  userId?: string;
  children: React.ReactNode;
};

export default function ModalRateApplication({ review, children }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [opened, { open, close }] = useDisclosure(false);
  const [rateValue, setRateValue] = useState<number>(review ? review.rate : 0);
  const [commentValue, setCommentValue] = useState<string>(
    review ? review.comment : ''
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isReadOnly, setIsReadOnly] = useState<boolean>(false);
  const theme = useMantineTheme();

  useEffect(() => {
    if (review?.user_id !== user?.id) {
      setIsReadOnly(true);
    }
    if (!review) {
      setIsReadOnly(false);
    }
  }, [review, user?.id]);

  const handleSendRate = async () => {
    setIsLoading(true);
    try {
      await axios.post(import.meta.env.VITE_APP_RATING_ENDPOINT, {
        user_id: user?.id,
        name: user?.name,
        email: user?.email,
        foto: user?.foto,
        rate: rateValue,
        comment: commentValue,
        datetime: Math.floor(new Date().getTime() / 1000.0),
      });
      dispatch(fetchReviews());
      toastSuccess('Thank you for giving a rating', 'rate');
      close();
    } catch (error) {
      console.log(error);
      toastError('Rate failed', 'rate');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRate = async () => {
    setIsLoading(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_APP_RATING_ENDPOINT}/${review?.id}`,
        {
          user_id: user?.id,
          name: user?.name,
          email: user?.email,
          foto: user?.foto,
          rate: rateValue,
          comment: commentValue,
          datetime: Math.floor(new Date().getTime() / 1000.0),
        }
      );
      dispatch(fetchReviews());
      toastSuccess('Updating rate succesful', 'rate');
      close();
    } catch (error) {
      console.log(error);
      toastError('Updating rate failed', 'rate');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRate = async () => {
    setIsLoading(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_APP_RATING_ENDPOINT}/${review?.id}`
      );
      dispatch(fetchReviews());
      toastSuccess('Deleting rate succesful', 'rate');
      close();
    } catch (error) {
      console.log(error);
      toastError('Deleting rate failed', 'rate');
    } finally {
      setIsLoading(false);
    }
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
                  <p className="font-medium">Rate</p>
                </div>
                <div className="p-5 flex flex-col gap-5 text-center">
                  <div className="flex flex-col gap-3">
                    <ModalProfilePicture
                      imgSrc={
                        review
                          ? review.foto || DEFAULT_FOTO
                          : user?.foto || DEFAULT_FOTO
                      }>
                      <LazyLoadImage
                        alt="foto"
                        effect="blur"
                        src={
                          review
                            ? review.foto || DEFAULT_FOTO
                            : user?.foto || DEFAULT_FOTO
                        }
                        className="w-16 h-16 rounded-full bg-gray-200"
                      />
                    </ModalProfilePicture>
                    <div className="flex flex-col gap-1 flex-1">
                      <h1 className="font-bold text-[16px]">
                        {review ? review.name : user?.name}
                      </h1>
                      <p className="text-gray-500 text-[12px] font-medium">
                        {review ? review.email : user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Rating
                      value={rateValue}
                      onChange={setRateValue}
                      readOnly={isReadOnly}
                      size="lg"
                    />
                    <Textarea
                      placeholder="Your comment"
                      variant="unstyled"
                      className="border rounded-lg px-3"
                      minRows={4}
                      maxRows={4}
                      maxLength={80}
                      value={commentValue}
                      onChange={(e) => setCommentValue(e.target.value)}
                      readOnly={isReadOnly}
                    />
                  </div>
                </div>
                <div className="flex gap-4 pb-7 px-7 items-center justify-center">
                  {!isReadOnly && review && (
                    <Button
                      variant="outline"
                      isLoading={isLoading}
                      isDisabled={rateValue === 0 || commentValue.trim() === ''}
                      onClick={handleDeleteRate}
                      className="w-max px-5">
                      Delete
                    </Button>
                  )}
                  {!isReadOnly && (
                    <Button
                      isLoading={isLoading}
                      isDisabled={rateValue === 0 || commentValue.trim() === ''}
                      onClick={review ? handleUpdateRate : handleSendRate}
                      className="w-max px-5">
                      {review ? 'Update' : 'Send'}
                    </Button>
                  )}
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
