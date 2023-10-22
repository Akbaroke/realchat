import {
  ICON_FIREBASE,
  ICON_GITHUB,
  ICON_REACT,
  ICON_REDUX,
  ICON_TAILWIND,
  ICON_TYPESCRIPT,
} from '@/assets';
import { FiChevronLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function About() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center px-5 py-3 border-b sticky top-0 gap-5">
        <div
          className="p-2 rounded-md border w-max text-gray-500 cursor-pointer hover:text-black transition-all"
          onClick={() => navigate('/profile')}>
          <FiChevronLeft size={16} />
        </div>
        <h1 className="font-semibold">About</h1>
      </div>
      <div></div>
    </div>
  );
}

const aboutContent = {
  intoduction:
    'Welcome to RealChat, a revolutionary platform to simplify communication between users. Equipped with AI technology, we offer a more engaging and interactive chat experience, creating a more satisfying user impression. Let`s discover a new way to communicate with RealChat!',
  techStack: [
    {
      title: 'React',
      icon: ICON_REACT,
    },
    {
      title: 'Tailwind CSS',
      icon: ICON_TAILWIND,
    },
    {
      title: 'Typescript',
      icon: ICON_TYPESCRIPT,
    },
    {
      title: 'Redux',
      icon: ICON_REDUX,
    },
    {
      title: 'Firebase',
      icon: ICON_FIREBASE,
    },
  ],
  features: '',
  repository: {
    url: 'https://github.com/Akbaroke/realchat',
    title: 'Github',
    icon: ICON_GITHUB,
  },
  developer: {
    name: 'Akbaroke',
    url: 'https://www.akbaroke.my.id',
  },
};
