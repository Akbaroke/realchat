import { FiChevronLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import CardRating from '@/components/molecules/CardRating';
import { fetchReviews } from '@/store/slices/reviewSlice';
import analyzeReviews from '@/utils/analyzeReviews';
import { motion } from 'framer-motion';
import CardAnalyze from '@/components/molecules/CardAnalyze';
import ModalRateApplication from '@/components/organisms/ModalRateApplication';

export default function Rating() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const reviews = useSelector((state: RootState) => state.reviews);
  const [isAlreadyRate, setIsAlreadyRate] = useState(true);
  const analyze = analyzeReviews(reviews);

  useEffect(() => {
    dispatch(fetchReviews());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user?.id) {
      const validateUserId = reviews.find(
        (val: { user_id: string }) => val.user_id === user?.id
      );
      setIsAlreadyRate(!!validateUserId);
    }
  }, [user?.id, reviews]);

  const sortedReviews = [...reviews].sort((a, b) => b.datetime - a.datetime);

  return (
    <div>
      <div className="flex items-center px-5 py-3 border-b sticky top-0 gap-5 z-10 bg-white">
        <div
          className="p-2 rounded-md border w-max text-gray-500 cursor-pointer hover:text-black transition-all"
          onClick={() => navigate('/profile')}>
          <FiChevronLeft size={16} />
        </div>
        <h1 className="font-semibold">Rating</h1>
      </div>
      <div className="p-5">
        <CardAnalyze isAlreadyRate={isAlreadyRate} analyze={analyze} />
        <div className="mt-10 sm:p-5 p-0">
          {sortedReviews.map((review, index) => (
            <motion.div
              initial={{ opacity: 0, transform: 'translateY(50px)' }}
              animate={{ opacity: 1, transform: 'translateY(0px)' }}
              transition={{ delay: index * 0.3, duration: 0.3 }}
              key={review.id}>
              <ModalRateApplication review={review}>
                <CardRating review={review} />
              </ModalRateApplication>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
