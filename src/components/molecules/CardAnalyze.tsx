import { AnalysisResult } from '@/utils/analyzeReviews';
import { Progress, Rating } from '@mantine/core';
import ModalRateApplication from '../organisms/ModalRateApplication';
import Button from '../atoms/Button';

type Props = {
  analyze: AnalysisResult;
  isAlreadyRate: boolean;
};

export default function CardAnalyze({ analyze, isAlreadyRate }: Props) {
  return (
    <div className="p-8 px-10 max-w-[350px] m-auto rounded-lg shadow-xl bg-white shadow-gray-100 text-center">
      <h1 className="font-semibold text-[18px]">User reviews</h1>
      <div className="flex flex-col items-center gap-2 mt-3">
        <div className="flex items-center justify-center gap-3 rounded-3xl bg-gray-100 px-5 py-3">
          <Rating value={analyze.meanRate} fractions={3} readOnly />
          <p className="text-[14px] text-gray-600">
            {analyze.meanRate} out of 5
          </p>
        </div>
        <p className="text-[12px]">{analyze.countUserReview} user reviews</p>
      </div>
      <div className="max-w-[280px] m-auto flex flex-col gap-1 mt-6">
        <div className="flex items-center justify-center gap-3">
          <p className="text-[14px] text-gray-500">5 star</p>
          <Progress
            color="yellow"
            value={analyze.percentStar.fiveStar}
            className="flex-1 shadow-sm bg-gray-100/50"
          />
          <p className="text-[14px]">{analyze.percentStar.fiveStar}%</p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <p className="text-[14px] text-gray-500">4 star</p>
          <Progress
            color="yellow"
            value={analyze.percentStar.fourStar}
            className="flex-1 shadow-sm bg-gray-100/50"
          />
          <p className="text-[14px]">{analyze.percentStar.fourStar}%</p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <p className="text-[14px] text-gray-500">3 star</p>
          <Progress
            color="yellow"
            value={analyze.percentStar.threeStar}
            className="flex-1 shadow-sm bg-gray-100/50"
          />
          <p className="text-[14px]">{analyze.percentStar.threeStar}%</p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <p className="text-[14px] text-gray-500">2 star</p>
          <Progress
            color="yellow"
            value={analyze.percentStar.twoStar}
            className="flex-1 shadow-sm bg-gray-100/50"
          />
          <p className="text-[14px]">{analyze.percentStar.twoStar}%</p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <p className="text-[14px] text-gray-500">1 star</p>
          <Progress
            color="yellow"
            value={analyze.percentStar.oneStar}
            className="flex-1 shadow-sm bg-gray-100/50"
          />
          <p className="text-[14px]">{analyze.percentStar.oneStar}%</p>
        </div>
      </div>
      {!isAlreadyRate && (
        <ModalRateApplication>
          <Button className="w-max px-5 mt-10">Rate Now</Button>
        </ModalRateApplication>
      )}
    </div>
  );
}
