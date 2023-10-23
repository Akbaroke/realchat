import {
  ICON_FIREBASE,
  ICON_GITHUB,
  ICON_REACT,
  ICON_REDUX,
  ICON_TAILWIND,
  ICON_TYPESCRIPT,
  LOGO_REALCHAT,
} from '@/assets';
import { FiChevronLeft } from 'react-icons/fi';
import { GiCheckMark } from 'react-icons/gi';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import getDataRepository, {
  RepositoryDetail,
} from '@/services/getDataRepository';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { AiFillGithub, AiFillStar } from 'react-icons/ai';
import { BiGitRepoForked } from 'react-icons/bi';
import { PiUsersBold } from 'react-icons/pi';
import { Loader } from '@mantine/core';

export default function About() {
  const navigate = useNavigate();
  const [repositoryDetail, setRepositoryDetail] = useState<RepositoryDetail>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getDataRepository(
      aboutContent.repository.ownerName,
      aboutContent.repository.repositoryName
    ).then((res) => {
      setRepositoryDetail(res);
      setIsLoading(false);
    });
  }, []);

  return (
    <div>
      <div className="flex items-center px-5 py-3 border-b sticky top-0 gap-5 bg-white z-20">
        <div
          className="p-2 rounded-md border w-max text-gray-500 cursor-pointer hover:text-black transition-all"
          onClick={() => navigate('/profile')}>
          <FiChevronLeft size={16} />
        </div>
        <h1 className="font-semibold">About</h1>
      </div>
      <div className="flex flex-col gap-10 p-5">
        <img
          src={LOGO_REALCHAT}
          alt="realchat"
          className="w-36 h-36 shadow-xl rounded-full m-auto"
        />
        <div className="flex flex-col gap-2">
          <h1 className="font-semibold inline-block py-1 pr-8 border-b-2 border-black w-max">
            Introduction
          </h1>
          <p className="text-[14px] text-gray-600">
            {aboutContent.intoduction}
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="font-semibold inline-block py-1 pr-8 border-b-2 border-black w-max">
            Tech stack
          </h1>
          <div className="flex flex-wrap gap-2">
            {aboutContent.techStack.map((tech, index) => (
              <motion.div
                initial={{ opacity: 0, transform: 'translateX(50px)' }}
                animate={{ opacity: 1, transform: 'translateX(0px)' }}
                transition={{ delay: index * 0.3, duration: 0.3 }}
                key={index}>
                <div className="flex items-center gap-2 p-2 px-3 border rounded-md w-max">
                  <img
                    src={tech.icon}
                    alt="tech stack"
                    className="w-5 h-5 rounded-sm"
                  />
                  <p className="text-[14px] text-gray-600">{tech.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="font-semibold inline-block py-1 pr-8 border-b-2 border-black w-max">
            Features
          </h1>
          <div className="flex flex-wrap gap-3">
            {aboutContent.features.flatMap((feat, index) => (
              <motion.div
                initial={{ opacity: 0, transform: 'translateX(50px)' }}
                animate={{ opacity: 1, transform: 'translateX(0px)' }}
                transition={{ delay: index * 0.3, duration: 0.3 }}
                key={index}>
                <div className="flex gap-3">
                  <GiCheckMark className="inline-block mt-1" size={14} />
                  <p className="text-[14px] text-gray-600 flex-1">{feat}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="font-semibold inline-block py-1 pr-8 border-b-2 border-black w-max">
            Repository
          </h1>
          <Link
            to={aboutContent?.repository.url}
            target="_blank"
            className="flex flex-col gap-10 p-5 border rounded-lg w-max shadow-md hover:shadow-none transition-all duration-300 min-w-[150px] min-h-[80px]">
            {isLoading ? (
              <Loader
                color="gray"
                variant="oval"
                size="sm"
                className="m-auto h-[20px]"
              />
            ) : (
              <>
                <div className="flex justify-between items-center gap-5">
                  <div className="flex flex-col gap-2 items-start justify-center">
                    <h1 className="text-black/80 text-[18px] font-medium">
                      {repositoryDetail?.owner.login}/
                      <b>{repositoryDetail?.name}</b>
                    </h1>
                    <p className="text-gray-400 font-medium text-[11px]">
                      {repositoryDetail?.description}
                    </p>
                  </div>
                  <LazyLoadImage
                    alt="foto"
                    effect="blur"
                    width={60}
                    height={60}
                    src={repositoryDetail?.owner.avatar_url}
                    referrerPolicy="no-referrer"
                    className="rounded-lg flex-1"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex flex-wrap gap-5">
                    <div className="flex items-center gap-1">
                      <AiFillStar size={18} className="text-yellow-500" />
                      <p className="font-medium text-gray-800 text-[12px]">
                        {repositoryDetail?.stargazers_count}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <BiGitRepoForked size={16} className="text-gray-800" />
                      <p className="font-medium text-gray-800 text-[12px]">
                        {repositoryDetail?.forks_count}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <PiUsersBold size={16} className="text-gray-800" />
                      <p className="font-medium text-gray-800 text-[12px]">
                        {repositoryDetail?.subscribers_count}
                      </p>
                    </div>
                  </div>
                  <AiFillGithub size={20} className="text-gray-500" />
                </div>
              </>
            )}
          </Link>
        </div>
      </div>
      <div className="py-10 pt-20 grid place-items-center">
        <p className="font-medium text-gray-400 text-[14px]">
          v{aboutContent.version}
        </p>
      </div>
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
  features: [
    'Users can login and register using a google account account or use a new account.',
    'User can change profile details such as name and bio.',
    'Users can start a chat by searching for the name and email of the destination user.',
    'Users can send and receive messages in real time.',
    'Users can view the status of messages that have been read or not.',
    'Users can send images in chat messages.',
    'Users can ask questions about anything with open ai.',
    'Users can copy, download images, hide, edit, delete privately or all users, and can reply to messages.',
    'Users can submit, edit, and delete ratings on the application, can see all rating lists from other users.',
    'Users can log out of their account',
  ],
  repository: {
    url: 'https://github.com/Akbaroke/realchat',
    title: 'Github',
    ownerName: 'Akbaroke',
    repositoryName: 'realchat',
    icon: ICON_GITHUB,
  },
  version: '1.0.0',
};
