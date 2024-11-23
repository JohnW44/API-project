import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { createReview, updateReview, fetchSpotReviews } from '../../store/reviews';
import { fetchSpotDetails } from '../../store/spots';
import './PostReviewModal.css';

function PostReviewModal({ spotId, review: existingReview }) {
  const dispatch = useDispatch();
  const [review, setReview] = useState(existingReview ? existingReview.review : '');
  const [stars, setStars] = useState(existingReview ? existingReview.stars : 0);
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (review.length < 10) {
      setErrors(prev => ({ ...prev, review: "Review must be at least 10 characters long" }));
      return;
    }
    if (stars < 1) {
      setErrors(prev => ({ ...prev, stars: "Please select a star rating" }));
      return;
    }

    let response;
    if (existingReview) {
      response = await dispatch(updateReview({
        review,
        stars
      }, existingReview.id));
    } else {
      response = await dispatch(createReview({
        review,
        stars
      }, spotId));
    }

    if (response) {
      await dispatch(fetchSpotReviews(spotId));
      await dispatch(fetchSpotDetails(spotId));
      closeModal();
    }
  };

  return (
    <div className="post-review-modal">
      <h2>{existingReview ? 'Update Your Review' : 'How was your stay?'}</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Leave your review here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        {errors.review && <p className="error">{errors.review}</p>}
        
        <div className="stars-input">
          {[1, 2, 3, 4, 5].map(num => (
            <span
              key={num}
              className={`star ${num <= stars ? 'filled' : ''}`}
              onClick={() => setStars(num)}
            >
              ★
            </span>
          ))}
        </div>
        {errors.stars && <p className="error">{errors.stars}</p>}
        
        <button type="submit">
          {existingReview ? 'Update Review' : 'Submit Your Review'}
        </button>
      </form>
    </div>
  );
}

export default PostReviewModal; 