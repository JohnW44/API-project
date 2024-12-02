import { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSpotDetails, fetchDeleteSpot } from '../../store/spots';
import { fetchSpotReviews, deleteReview } from '../../store/reviews';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import PostReviewModal from '../PostReviewModal/PostReviewModal';
import { useModal } from '../../context/Modal';
import DeleteReviewModal from '../DeleteReviewModal/DeleteReviewModal';
import DeleteSpotModal from '../DeleteSpot/DeleteSpotModal';
import './SpotDetails.css';

export function SpotDetails() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const reviewsState = useSelector(state => state.reviews.state);
  const spot = useSelector(state => state.spots.currentSpot);
  const spotFromObj = useSelector(state => state.spots.spotsObj[spotId]);
  const currentSpot = spot || spotFromObj;
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

  const { setModalContent } = useModal();

  const handleDeleteReview = useCallback((e, reviewId) => {
    e.preventDefault();
    setModalContent(
      <DeleteReviewModal 
        onConfirm={() => {
          dispatch(deleteReview(reviewId))
            .then(() => {
              dispatch(fetchSpotReviews(spotId));
              dispatch(fetchSpotDetails(spotId));
            });
        }}
      />
    );
  }, [dispatch, spotId, setModalContent]);

  const isOwner = useMemo(() => 
    currentUser && spot && currentUser.id === spot.ownerId,
    [currentUser, spot]
  );

  const canReview = useMemo(() => 
    currentUser && !isOwner && !reviewsArray.some(review => review.userId === currentUser.id),
    [currentUser, isOwner, reviewsArray]
  );

  useEffect(() => {
    const loadSpotData = async () => {
      setIsLoading(true);
      await dispatch(fetchSpotDetails(spotId));
      await dispatch(fetchSpotReviews(spotId));
      setIsLoading(false);
    };
    
    loadSpotData();
  }, [dispatch, spotId]);

  const handleDelete = useCallback(() => {
    setModalContent(
      <DeleteSpotModal 
        onConfirm={() => {
          dispatch(fetchDeleteSpot(spotId))
            .then(() => navigate('/spots/manage'));
        }}
      />
    );
  }, [dispatch, spotId, navigate, setModalContent]);

  const handleEdit = () => {
    navigate(`/spots/${spotId}/edit`);
  };

  const getImages = useCallback(() => {
    if (!currentSpot) return [];
    
    const images = [];
    
    if (currentSpot.previewImage) images.push(currentSpot.previewImage);
    if (currentSpot.image1) images.push(currentSpot.image1);
    if (currentSpot.image2) images.push(currentSpot.image2);
    if (currentSpot.image3) images.push(currentSpot.image3);
    if (currentSpot.image4) images.push(currentSpot.image4);
    
    return images;
  }, [currentSpot]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!currentSpot) {
    return <div>Spot not found</div>;
  }

  const images = getImages();

  return (
    <div className="spot-details">
      <h1>{currentSpot.name}</h1>
      <h3>{currentSpot.city}, {currentSpot.state}, {currentSpot.country}</h3>
      
      <div className="images-grid">
        <div className="main-image">
          <img 
            src={images[0] || 'default-image-url'} 
            alt="Preview"
          />
        </div>
        <div className="secondary-images">
          {images.slice(1, 5).map((imageUrl, index) => (
            <div key={index} className="image-cell">
              <img 
                src={imageUrl || 'default-image-url'} 
                alt={`Spot ${index + 1}`}
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className="spot-details-container">
        <div className="spot-info">
          <h2>Hosted by {currentSpot.Owner?.firstName} {currentSpot.Owner?.lastName}</h2>
          <p>{currentSpot.description}</p>
        </div>
        <div className="booking-box">
          <div className="booking-header">
            <span className="price">${currentSpot.price} / night</span>
            <div className="rating-reviews">
              <span className="rating">★ {formatRating(currentSpot.avgStarRating)}</span>
              <span className="reviews">· {currentSpot.numReviews || 0} reviews</span>
            </div>
          </div>
        <button className="reserve-button" onClick={handleReserveClick}>Reserve</button>
        </div>
      </div>
      <div className="reviews-section">
        <hr className="reviews-divider" />
        <div className="reviews-header">
          <div className="reviews-summary">
            <h2 className='review-stars'>
              ★ {formatRating(currentSpot.avgStarRating)} · 
              {currentSpot.numReviews === 1 ? '1 review' : `${currentSpot.numReviews} reviews`}
            </h2>
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
                <p className="review-stars">★ {review.stars}</p>
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
                      onClick={(e) => handleDeleteReview(e, review.id)}
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
