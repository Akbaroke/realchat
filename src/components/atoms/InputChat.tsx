import cn from '@/utils/cn';
import { Textarea } from '@mantine/core';
import { ChangeEvent } from 'react';

type Props = {
  value: string;
  onChange: (value: ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
};

export default function InputChat({ value, onChange, className }: Props) {
  return (
    <Textarea
      placeholder="Type here..."
      variant="unstyled"
      autosize
      autoFocus
      className={cn('[&>div>textarea]:p-0', className)}
      minRows={1}
      maxRows={4}
      value={value}
      onChange={onChange}
    />
  );
}
