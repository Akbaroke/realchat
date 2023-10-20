import { Tooltip } from '@mantine/core';

type Props = {
  label: string;
  children: JSX.Element;
};

export default function TooltipComp({ children, label }: Props) {
  return (
    <Tooltip label={label} color="dark" withArrow arrowPosition="center">
      <div className="w-max">{children}</div>
    </Tooltip>
  );
}
