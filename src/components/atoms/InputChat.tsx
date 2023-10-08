import { Textarea } from '@mantine/core';
import { ChangeEvent } from 'react';

type Props = {
  value: string;
  onChange: (value: ChangeEvent<HTMLTextAreaElement>) => void;
};

export default function InputChat({ value, onChange }: Props) {
  return (
    <Textarea
      placeholder="Type here..."
      variant="unstyled"
      autosize
      autoFocus
      className="[&>div>textarea]:p-0 border rounded-md px-3 pt-2 pb-1"
      minRows={1}
      maxRows={4}
      value={value}
      onChange={onChange}
    />
  );
}
