import { Review } from '@/store/slices/reviewSlice';

export interface AnalysisResult {
  meanRate: number;
  countUserReview: number;
  percentStar: {
    oneStar: number;
    twoStar: number;
    threeStar: number;
    fourStar: number;
    fiveStar: number;
  };
}

export default function analyzeReviews(data: Review[]): AnalysisResult {
  const totalReviews = data.length;
  const totalRatings = data.reduce((sum, review) => sum + review.rate, 0);
  const meanRate = Number((totalRatings / totalReviews).toFixed(1)) || 0;

  const ratingCounts = {
    oneStar: 0,
    twoStar: 0,
    threeStar: 0,
    fourStar: 0,
    fiveStar: 0,
  };

  data.forEach((review) => {
    switch (review.rate) {
      case 1:
        ratingCounts.oneStar++;
        break;
      case 2:
        ratingCounts.twoStar++;
        break;
      case 3:
        ratingCounts.threeStar++;
        break;
      case 4:
        ratingCounts.fourStar++;
        break;
      case 5:
        ratingCounts.fiveStar++;
        break;
      default:
        break;
    }
  });

  const percentStar = {
    oneStar:
      Number(((ratingCounts.oneStar / totalReviews) * 100).toFixed()) || 0,
    twoStar:
      Number(((ratingCounts.twoStar / totalReviews) * 100).toFixed()) || 0,
    threeStar:
      Number(((ratingCounts.threeStar / totalReviews) * 100).toFixed()) || 0,
    fourStar:
      Number(((ratingCounts.fourStar / totalReviews) * 100).toFixed()) || 0,
    fiveStar:
      Number(((ratingCounts.fiveStar / totalReviews) * 100).toFixed()) || 0,
  };

  const countUserReview = totalReviews;

  return {
    meanRate,
    countUserReview,
    percentStar,
  };
}
