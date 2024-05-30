import cn from "@/utils/cn";
import { Loader } from "@mantine/core";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";

export interface LinkPreviewInterface {
  description: string;
  image: string;
  title: string;
  url: string;
}

export default function LinkPreview({ data, type, isLoading }: { data: LinkPreviewInterface, type?: 'right' | 'left' | 'center', isLoading?: boolean }) {
  return (
    <Link
      to={data.url}
      className={cn("max-w-[300px] rounded-lg border border-gray-300 overflow-hidden ", {
        'border-none': type !== 'center',
      })}>
      {isLoading ? (<Loader
        color="gray"
        variant="oval"
        size="sm"
        className="m-auto h-[20px]"
      />) : (
        <>
          <div className={cn({ 'bg-gray-900': type === 'right', 'bg-gray-100/50': type === 'left', })}>
            <LazyLoadImage
              alt="image link preview"
              effect="blur"
              src={data.image}
              referrerPolicy="no-referrer"
              className="max-h-[150px] w-[280px] object-cover rounded-t-lg overflow-hidden"
            />
          </div>
          <div className={cn("px-4 py-3 flex flex-col gap-[2px]", { 
            'bg-gray-900 rounded-b-lg': type === 'right',
            'bg-gray-100/50 rounded-b-lg': type === 'left',
             })}>
            <h1 className={cn("text-[14px] font-semibold line-clamp-2", {
              'text-white': type === 'right',
            })}>{data.title}</h1>
            <h3 className={cn('text-[13px] text-gray-600 font-medium line-clamp-1', {
              'text-white/70': type === 'right'
            })}>{data.description}</h3>
            <p className="text-gray-500 text-[12px] line-clamp-1">{data.url}</p>
          </div>
        </>
      )}
    </Link>
  );
}
