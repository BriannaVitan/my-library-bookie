import React, { useState } from 'react';
export default BookReviews;
import { BookReviewsProps, NewReview } from './types';
import './BookReviews.css';

const initialNewReview: NewReview = {
  title: '',
  author: '',
  rating: 5,
  comment: ''
};

const BookReviews: React.FC<BookReviewsProps> = ({ initialReviews = [] }) => {
  const [reviews, setReviews] = useState<BookReview[]>(initialReviews);
  const [newReview, setNewReview] = useState<NewReview>(initialNewReview);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setReviews([...reviews, { ...newReview, id: Date.now() }]);
    setNewReview(initialNewReview);
  };

  return (
    <div className="book-reviews">
      <h1>Book Reviews</h1>
      
      <form onSubmit={handleSubmit} className="review-form">
        <input
          type="text"
          placeholder="Book Title"
          value={newReview.title}
          onChange={(e) => setNewReview({...newReview, title: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Author"
          value={newReview.author}
          onChange={(e) => setNewReview({...newReview, author: e.target.value})}
          required
        />
        <select
          value={newReview.rating}
          onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
        >
          {[1,2,3,4,5].map(num => (
            <option key={num} value={num}>{num} Stars</option>
          ))}
        </select>
        <textarea
          placeholder="Your Review"
          value={newReview.comment}
          onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
          required
        />
        <button type="submit">Add Review</button>
      </form>

      <div className="review-list">
        {reviews.map(review => (
          <div key={review.id} className="review-card">
            <h3>{review.title}</h3>
            <h4>by {review.author}</h4>
            <div className="rating">{'⭐'.repeat(review.rating)}</div>
            <p>{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookReviews;