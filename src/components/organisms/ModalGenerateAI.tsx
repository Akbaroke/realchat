import {
  CopyButton,
  Loader,
  Modal,
  ScrollArea,
  Textarea,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure, useElementSize } from '@mantine/hooks';
import { Variants, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { AiOutlineArrowUp } from 'react-icons/ai';
import { TypeAnimation } from 'react-type-animation';
import { BsFillHeartPulseFill, BsThreeDotsVertical } from 'react-icons/bs';
import { RiRobot2Line } from 'react-icons/ri';
import { motion as mo } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenai } from '@/store/slices/openaiSlice';
import cn from '@/utils/cn';
import reduceLimitGenerateAI from '@/services/reduceLimitGenerateAI';
import { RootState } from '@/store';
import useSnapshotLimitOpenai from '@/hooks/useSnapshotLimitOpenai';
import { toastError } from '../atoms/Toast';
import requestGeminiai from '@/services/requestGeminiai';

type Props = {
  children: React.ReactNode;
};

export default function ModalGenerateAI({ children }: Props) {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const limitOpenai = useSnapshotLimitOpenai(user?.id || '');
  const [isLoadingTyping, setIsLoadingTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowCard, setIsShowCard] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [opened, { open, close }] = useDisclosure(false);
  const viewport = useRef<HTMLDivElement>(null);
  const { ref, height } = useElementSize();
  const [openAiData, setOpenAiData] = useState({
    question: '',
    result: '',
  });
  const theme = useMantineTheme();
  const [isOpen, setIsOpen] = useState(false);
  const disableBtn = limitOpenai > 0 ? false : true;

  useEffect(() => {
    if (isLoadingTyping) {
      viewport?.current?.scrollTo({
        top: viewport.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  });
  useEffect(() => {
    viewport?.current?.scrollTo({
      top: viewport.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [height]);

  useEffect(() => {
    if (!opened) {
      setOpenAiData({
        question: '',
        result: '',
      });
      setIsShowCard(false);
    }
  }, [opened]);

  const handleQuestiontoOpenAi = async () => {
    if (inputValue.trim() === '' || disableBtn) {
      return;
    }
    setIsLoading(true);
    setIsShowCard(true);
    const userQuestion = inputValue;
    setOpenAiData({
      question: userQuestion,
      result: '',
    });
    setInputValue('');
    try {
      const response = await requestGeminiai(userQuestion);
      await reduceLimitGenerateAI(user?.id || '');
      setOpenAiData({
        question: userQuestion,
        result: response.replace(/\*/g, ''),
      });
      setIsLoading(false);
      setIsLoadingTyping(true);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleForward = () => {
    dispatch(setOpenai(openAiData));
    close();
  };

  return (
    <>
      <Modal.Root
        opened={opened}
        onClose={() => {}}
        className="w-max"
        size="100%"
        centered>
        <Modal.Overlay color={theme.colors.dark[9]} opacity={0.3} blur={7} />
        <Modal.Content
          bg="#00000000"
          className="grid p-0 shadow-none place-content-center"
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
              <div className="bg-white rounded-lg min-w-[300px] max-w-[400px] flex flex-col justify-between">
                <div className="flex items-center justify-between gap-4 px-5 py-4 border-b">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      {/* <LazyLoadImage
                        alt="foto"
                        effect="blur"
                        src={BLACK_OPENAI}
                        width={30}
                        height={30}
                        className="bg-white rounded-lg"
                      /> */}
                      <RiRobot2Line />
                      <h1 className="font-medium whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[150px]">
                        Open Ai
                      </h1>
                    </div>
                    <div className="flex items-center gap-[3px] text-red-600">
                      <BsFillHeartPulseFill size={18} />
                      <p className="text-[16px] font-semibold">{limitOpenai}</p>
                    </div>
                  </div>
                  <div
                    className="p-2 text-gray-500 transition-all border rounded-md cursor-pointer w-max hover:text-black"
                    onClick={close}>
                    <RxCross2 size={16} />
                  </div>
                </div>
                <ScrollArea
                  viewportRef={viewport}
                  type="scroll"
                  className="flex flex-col justify-between flex-1 bg-black h-max bg-opacity-10">
                  {/* <img
                    src={BLACK_OPENAI}
                    alt=""
                    className="absolute w-1/2 transform -translate-x-1/2 -translate-y-1/2 filter grayscale blur-sm contrast-0 top-1/2 left-1/2"
                  /> */}
                  <RiRobot2Line />
                  <mo.div
                    className="p-8 max-h-[300px] min-h-[200px] flex-1"
                    ref={ref}
                    initial={false}
                    animate={isOpen ? 'open' : 'closed'}>
                    {isShowCard && (
                      <>
                        <div className="relative z-10 flex flex-col gap-4 p-5 border border-gray-200 rounded-lg shadow-xl bg-white/50 backdrop-blur-md shadow-black/10">
                          <mo.div
                            animate={{
                              opacity:
                                openAiData.result && !isLoadingTyping ? 1 : 0,
                            }}
                            className="absolute text-black cursor-pointer right-5 top-5"
                            onClick={() => setIsOpen(!isOpen)}>
                            <BsThreeDotsVertical
                              size={16}
                              className="transition-all duration-300 active:scale-50"
                            />
                          </mo.div>
                          <div>
                            <h1 className="italic text-gray-500 text-[14px]">
                              Question ~
                            </h1>
                            <p className="break-words whitespace-pre-line text-[14px] font-medium leading-6">
                              {openAiData.question}
                            </p>
                          </div>
                          <div>
                            <h1 className="italic text-gray-500 text-[14px]">
                              Result ~
                            </h1>
                            {isLoading ? (
                              <Loader
                                color="dark"
                                size="xs"
                                variant="dots"
                                className="mt-2"
                              />
                            ) : (
                              <TypeAnimation
                                sequence={[
                                  openAiData.result,
                                  () => setIsLoadingTyping(false),
                                  () => console.log('done'),
                                ]}
                                wrapper="p"
                                speed={50}
                                className="break-words whitespace-pre-line text-[14px] font-medium leading-6"
                                cursor={false}
                              />
                            )}
                          </div>
                          <mo.ul
                            onClick={() => setIsOpen(false)}
                            variants={{
                              open: {
                                clipPath: 'inset(0% 0% 0% 0% round 10px)',
                                transition: {
                                  type: 'spring',
                                  bounce: 0,
                                  delayChildren: 0.3,
                                  staggerChildren: 0.05,
                                },
                              },
                              closed: {
                                clipPath: 'inset(20% 0% 80% 100% round 10px)',
                                transition: {
                                  type: 'spring',
                                  bounce: 0,
                                  duration: 0.3,
                                },
                              },
                            }}
                            className="absolute top-5 right-10 bg-white text-black border rounded-xl p-2 w-22 text-[12px] z-10">
                            <CopyButton value={openAiData.result}>
                              {({ copied, copy }) => (
                                <mo.li
                                  variants={itemVariants}
                                  onClick={copy}
                                  className="px-2 py-1 rounded-lg cursor-pointer hover:bg-black hover:text-white">
                                  {copied ? 'Copied' : 'Copy'}
                                </mo.li>
                              )}
                            </CopyButton>
                            <mo.li
                              variants={itemVariants}
                              onClick={handleForward}
                              className="px-2 py-1 rounded-lg cursor-pointer hover:bg-black hover:text-white">
                              Forward
                            </mo.li>
                          </mo.ul>
                        </div>
                        <div className="h-10"></div>
                      </>
                    )}
                  </mo.div>
                </ScrollArea>
                <div className="items-center h-full gap-3 px-5 pb-5 bg-black border-t bg-opacity-10">
                  <div className="flex items-center p-2 bg-white rounded-2xl">
                    <Textarea
                      variant="unstyled"
                      placeholder="Type here.."
                      autosize
                      autoFocus
                      minRows={1}
                      maxRows={4}
                      maxLength={50}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="flex-1 px-3"
                    />
                    <button
                      className={cn(
                        'p-3 bg-black text-white rounded-full w-max h-max',
                        {
                          'cursor-not-allowed':
                            isLoading || isLoadingTyping || disableBtn,
                          'bg-gray-300': disableBtn,
                        }
                      )}
                      disabled={isLoading || isLoadingTyping}
                      onClick={
                        disableBtn
                          ? () => {
                              toastError(
                                'Openai limit has run out, try again tomorrow',
                                `generateAI-${new Date().getTime()}`
                              );
                            }
                          : handleQuestiontoOpenAi
                      }>
                      {isLoading || isLoadingTyping ? (
                        <Loader color="dark" size="xs" />
                      ) : (
                        <AiOutlineArrowUp />
                      )}
                    </button>
                  </div>
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

const itemVariants: Variants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
  closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
};
