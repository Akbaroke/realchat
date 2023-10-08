import { useParams } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { ScrollArea } from '@mantine/core';
import InputChat from '@/components/atoms/InputChat';
import { useEffect, useState } from 'react';
import TimeDisplay from '@/components/atoms/TimeDisplay';

interface DataChats {
  id: string;
  user_id: string;
  message: string;
  image: string;
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
    image: 'https://picsum.photos/200?random=1',
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
    image: 'https://picsum.photos/200?random=2',
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
    image: 'https://picsum.photos/200?random=1',
    isRead: true,
    isHide: false,
    isEdit: false,
    deleted_at: 0,
    updated_at: 1696744212,
    created_at: 1696744212,
  },
];

export default function Personal() {
  const { id } = useParams();
  const [textChat, setTextChat] = useState('');
  const [dataChats, setDataChats] = useState<DataChats[]>(dummyChats);
  const USER_ID = '2';

  return (
    <div className="h-screen flex flex-col justify-between">
      <div className="flex justify-between items-center p-3 border-b">
        <div className="flex items-center gap-5">
          <div className="p-2 rounded-md border w-max text-gray-500">
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
      <ScrollArea className="flex-1 p-3">
        {dataChats.map((chat, index) =>
          chat.id === USER_ID ? (
            <div className="flex flex-col items-end gap-1" key={index}>
              <div className="p-2 rounded-xl bg-black text-white w-max">
                <p>{chat.message}</p>
              </div>
              <TimeDisplay
                time={chat.updated_at}
                className="text-[12px] text-gray-400"
              />
            </div>
          ) : (
            <div key={index} className="flex items-end gap-2">
              <img
                src={chat.image}
                alt=""
                width={30}
                height={30}
                className="rounded-lg h-max relative bottom-2"
              />
              <div className="flex flex-col gap-1">
                <div className="p-2 border rounded-xl w-max">
                  <p>{chat.message}</p>
                </div>
                <TimeDisplay
                  time={chat.updated_at}
                  className="text-[12px] text-gray-400"
                />
              </div>
            </div>
          )
        )}
      </ScrollArea>
      <div className="h-max p-3">
        <InputChat
          value={textChat}
          onChange={(e) => setTextChat(e.target.value)}
        />
      </div>
    </div>
  );
}
