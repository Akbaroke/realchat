import TabTop, { DataTabsType } from '@/components/templates/Tab';
import { BsThreeDotsVertical } from 'react-icons/bs';
import PersonalView from '@/components/views/PersonalView';
import GrupView from '@/components/views/GrupView';

export default function Home() {
  return (
    <div>
      <div className="flex items-center justify-between p-5">
        <h1 className="font-medium">RealChat</h1>
        <BsThreeDotsVertical size={16} />
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
