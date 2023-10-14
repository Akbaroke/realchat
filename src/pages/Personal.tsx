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
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import useSnapshotChats from '@/hooks/useSnapshotChats';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import updateReadChat from '@/services/updateReadChat';

export default function Personal() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [textChat, setTextChat] = useState('');
  const { user } = useSelector((state: RootState) => state.auth);
  const viewport = useRef<HTMLDivElement>(null);
  const dataChats = useSnapshotChats(id || '');
  const dataFriend = dataChats?.find((val) => val.user_id !== user?.id);

  useEffect(() => {
    viewport?.current?.scrollTo({
      top: viewport.current.scrollHeight,
      behavior: 'smooth',
    });
    if (dataChats && user?.id) {
      updateReadChat(dataChats, user?.id || '');
    }
  }, [dataChats, user?.id]);

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
            <LazyLoadImage
              alt="foto"
              effect="blur"
              src={
                dataFriend?.foto ||
                'https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg'
              }
              width={30}
              height={30}
              className="rounded-lg"
            />
            <h1 className="font-medium">{dataFriend?.name}</h1>
          </div>
        </div>
        <BsThreeDotsVertical size={16} />
      </div>
      <ScrollArea
        className="flex-1 px-5 [&>div>div>div:first-child]:pt-5"
        viewportRef={viewport}>
        {dataChats?.map((chat, index) => (
          <BallonChat
            varian={chat.user_id === user?.id ? 'right' : 'left'}
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
