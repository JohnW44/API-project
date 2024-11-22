import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { fetchSpotDetails } from '../../store/spots';
import { createReview } from '../../store/reviews';
import './PostReviewModal.css';

function PostReviewModal({ spotId }) {
  const dispatch = useDispatch();
  const [review, setReview] = useState('');
  const [stars, setStars] = useState(0);
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

   const newReview = await dispatch(createReview({
      review,
      stars
    }, spotId));

    if (newReview) { await dispatch(fetchSpotDetails(spotId))
      closeModal();
    }
  };


  return (
    <div className="post-review-modal">
      <h2>How was your stay?</h2>
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
        
        <button type="submit">Submit Your Review</button>
      </form>
    </div>
  );
}

export default PostReviewModal; 