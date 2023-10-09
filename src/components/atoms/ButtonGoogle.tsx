import Button from './Button';
import { FcGoogle } from 'react-icons/fc';

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
};

export default function ButtonGoogle({ children, onClick }: Props) {
  return (
    <Button
      className="flex items-center justify-center gap-2 bg-gray-100 text-gray-500 h-[40px]"
      onClick={onClick}>
      <FcGoogle size={18} />
      {children}
    </Button>
  );
}
