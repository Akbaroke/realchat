import { DataChats } from '@/pages/Personal';
import TimeDisplay from '../TimeDisplay';
import { BsCheckAll, BsCheck } from 'react-icons/bs';
import { Variants, motion as mo } from 'framer-motion';
import { useState } from 'react';
import { useClickOutside } from '@mantine/hooks';

type Props = {
  chat: DataChats;
};

export default function RightChat({ chat }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMessageHide, setIsMessageHide] = useState(false);
  const ref = useClickOutside(() => setIsOpen(false));

  const toggleHideShowMessage = () => setIsMessageHide(!isMessageHide);

  return (
    <mo.div initial={false} animate={isOpen ? 'open' : 'closed'}>
      <div className="flex flex-col gap-1 items-end">
        <mo.div
          className="p-3 text-[14px] rounded-xl bg-black text-white w-max relative cursor-pointer"
          whileTap={{ scale: 0.9 }}
          ref={ref}
          onClick={() => setIsOpen(!isOpen)}>
          <p>{isMessageHide ? '•••••' : chat.message}</p>
          <mo.ul
            variants={{
              open: {
                clipPath: 'inset(0% 0% 0% 0% round 10px)',
                transition: {
                  type: 'spring',
                  bounce: 0,
                  delayChildren: 0.3,
                  staggerChildren: 0.05,
                },
              },
              closed: {
                clipPath: 'inset(20% 0% 80% 100% round 10px)',
                transition: {
                  type: 'spring',
                  bounce: 0,
                  duration: 0.3,
                },
              },
            }}
            className="absolute -left-[90px] top-0 bg-white text-black border rounded-xl p-2 w-20 text-[12px] z-10">
            <mo.li
              variants={itemVariants}
              className="rounded-lg py-1 px-2 hover:bg-black hover:text-white cursor-pointer">
              Edit
            </mo.li>
            <mo.li
              variants={itemVariants}
              className="rounded-lg py-1 px-2 hover:bg-black hover:text-white cursor-pointer"
              onClick={toggleHideShowMessage}>
              {isMessageHide ? 'Show' : 'Hide'}
            </mo.li>
            <mo.li
              variants={itemVariants}
              className="rounded-lg py-1 px-2 hover:bg-black hover:text-white cursor-pointer">
              Delete
            </mo.li>
          </mo.ul>
        </mo.div>
        <div className="flex items-center gap-1">
          <TimeDisplay
            time={chat.created_at}
            className="text-[12px] text-gray-400"
            isTimeOnly={true}
          />
          {chat.isRead ? <BsCheckAll size={16} /> : <BsCheck size={16} />}
        </div>
      </div>
    </mo.div>
  );
}

const itemVariants: Variants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
  closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
};
