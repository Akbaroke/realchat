import cn from '@/utils/cn';

type Props = {
  type?: 'button' | 'submit';
  variant?: 'fill' | 'outline';
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  isDisabled?: boolean;
  isLoading?: boolean;
};

export default function Button({
  type = 'button',
  variant = 'fill',
  className,
  onClick,
  children,
  isDisabled,
  isLoading,
}: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled || isLoading}
      className={cn(
        'w-full px-2 py-2 sm:px-4 rounded-lg sm:rounded-xl text-[14px] font-semibold hover:shadow-md transition-all duration-300',
        {
          'bg-black text-white ': variant === 'fill',
          'bg-white text-black border border-gray-200': variant === 'outline',
        },
        className
      )}>
      {children}
    </button>
  );
}
