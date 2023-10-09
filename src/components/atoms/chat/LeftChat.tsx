import { DataChats } from '@/pages/Personal';
import TimeDisplay from '../TimeDisplay';
import { useState } from 'react';
import { useClickOutside } from '@mantine/hooks';
import { Variants, motion as mo } from 'framer-motion';

type Props = {
  chat: DataChats;
};

export default function LeftChat({ chat }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMessageHide, setIsMessageHide] = useState(false);
  const ref = useClickOutside(() => setIsOpen(false));

  const toggleHideShowMessage = () => setIsMessageHide(!isMessageHide);

  return (
    <mo.div initial={false} animate={isOpen ? 'open' : 'closed'}>
      <div className="flex items-end gap-2">
        <img
          src={chat.image}
          alt=""
          width={30}
          height={30}
          className="rounded-lg h-max relative bottom-2"
        />
        <div className="flex flex-col gap-1">
          <mo.div
            className="p-3 text-[14px] border rounded-xl bg-white w-max relative cursor-pointer"
            whileTap={{ scale: 0.9 }}
            ref={ref}
            onClick={() => setIsOpen(!isOpen)}>
            <p>{isMessageHide ? '•••••' : chat.message}</p>
            <mo.ul
              variants={{
                open: {
                  clipPath: 'inset(0% 0% 0% 0% round 10px)',
                  opacity: 1,
                  transition: {
                    type: 'spring',
                    bounce: 0,
                    delayChildren: 0.3,
                    staggerChildren: 0.05,
                  },
                },
                closed: {
                  clipPath: 'inset(20% 100% 80% 0% round 10px)',
                  opacity: 0,
                  transition: {
                    type: 'spring',
                    bounce: 0,
                    duration: 0.3,
                  },
                },
              }}
              className="absolute -right-[90px] top-0 bg-black text-white border rounded-xl p-2 w-20 text-[12px] z-10">
              <mo.li
                variants={itemVariants}
                className="rounded-lg py-1 px-2 hover:bg-white hover:text-black cursor-pointer">
                Reply
              </mo.li>
              <mo.li
                variants={itemVariants}
                className="rounded-lg py-1 px-2 hover:bg-white hover:text-black cursor-pointer"
                onClick={toggleHideShowMessage}>
                {isMessageHide ? 'Show' : 'Hide'}
              </mo.li>
            </mo.ul>
          </mo.div>
          <TimeDisplay
            time={chat.updated_at}
            className="text-[12px] text-gray-400"
            isTimeOnly={true}
          />
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
