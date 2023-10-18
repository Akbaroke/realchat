import { LOGO_OPENAI } from '@/assets';
import {
  Loader,
  Modal,
  ScrollArea,
  Textarea,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure, useElementSize } from '@mantine/hooks';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { AiOutlineArrowUp } from 'react-icons/ai';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { TypeAnimation } from 'react-type-animation';
import openai from '@/config/openai';

type Props = {
  children: React.ReactNode;
};

export default function ModalGenerateOpenAi({ children }: Props) {
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
    if (inputValue.trim() === '') {
      return;
    }
    setIsLoading(true);
    setIsShowCard(true);
    const userQuestion = inputValue;
    setInputValue('');
    try {
      const response = await openai.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: userQuestion + ' berikan jawaban singkat hanya 50 kata',
          },
        ],
        model: 'gpt-3.5-turbo',
        max_tokens: 100,
      });
      setOpenAiData({
        question: userQuestion,
        result: response?.choices[0]?.message?.content as string,
      });
      setIsLoading(false);
      setIsLoadingTyping(true);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
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
              <div className="bg-white rounded-lg min-w-[300px] flex flex-col justify-between">
                <div className="px-5 py-4 flex gap-4 items-center border-b justify-between">
                  <div className="flex items-center gap-3">
                    <LazyLoadImage
                      alt="foto"
                      effect="blur"
                      src={LOGO_OPENAI}
                      width={30}
                      height={30}
                      className="rounded-lg bg-white"
                    />
                    <h1 className="font-medium whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[150px]">
                      Open Ai
                    </h1>
                    <div className="flex flex-col"></div>
                  </div>
                  <div
                    className="p-2 rounded-md border w-max text-gray-500 cursor-pointer hover:text-black transition-all"
                    onClick={close}>
                    <RxCross2 size={16} />
                  </div>
                </div>
                <ScrollArea
                  viewportRef={viewport}
                  type="scroll"
                  className="flex-1 h-max bg-black bg-opacity-10 flex flex-col justify-between">
                  <img
                    src={LOGO_OPENAI}
                    alt=""
                    className="filter grayscale blur-sm contrast-0 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2"
                  />
                  <div className="p-10 max-h-[300px] min-h-[200px] flex-1">
                    {isShowCard && (
                      <>
                        <div
                          className="p-5 rounded-lg border border-gray-200 bg-white/50 flex flex-col gap-4 relative z-10 backdrop-blur-md shadow-xl shadow-black/10"
                          ref={ref}>
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
                              <Loader color="dark" size="xs" variant="dots" />
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
                        </div>
                        <div className="h-10"></div>
                      </>
                    )}
                  </div>
                </ScrollArea>
                <div className="h-full border-t gap-3 px-5 pb-5 items-center bg-black bg-opacity-10">
                  <div className="flex bg-white rounded-2xl p-2 items-center">
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
                      className="p-3 bg-black text-white rounded-full w-max h-max"
                      onClick={handleQuestiontoOpenAi}>
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
