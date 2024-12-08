import { BookReview } from '../../types';

export interface BookReviewsProps {
  initialReviews?: BookReview[];
}

export interface NewReview {
  title: string;
  author: string;
  rating: number;
  comment: string;
}