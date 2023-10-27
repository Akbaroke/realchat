import TabTop, { DataTabsType } from '@/components/templates/Tab';
import { BsThreeDotsVertical } from 'react-icons/bs';
import PersonalView from '@/components/views/PersonalView';
import GrupView from '@/components/views/GrupView';
import { Link } from 'react-router-dom';
import LinkNewChat from '@/components/atoms/LinkNewChat';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { resetPersonal } from '@/store/slices/personalSlice';
import { LOGOTEXT_REALCHAT } from '../assets';
import { resetReply } from '@/store/slices/replySlice';
import { resetOpenai } from '@/store/slices/openaiSlice';

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetPersonal());
    dispatch(resetReply());
    dispatch(resetOpenai());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-full">
      <div className="flex items-center justify-between p-5">
        <img
          src={LOGOTEXT_REALCHAT}
          alt="RealChat"
          width={100}
          className="cursor-pointer"
          onClick={() => window.location.reload()}
        />
        <div className="flex items-center gap-5">
          <LinkNewChat />
          <Link to="/profile">
            <BsThreeDotsVertical size={18} />
          </Link>
        </div>
      </div>
      <TabTop dataTabs={dataTabs} />
    </div>
  );
}

const dataTabs: DataTabsType[] = [
  {
    value: 'personal',
    title: 'Personal',
    content: <PersonalView />,
  },
  {
    value: 'grup',
    title: 'Grup',
    content: <GrupView />,
  },
];
