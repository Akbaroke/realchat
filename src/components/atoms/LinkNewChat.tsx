import cn from '@/utils/cn';
import { useMediaQuery } from '@mantine/hooks';
import { MdOutlineChat } from 'react-icons/md';
import { TbPlus } from 'react-icons/tb';
import { Link } from 'react-router-dom';

export default function LinkNewChat() {
  const matches = useMediaQuery('(max-width: 500px)');

  return (
    <Link
      to="/personal"
      className={cn({
        'p-3 rounded-2xl bg-black text-white w-max fixed bottom-5 right-5 float-right':
          matches,
        'p-2 rounded-lg border': !matches,
      })}>
      {matches && <MdOutlineChat size={20} />}
      {!matches && <TbPlus />}
    </Link>
  );
}
