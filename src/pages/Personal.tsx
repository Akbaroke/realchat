import { useNavigate, useParams } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';
import { LuImage } from 'react-icons/lu';
import { BiCodeAlt } from 'react-icons/bi';
import { RiOpenaiFill } from 'react-icons/ri';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Loader, ScrollArea } from '@mantine/core';
import InputChat from '@/components/atoms/InputChat';
import { useEffect, useRef, useState } from 'react';
import Button from '@/components/atoms/Button';
import TooltipComp from '@/components/atoms/TooltipComp';
import BallonChat from '@/components/atoms/chat/BallonChat';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import useSnapshotChats from '@/hooks/useSnapshotChats';
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
import ModalProfilePicture from '@/components/molecules/ModalProfilePicture';
import { DEFAULT_FOTO } from '@/assets';

export default function Personal() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [textChat, setTextChat] = useState('');
  const [fried, setFriend] = useState<UserType>();
  const { user } = useSelector((state: RootState) => state.auth);
  const viewport = useRef<HTMLDivElement>(null);
  const { chatsRealtime, isLoading } = useSnapshotChats(id || '');
  const dataFriend = chatsRealtime?.find((val) => val.user_id !== user?.id);
  const personal = useSelector((state: RootState) => state.personal);
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);

  useEffect(() => {
    if (!!dataFriend || personal.name === '') {
      getFriend(id || '', user?.id || '').then((res) => setFriend(res));
    }
  }, [dataFriend, id, personal, user?.id]);

  useEffect(() => {
    viewport?.current?.scrollTo({
      top: viewport.current.scrollHeight,
      behavior: 'smooth',
    });
    if (chatsRealtime && user?.id) {
      updateReadChat(chatsRealtime, user?.id || '');
    }
  }, [chatsRealtime, personal, user?.id]);

  const handleSendMessage = () => {
    const chat_id = uuidv4();
    if (textChat.trim() === '') {
      return;
    }
    if (chatsRealtime?.length === 0) {
      const dataPersonal: DataNewPersonal = {
        lastMessage: doc(firestore, 'chats', chat_id),
        personal_id: id || '',
        users_id: [user?.id || '', fried?.id || personal.user_id || ''],
      };
      createPersonal(dataPersonal);
    }
    setIsLoadingBtn(true);
    const data: DataMessage = {
      id: chat_id,
      personal_id: id || '',
      user_id: user?.id || '',
      message: textChat,
    };
    setTextChat('');
    sendMessage(data).finally(() => {
      setIsLoadingBtn(false);
    });
  };

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

  return (
    <div className="h-screen flex flex-col justify-between">
      <div className="flex justify-between items-center p-5 border-b">
        <div className="flex items-center gap-5">
          <div
            className="p-2 rounded-md border w-max text-gray-500 cursor-pointer hover:text-black transition-all"
            onClick={() => navigate('/')}>
            <FiChevronLeft size={16} />
          </div>
          <div className="flex items-center gap-2">
            <ModalProfilePicture imgSrc={foto}>
              <LazyLoadImage
                alt="foto"
                effect="blur"
                src={foto}
                width={30}
                height={30}
                className="rounded-lg"
              />
            </ModalProfilePicture>
            <h1 className="font-medium pb-1">
              {dataFriend?.name || personal.name || fried?.name}
            </h1>
          </div>
        </div>
        <BsThreeDotsVertical size={16} />
      </div>
      <ScrollArea
        className="flex-1 px-5 [&>div>div>div:first-child]:pt-5"
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
          <Loader color="dark" size="sm" variant="dots" className="m-auto" />
        )}
      </ScrollArea>
      <div className="h-max border-t flex flex-col gap-6 p-5">
        <InputChat
          value={textChat}
          onChange={(e) => setTextChat(e.target.value)}
        />
        <div className="flex justify-between">
          <div className="flex gap-3">
            <TooltipComp label="Picture">
              <Button variant="outline" className="w-max">
                <LuImage size={20} />
              </Button>
            </TooltipComp>
            <TooltipComp label="Coding">
              <Button variant="outline" className="w-max">
                <BiCodeAlt size={20} />
              </Button>
            </TooltipComp>
            <TooltipComp label="OpenAi">
              <Button variant="outline" className="w-max">
                <RiOpenaiFill size={20} />
              </Button>
            </TooltipComp>
          </div>
          <button
            className={cn('font-semibold cursor-pointer', {
              'cursor-not-allowed': isLoadingBtn,
              'text-gray-500': textChat.trim() === '',
            })}
            disabled={isLoadingBtn}
            onClick={handleSendMessage}>
            {isLoadingBtn ? (
              <Loader color="dark" size="xs" variant="oval" />
            ) : (
              'Send'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
