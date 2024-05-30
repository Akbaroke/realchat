import { DEFAULT_FOTO } from '@/assets';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Rating } from '@mantine/core';
import TimeDisplay from '../atoms/TimeDisplay';
import { Review } from '@/store/slices/reviewSlice';

export default function CardRating({ review }: { review: Review }) {
  return (
    <div className="flex items-center justify-between border-b py-5 border-gray-100">
      <div className="flex items-center gap-4">
        <LazyLoadImage
          alt="foto"
          effect="blur"
          src={review.foto || DEFAULT_FOTO}
          className="w-12 h-12 rounded-full bg-gray-200"
        />
        <div className="flex flex-col items-start gap-1">
          <h1 className="font-semibold text-[14px] line-clamp-1">
            {review.name}
          </h1>
          <p className="text-[14px] text-gray-500 line-clamp-2">
            {review.comment}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-1 items-end">
        <div className="flex items-center gap-1">
          <p className="text-[12px] text-gray-500 font-medium">{review.rate}</p>
          <Rating value={review.rate} fractions={2} readOnly size="xs" />
        </div>
        <TimeDisplay
          time={review.datetime}
          className="text-[12px] text-gray-500"
        />
      </div>
    </div>
  );
}
