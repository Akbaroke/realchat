import { useNavigate, useParams } from 'react-router-dom';
import { FiChevronLeft, FiRefreshCcw } from 'react-icons/fi';
import { HiOutlineTrash } from 'react-icons/hi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Loader, LoadingOverlay, ScrollArea } from '@mantine/core';
import InputChat from '@/components/atoms/InputChat';
import React, { useEffect, useRef, useState } from 'react';
import Button from '@/components/atoms/Button';
import TooltipComp from '@/components/atoms/TooltipComp';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import useSnapshotChats, { Content, DataChats } from '@/hooks/useSnapshotChats';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import updateReadChat from '@/services/updateReadChat';
import sendMessage, { DataMessage } from '@/services/sendMessage';
import cn from '@/utils/cn';
import createPersonal, { DataNewPersonal } from '@/services/createPersonal';
import { doc } from 'firebase/firestore';
import { firestore } from '@/config/firebase';
import { v4 as uuidv4 } from 'uuid';
import getFriend from '@/services/getFriend';
import { UserType } from '@/store/slices/authSlice';
import ModalProfilePicture from '@/components/organisms/ModalProfilePicture';
import { DEFAULT_FOTO } from '@/assets';
import ButtonInputImage, {
  ImageType,
} from '@/components/atoms/ButtonInputImage';
import { Image } from 'primereact/image';
import uploadImage from '@/services/uploadImage';
import ModalGenerateAI from '@/components/organisms/ModalGenerateAI';
import { resetOpenai } from '@/store/slices/openaiSlice';
import checkValidatePersonal from '@/services/checkValidatePersonal';
import { resetReply } from '@/store/slices/replySlice';
import { LuImage } from 'react-icons/lu';
import { RiRobot2Line } from 'react-icons/ri';
import CardLeftChat from '@/components/molecules/CardLeftChat';
import CardRightChat from '@/components/molecules/CardRightChat';
import sortMessageByDate, {
  isSameDay,
  todayTimestamp,
} from '@/utils/sortMessageByDate';
import detectUrls from '@/utils/detectUrls';
import useLinkPreview from '@/hooks/useLinkPreview';
import LinkPreview from '@/components/molecules/LinkPreview';

