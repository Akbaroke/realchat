import { useNavigate, useParams } from 'react-router-dom';
import { FiChevronLeft, FiRefreshCcw } from 'react-icons/fi';
import { BiCodeAlt } from 'react-icons/bi';
import { HiOutlineTrash } from 'react-icons/hi';
import { RiOpenaiFill } from 'react-icons/ri';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Loader, LoadingOverlay, ScrollArea } from '@mantine/core';
import InputChat from '@/components/atoms/InputChat';
import { useEffect, useRef, useState } from 'react';
import Button from '@/components/atoms/Button';
import TooltipComp from '@/components/atoms/TooltipComp';
import BallonChat from '@/components/atoms/chat/BallonChat';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import useSnapshotChats, { Content } from '@/hooks/useSnapshotChats';
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
import ModalGenerateOpenAi from '@/components/organisms/ModalGenerateOpenAi';
import { resetOpenai } from '@/store/slices/openaiSlice';
import checkValidatePersonal from '@/services/checkValidatePersonal';

export default function Personal() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [textChat, setTextChat] = useState('');
  const [fried, setFriend] = useState<UserType>();
  const { user } = useSelector((state: RootState) => state.auth);
  const openaiContent = useSelector((state: RootState) => state.openai);
  const viewport = useRef<HTMLDivElement>(null);
  const { chatsRealtime, isLoading } = useSnapshotChats(id || '');
  const dataFriend = chatsRealtime?.find((val) => val.user_id !== user?.id);
  const personal = useSelector((state: RootState) => state.personal);
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const [image, setImage] = useState<ImageType | null>(null);
  const openRef = useRef<VoidFunction>(() => {});
  const [content, setContent] = useState<Content | null>(null);

  useEffect(() => {
    if (user?.id && id) {
      checkValidatePersonal(user?.id, id).then((res) => {
        if (!res) {
          navigate('/', { replace: true });
        }
      });
    }
  }, [id, navigate, user?.id]);

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
        type: 'openai',
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
    viewport?.current?.scrollTo({
      top: viewport.current.scrollHeight,
      behavior: 'smooth',
    });
    if (chatsRealtime && user?.id) {
      updateReadChat(chatsRealtime, user?.id || '');
    }
  }, [chatsRealtime, personal, user?.id]);

  // Mengambil timestamp untuk hari ini
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = today.getTime();

  // Mendefinisikan fungsi untuk membandingkan tanggal pesan chat
  const isSameDay = (timestamp1: number, timestamp2: number): boolean => {
    const date1 = new Date(timestamp1);
    const date2 = new Date(timestamp2);
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Mengurutkan pesan chat berdasarkan tanggal terbaru
  const sortedMessages =
    chatsRealtime?.sort((a, b) => a.created_at - b.created_at) || [];

  // Memisahkan pesan chat berdasarkan tanggal
  const messagesByDay: Record<number, typeof sortedMessages> = {};
  sortedMessages.forEach((message) => {
    const timestamp = message.created_at;
    const messageDay = new Date(timestamp * 1000.0);
    messageDay.setHours(0, 0, 0, 0);
    const messageDayTimestamp = messageDay.getTime();
    if (!messagesByDay[messageDayTimestamp]) {
      messagesByDay[messageDayTimestamp] = [];
    }
    messagesByDay[messageDayTimestamp].push(message);
  });

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

    if (chatsRealtime?.length === 0) {
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
    };
    const data2: DataMessage = {
      id: chat_id,
      personal_id: id || '',
      user_id: user?.id || '',
      message: textChat,
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
  };

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
              <h1 className="font-medium whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[150px]">
                {dataFriend?.name || personal.name || fried?.name}
              </h1>
              <p className="whitespace-nowrap text-[12px] overflow-hidden overflow-ellipsis max-w-[160px] sm:max-w-[200px]">
                {dataFriend?.bio}
              </p>
            </div>
          </div>
        </div>
        <BsThreeDotsVertical size={16} />
      </div>
      <ScrollArea
        type="scroll"
        scrollbarSize={6}
        offsetScrollbars
        className="flex-1 px-5 [&>div>div>div:first-child]:pt-5 h-max"
        viewportRef={viewport}>
        {Object.entries(messagesByDay).map(([timestamp, messages]) => {
          const messageDay = new Date(Number(timestamp));
          const isToday = isSameDay(todayTimestamp, Number(timestamp));
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
                <BallonChat
                  varian={message.user_id === user?.id ? 'right' : 'left'}
                  key={index}
                  chat={message}
                />
              ))}
            </div>
          );
        })}
        {isLoading && (
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
            <TooltipComp label="Coding">
              <Button
                variant="outline"
                className="w-max"
                isDisabled={
                  (content?.type !== 'coding' && !!content?.type) ||
                  isLoadingBtn
                }>
                <BiCodeAlt size={20} />
              </Button>
            </TooltipComp>
            <TooltipComp label="OpenAi">
              <ModalGenerateOpenAi>
                <Button
                  variant="outline"
                  className="w-max"
                  isDisabled={
                    (content?.type !== 'openai' && !!content?.type) ||
                    isLoadingBtn
                  }>
                  <RiOpenaiFill size={20} />
                </Button>
              </ModalGenerateOpenAi>
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
