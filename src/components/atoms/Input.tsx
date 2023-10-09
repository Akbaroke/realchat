import cn from '@/utils/cn';
import { Loader } from '@mantine/core';

interface Props {
  label: string;
  id: string;
  value: string | number;
  errorLabel?: string;
  disabled?: boolean;
  readOnly?: boolean;
  isLoading?: boolean;
  type?: 'text' | 'email' | 'password' | 'number';
  maxLength?: number;
  min?: number;
  max?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement> | string) => void;
  className?: string;
  placeholder?: string;
}

const Input: React.FC<Props> = ({
  label,
  id,
  value,
  errorLabel,
  disabled,
  isLoading,
  type = 'text',
  maxLength,
  min,
  max,
  onChange,
  className,
  placeholder,
}) => {
  return (
    <div className="flex flex-col my-2 relative gap-2">
      <label htmlFor={id} className="text-[14px] text-one text-gray-400">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        disabled={isLoading || disabled}
        maxLength={maxLength}
        placeholder={placeholder}
        className={cn(
          'border border-gray-200 rounded-lg h-[40px] -mt-[3px] text-[12px] text-one outline-none focus:border-black transition-colors duration-500 bg-white px-3',
          {
            'pl-6 cursor-not-allowed': disabled,
          },
          {
            'border-red-400': errorLabel,
          },
          className
        )}
      />
      {errorLabel && (
        <p className="text-red-400 text-[12px] -mt-1">{errorLabel}</p>
      )}
      {isLoading && (
        <Loader color="dark" size="xs" className="absolute bottom-2 right-1" />
      )}
    </div>
  );
};

export default Input;
