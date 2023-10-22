import { LOGO_REALCHAT } from '@/assets';
import { Loader } from '@mantine/core';

export default function LoadingView() {
  return (
    <div className="absolute top-0 left-0 bottom-0 right-0 z-50 flex flex-col items-center justify-center gap-0 bg-black">
      <img src={LOGO_REALCHAT} alt="RealChat" />
      <Loader
        style={{ fill: '#fff' }}
        variant="dots"
        size="sm"
        className="h-[20px]"
      />
    </div>
  );
}
