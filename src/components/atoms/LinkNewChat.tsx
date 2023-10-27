import cn from '@/utils/cn';
import { useMediaQuery } from '@mantine/hooks';
import { TbMessage2Plus } from 'react-icons/tb';
import { Link } from 'react-router-dom';

export default function LinkNewChat() {
  const matches = useMediaQuery('(max-width: 500px)');

  return (
    <Link
      to="/personal"
      className={cn('', {
        'p-3 rounded-2xl bg-black text-white w-max fixed z-20 bottom-5 right-5 float-right':
          matches,
        'p-2 rounded-lg border': !matches,
      })}>
      {matches && <TbMessage2Plus size={25} />}
      {!matches && <TbMessage2Plus />}
    </Link>
  );
}
