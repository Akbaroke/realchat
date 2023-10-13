import { useNavigate, useParams } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';
import { LuImage } from 'react-icons/lu';
import { BiCodeAlt } from 'react-icons/bi';
import { RiOpenaiFill } from 'react-icons/ri';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { ScrollArea } from '@mantine/core';
import InputChat from '@/components/atoms/InputChat';
import { useEffect, useRef, useState } from 'react';
import Button from '@/components/atoms/Button';
import TooltipComp from '@/components/atoms/TooltipComp';
import BallonChat from '@/components/atoms/chat/BallonChat';

export interface DataChats {
  id: string;
  user_id: string;
  message: string;
  content?: {
    type: 'picture' | 'coding' | 'openai';
    data: File | string;
  };
  foto?: string;
  isRead: boolean;
  isHide: boolean;
  isEdit: boolean;
  deleted_at: number;
  updated_at: number;
  created_at: number;
}

const dummyChats: DataChats[] = [
  {
    id: '1',
    user_id: '1',
    message: 'Hello!',
    foto: 'https://picsum.photos/200?random=1',
    isRead: true,
    isHide: false,
    isEdit: false,
    deleted_at: 0,
    updated_at: 1696744212,
    created_at: 1696744212,
  },
  {
    id: '2',
    user_id: '2',
    message: 'hai!',
    foto: 'https://picsum.photos/200?random=2',
    isRead: true,
    isHide: false,
    isEdit: false,
    deleted_at: 0,
    updated_at: 1696744212,
    created_at: 1696744212,
  },
  {
    id: '3',
    user_id: '1',
    message: 'hhahaa!',
    foto: 'https://picsum.photos/200?random=1',
    isRead: true,
    isHide: false,
    isEdit: false,
    deleted_at: 0,
    updated_at: 1696744212,
    created_at: 1696744212,
  },
  {
    id: '4',
    user_id: '2',
    message: 'oke!',
    foto: 'https://picsum.photos/200?random=1',
    isRead: false,
    isHide: false,
    isEdit: false,
    deleted_at: 0,
    updated_at: 1696837330,
    created_at: 1696837330,
  },
];

export default function Personal() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [textChat, setTextChat] = useState('');
  const [dataChats, setDataChats] = useState<DataChats[]>(dummyChats);
  const USER_ID = '2';
  const viewport = useRef<HTMLDivElement>(null);

  useEffect(() => {
    viewport?.current?.scrollTo({
      top: viewport.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [dataChats]);

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
            <img
              src="https://picsum.photos/200?random=1"
              alt=""
              width={30}
              height={30}
              className="rounded-lg"
            />
            <h1 className="font-medium">Udin</h1>
          </div>
        </div>
        <BsThreeDotsVertical size={16} />
      </div>
      <ScrollArea
        className="flex-1 px-5 [&>div>div>div:first-child]:pt-5"
        viewportRef={viewport}>
        {dataChats.map((chat, index) => (
          <BallonChat
            varian={chat.user_id === USER_ID ? 'right' : 'left'}
            key={index}
            chat={chat}
          />
        ))}
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
          <button className="font-semibold cursor-pointer">Send</button>
        </div>
      </div>
    </div>
  );
}