export default function Personal() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [textChat, setTextChat] = useState('');
  const [fried, setFriend] = useState<UserType>();
  const { user } = useSelector((state: RootState) => state.auth);
  const reply = useSelector((state: RootState) => state.reply);
  const openaiContent = useSelector((state: RootState) => state.generateAI);
  const viewport = useRef<HTMLDivElement>(null);
  const { chatsRealtime, isLoading } = useSnapshotChats(id || '');
  const dataFriend = chatsRealtime?.find((val) => val.user_id !== user?.id);
  const personal = useSelector((state: RootState) => state.personal);
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const [image, setImage] = useState<ImageType | null>(null);
  const openRef = useRef<VoidFunction>(() => {});
  const [content, setContent] = useState<Content | null>(null);
  const [chatFocus, setChatFocus] = useState<string>('');
  const [oldChatsData, setOldChatsData] = useState<DataChats[]>([]);
  const [urlPreview, setUrlPreview] = useState('')
  const linkPreviewResult = useLinkPreview(urlPreview);

  useEffect(() => {
    return () => {
      dispatch(resetOpenai());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fineUrl = detectUrls(textChat)
    if(fineUrl.length !== 0){
      console.log(fineUrl)
      setUrlPreview(fineUrl[0])
    }else {
      setUrlPreview('')
    }

  }, [textChat])

  useEffect(() => {
    if (personal.personal_id === '') {
      if (user?.id && id) {
        checkValidatePersonal(user?.id, id).then((res) => {
          if (!res) {
            navigate('/', { replace: true });
          }
        });
      }
    }
  }, [id, navigate, personal.personal_id, user?.id]);

  useEffect(() => {
    if (!!dataFriend || personal.name === '') {
      getFriend(id || '', user?.id || '').then((res) => setFriend(res));
    }
  }, [dataFriend, id, personal, user?.id]);

  useEffect(() => {
    if (image) {
      setContent({
        type: 'picture',
        data: image.imageFile,
      });
    } else {
      setContent(null);
    }
  }, [image]);

  useEffect(() => {
    if (openaiContent.result !== '') {
      setContent({
        type: 'generateAI',
        data: {
          question: openaiContent.question,
          result: openaiContent.result,
        },
      });
    } else {
      setContent(null);
    }
  }, [openaiContent]);

  useEffect(() => {
    if (
      chatsRealtime &&
      user?.id &&
      chatsRealtime.length !== oldChatsData.length
    ) {
      viewport?.current?.scrollTo({
        top: viewport.current.scrollHeight,
        behavior: 'smooth',
      });
      updateReadChat(chatsRealtime, user?.id || '');
      setOldChatsData(chatsRealtime);
    }
  }, [chatsRealtime, oldChatsData.length, user?.id]);

  const foto = dataFriend?.foto || personal.foto || fried?.foto || DEFAULT_FOTO;
  const isDisableSend =
    isLoadingBtn || textChat.trim() === ''
      ? content
        ? false
        : true
      : false || isLoading;

  const handleSendMessage = async () => {
    const chat_id = uuidv4();
    let imgUrl = '';
    if (isDisableSend) {
      return;
    }
    setIsLoadingBtn(true);

    if (content?.type === 'picture') {
      imgUrl = await uploadImage(
        `personal/${id}/${chat_id}.jpg`,
        image?.imageFile as File
      );
    }

    if (chatsRealtime?.length === 0 && personal.personal_id !== '') {
      const dataPersonal: DataNewPersonal = {
        lastMessage: doc(firestore, 'chats', chat_id),
        personal_id: id || '',
        users_id: [user?.id || '', fried?.id || personal.user_id || ''],
      };
      createPersonal(dataPersonal);
    }
    const data1: DataMessage = {
      id: chat_id,
      personal_id: id || '',
      user_id: user?.id || '',
      message: textChat,
      reply: reply.chat?.id || '',
    };
    const data2: DataMessage = {
      id: chat_id,
      personal_id: id || '',
      user_id: user?.id || '',
      message: textChat,
      reply: reply.chat?.id || '',
      content: content
        ? {
            type: content?.type,
            data: content?.type === 'picture' ? imgUrl : content?.data,
          }
        : undefined,
    };
    sendMessage(content ? data2 : data1).finally(() => {
      setIsLoadingBtn(false);
    });
    setTextChat('');
    setImage(null);
    dispatch(resetOpenai());
    dispatch(resetReply());
  };

  const scrollToChat = (chatId: string) => {
    setChatFocus(chatId);
    const chatElement = document.getElementById(`chat-${chatId}`);

    if (chatElement) {
      viewport?.current?.scrollTo({
        top: chatElement.offsetTop,
        behavior: 'smooth',
      });
    }

    setTimeout(() => {
      setChatFocus('');
    }, 3000);
  };

  const messagesByDay = sortMessageByDate(chatsRealtime);

  return (
    <div className="h-screen flex flex-col justify-between">
      <div className="flex justify-between items-center p-5 border-b bg-white">
        <div className="flex items-center gap-5">
          <div
            className="p-2 rounded-md border w-max text-gray-500 cursor-pointer hover:text-black transition-all"
            onClick={() => navigate('/')}>
            <FiChevronLeft size={16} />
          </div>
          <div className="flex items-center gap-3">
            <ModalProfilePicture imgSrc={foto || DEFAULT_FOTO}>
              <LazyLoadImage
                alt="foto"
                effect="blur"
                src={foto || DEFAULT_FOTO}
                referrerPolicy="no-referrer"
                width={30}
                height={30}
                className="rounded-lg bg-gray-200"
              />
            </ModalProfilePicture>
            <div className="flex flex-col">
              <h1 className="font-medium line-clamp-1">
                {dataFriend?.name || personal.name || fried?.name}
              </h1>
              <p className="text-[12px] line-clamp-1">
                {dataFriend?.bio}
              </p>
            </div>
          </div>
        </div>
        <BsThreeDotsVertical size={16} className="hidden" />
      </div>
      <ScrollArea
        type="scroll"
        scrollbarSize={6}
        className="flex-1 [&>div>div>div:first-child]:pt-5 h-max"
        viewportRef={viewport}>
        {Object.entries(messagesByDay).map(([timestamp, messages]) => {
          const messageDay = new Date(Number(timestamp));
          const isToday = isSameDay(todayTimestamp(), Number(timestamp));
          const dateText = isToday
            ? 'Today'
            : messageDay.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              });
          return (
            <div key={timestamp}>
              <div className="py-5">
                <div className="flex justify-center gap-4 items-center px-[25px]">
                  <span className="w-full h-[1px] rounded-sm bg-[#BCBCBC]/50"></span>
                  <p className="text-[12px] text-[#bcbcbc] whitespace-nowrap">
                    {dateText}
                  </p>
                  <span className="w-full h-[1px] rounded-sm bg-[#BCBCBC]/50"></span>
                </div>
              </div>
              {messages.map((message, index) => (
                <div
                  key={index}
                  id={`chat-${message.id}`}
                  className={cn('py-4 px-5', {
                    'bg-gray-100': chatFocus === message.id,
                  })}>
                  {message.user_id !== user?.id ? (
                    <CardLeftChat chat={message} scrollToChat={scrollToChat} />
                  ) : (
                    <CardRightChat chat={message} scrollToChat={scrollToChat} />
                  )}
                </div>
              ))}
            </div>
          );
        })}
        {isLoading && chatsRealtime.length === 0 && (
          <Loader
            color="dark"
            size="sm"
            variant="dots"
            className="my-10 m-auto"
          />
        )}
      </ScrollArea>
      <div className="h-max border-t flex flex-col gap-6 p-5 bg-white">
        <div className="flex flex-col gap-6 relative">
          <LoadingOverlay
            visible={isLoadingBtn}
            overlayBlur={2}
            loader={<Loader color="dark" size="xs" variant="oval" />}
          />
          {reply.chat && (
            <div
              className="p-4 rounded-lg border border-gray-200 bg-white/50 flex flex-col gap-4 relative z-10 backdrop-blur-md cursor-pointer hover:shadow-md transition-all duration-300"
              onClick={() => scrollToChat(reply.chat?.id || '')}>
              <div
                className="absolute -right-3 -top-3"
                onClick={(e: React.SyntheticEvent) => {
                  e.stopPropagation();
                  dispatch(resetReply());
                }}>
                <TooltipComp label="Delete">
                  <Button variant="outline" className="w-max text-red-600">
                    <HiOutlineTrash size={20} />
                  </Button>
                </TooltipComp>
              </div>
              <div className="flex items-center gap-3">
                {reply.chat?.content?.type === 'picture' && (
                  <LazyLoadImage
                    alt="foto"
                    effect="blur"
                    width={50}
                    height={50}
                    src={reply.chat.content?.data as string}
                    className="rounded-lg bg-gray-200 h-full object-cover shadow-md"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div>
                  <h1 className="text-[15px] font-medium">
                    {reply.chat.user_id === user?.id ? 'You' : reply.chat.name}
                  </h1>
                  <div className="flex items-center justify-start w-full gap-1 text-gray-500">
                    {reply.chat?.content?.type === 'picture' && (
                      <LuImage size={13} />
                    )}
                    {reply.chat?.content?.type === 'generateAI' && (
                      <RiRobot2Line size={13} />
                    )}
                    <p
                      className={cn(
                        'whitespace-nowrap text-[12px] overflow-hidden overflow-ellipsis sm:max-w-[150px] max-w-[120px] max-h-[50px]',
                        {
                          capitalize:
                            !reply.chat.message && reply.chat?.content,
                        }
                      )}>
                      {!reply.chat.message && reply.chat?.content
                        ? reply.chat?.content?.type
                        : reply.chat.message}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {openaiContent.result && (
            <div className="p-5 rounded-lg border border-gray-200 bg-white/50 flex flex-col gap-4 relative z-10 backdrop-blur-md">
              <div className="absolute -right-3 -top-3">
                <TooltipComp label="Delete">
                  <Button
                    variant="outline"
                    className="w-max text-red-600"
                    onClick={() => dispatch(resetOpenai())}>
                    <HiOutlineTrash size={20} />
                  </Button>
                </TooltipComp>
              </div>
              <div>
                <h1 className="italic text-gray-500 text-[14px]">Question ~</h1>
                <p className="break-words whitespace-pre-line text-[14px] font-medium leading-6">
                  {openaiContent.question}
                </p>
              </div>
              <div>
                <h1 className="italic text-gray-500 text-[14px]">Result ~</h1>
                <p className="break-words whitespace-pre-line text-[14px] font-medium leading-6">
                  {openaiContent.result}
                </p>
              </div>
            </div>
          )}
          {image && (
            <div className="flex items-start gap-2">
              <Image
                src={image?.imageBlob}
                alt="image"
                className="w-[150px] max-h-[200px] rounded-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105"
                preview
              />
              <div className="flex flex-col gap-2">
                <TooltipComp label="Delete">
                  <Button
                    variant="outline"
                    className="w-max text-red-600"
                    onClick={() => setImage(null)}>
                    <HiOutlineTrash size={20} />
                  </Button>
                </TooltipComp>
                <TooltipComp label="Change">
                  <Button
                    variant="outline"
                    className="w-max"
                    onClick={() => openRef.current()}>
                    <FiRefreshCcw size={20} />
                  </Button>
                </TooltipComp>
              </div>
            </div>
          )}
          {!!(linkPreviewResult.data && urlPreview) && <LinkPreview data={linkPreviewResult.data} type='center' isLoading={linkPreviewResult.loading} />}
          <InputChat
            value={textChat}
            onChange={(e) => setTextChat(e.target.value)}
          />
        </div>
        <div className="flex justify-between">
          <div className="flex gap-3">
            <TooltipComp label="Picture">
              <ButtonInputImage
                setImage={setImage}
                openRef={openRef as unknown as VoidFunction}
                isDisabled={
                  (content?.type !== 'picture' && !!content?.type) ||
                  isLoadingBtn
                }
              />
            </TooltipComp>
            <TooltipComp label="Generative AI">
              <ModalGenerateAI>
                <Button
                  variant="outline"
                  className="w-max"
                  isDisabled={
                    (content?.type !== 'generateAI' && !!content?.type) ||
                    isLoadingBtn
                  }>
                  <RiRobot2Line size={20} />
                </Button>
              </ModalGenerateAI>
            </TooltipComp>
          </div>
          <button
            className={cn('font-semibold cursor-pointer', {
              'text-gray-500 cursor-not-allowed': isDisableSend,
            })}
            disabled={isDisableSend}
            onClick={handleSendMessage}>
            {isLoadingBtn ? 'Sending..' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
