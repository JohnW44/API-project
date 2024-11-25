import { faker } from '@faker-js/faker';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSpotDetails, fetchDeleteSpot } from '../../store/spots';
import { fetchSpotReviews, deleteReview } from '../../store/reviews';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import PostReviewModal from '../PostReviewModal/PostReviewModal';
import './SpotDetails.css';

export function SpotDetails() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const reviewsState = useSelector(state => state.reviews.state);
  const spot = useSelector(state => state.spots.spotsObj[spotId]);
  const currentUser = useSelector(state => state.session.user);
  const [isLoading, setIsLoading] = useState(true);
  
  const reviewsArray = useMemo(() => {
    return Object.values(reviewsState.reviewsObj);
  }, [reviewsState.reviewsObj]);

  const formatRating = useCallback((rating) => {
    if (rating === null || rating === undefined) {
      return 'New';
    }
    return typeof rating === 'number' ? rating.toFixed(1) : rating.toString();
  }, []);

  const formatDate = useCallback((dateString) => {
    const options = { year: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }, []);

  const handleReserveClick = useCallback(() => {
    alert("Feature Coming Soon...");
  }, []);

  const handleDeleteReview = useCallback(async (reviewId) => {
    await dispatch(deleteReview(reviewId));
    await dispatch(fetchSpotReviews(spotId));
    await dispatch(fetchSpotDetails(spotId));
  }, [dispatch, spotId]);

  const isOwner = useMemo(() => 
    currentUser && spot && currentUser.id === spot.ownerId,
    [currentUser, spot]
  );

  const canReview = useMemo(() => 
    currentUser && !isOwner && !reviewsArray.some(review => review.userId === currentUser.id),
    [currentUser, isOwner, reviewsArray]
  );

  const placeholderImages = useMemo(() => ({
    main: 'https://via.placeholder.com/600x400?text=Main+Image',
    secondary: {
      1: 'https://via.placeholder.com/300x200?text=Image+2',
      2: 'https://via.placeholder.com/300x200?text=Image+3',
      3: 'https://via.placeholder.com/300x200?text=Image+4',
      4: 'https://via.placeholder.com/300x200?text=Image+5'
    }
  }), []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await dispatch(fetchSpotDetails(spotId));
      await dispatch(fetchSpotReviews(spotId));
      setIsLoading(false);
    };
    fetchData();
  }, [dispatch, spotId]);

  const handleDelete = async () => {
    await dispatch(fetchDeleteSpot(spotId));
    navigate('/spots/manage');
  };

  const handleEdit = () => {
    navigate(`/spots/${spotId}/edit`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!spot) {
    return <div>Spot not found</div>;
  }

  return (
    <div className="spot-details">
      <h1>{spot.name}</h1>
      <p className="spot-location">{spot.city}, {spot.state}, {spot.country}</p>
      <div className="spot-images">
        <div className="main-image">
          <img src={placeholderImages.main} alt={spot.name} />
        </div>
        <div className="secondary-images">
          {Object.values(placeholderImages.secondary).map((image, index) => (
            <div key={index} className="secondary-image">
              <img src={image} alt={`${spot.name} ${index + 2}`} />
            </div>
          ))}
        </div>
      </div>
      <div className="spot-details-container">
        <div className="spot-info">
          <h2>Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}</h2>
          <p>{spot.description}</p>
          <p>{faker.lorem.paragraphs(3)}</p>
        </div>
        <div className="booking-box">
          <div className="booking-header">
            <span className="price">${spot.price} / night</span>
            <div className="rating-reviews">
              <span className="rating">★ {formatRating(spot.avgStarRating)}</span>
              <span className="reviews">· {spot.numReviews || 0} reviews</span>
            </div>
          </div>
        <button className="reserve-button" onClick={handleReserveClick}>Reserve</button>
        </div>
      </div>
      <div className="reviews-section">
        <hr className="reviews-divider" />
        <div className="reviews-header">
          <div className="reviews-summary">
            <h2 className='review-stars'>★ {formatRating(spot.avgStarRating)} · {spot.numReviews} reviews</h2>
          </div>
          {canReview && (
            <div className="review-button-container">
              <OpenModalButton
                buttonText="Post Your Review"
                modalComponent={<PostReviewModal spotId={spotId} />}
                className="post-review-button"
              />
            </div>
          )}
        </div>
        <div className="reviews-list">
          {reviewsArray.length > 0 ? (
            reviewsArray.map(review => (
              <div key={review.id} className="review-item">
                <h3>{review.User?.firstName || 'Anonymous'}</h3>
                <p className="review-date">{formatDate(review.createdAt)}</p>
                <p className="review-text">{review.review || 'No review text'}</p>
                {currentUser && 
                 review.userId === currentUser.id && 
                 !isOwner && (
                  <div className="review-actions">
                    <OpenModalButton
                      buttonText="Edit Review"
                      modalComponent={<PostReviewModal spotId={spotId} review={review} />}
                      className="edit-review-button"
                    />
                    <button 
                      onClick={() => handleDeleteReview(review.id)}
                      className="delete-review-button"
                    >
                      Delete Review
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>Be the first to post a review!</p>
          )}
        </div>
      </div>
      {isOwner && (
        <div className="owner-actions">
          <button 
            onClick={handleEdit}
            className="update-button"
          >
            Update
          </button>
          <button 
            onClick={handleDelete}
            className="delete-button"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default SpotDetails;
