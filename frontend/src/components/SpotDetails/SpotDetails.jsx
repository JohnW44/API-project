import './SpotDetails.css';
import { faker } from '@faker-js/faker';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSpotDetails } from '../../store/spots';
import { fetchSpotReviews } from '../../store/reviews';

export function SpotDetails() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector(state => state.spots.spotsObj[spotId]);
  const [isLoading, setIsLoading] = useState(true);
  const reviews = useSelector(state => {
    console.log('Full Redux State:', state);
    return state.reviews?.spotReviews || [];
  });
  const currentUser = useSelector(state => state.session.user);
  
  console.log('Reviews:', reviews);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await dispatch(fetchSpotDetails(spotId));
      await dispatch(fetchSpotReviews(spotId));
      setIsLoading(false);
    };
    fetchData();
  }, [dispatch, spotId]);

  const formatRating = (rating) => {
    if (rating === null || rating === undefined) {
      return 'New';
    }
    return typeof rating === 'number' ? rating.toFixed(1) : rating.toString();
  };

  const handleReserveClick = () => {
    alert("Feature Coming Soon...");
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isOwner = currentUser && spot && currentUser.id === spot.ownerId;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!spot) {
    return <div>Spot not found</div>;
  }

  const placeholderImages = [
    'https://via.placeholder.com/600x400?text=Main+Image',
    'https://via.placeholder.com/300x200?text=Image+2',
    'https://via.placeholder.com/300x200?text=Image+3',
    'https://via.placeholder.com/300x200?text=Image+4',
    'https://via.placeholder.com/300x200?text=Image+5'
  ];

  return (
    <div className="spot-details">
      <h1>{spot.name}</h1>
      <p className="spot-location">{spot.city}, {spot.state}, {spot.country}</p>
      <div className="spot-images">
        <div className="main-image">
          <img src={placeholderImages[0]} alt={spot.name} />
        </div>
        <div className="secondary-images">
          {placeholderImages.slice(1).map((image, index) => (
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
          <h2>★ {formatRating(spot.avgStarRating)} · {spot.numReviews} reviews</h2>
        </div>
        <div className="reviews-list">
          {reviews.length > 0 ? (
            reviews.map(review => (
              <div key={review.id} className="review-item">
                <h3>{review.User?.firstName || 'Anonymous'}</h3>
                <p className="review-date">{formatDate(review.createdAt)}</p>
                <p className="review-text">{review.review || 'No review text'}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      </div>
      {isOwner && (
        <div className="owner-actions">
          <button onClick={() => {/* Handle edit */}}>Edit Spot</button>
          <button onClick={() => {/* Handle delete */}}>Delete Spot</button>
        </div>
      )}
    </div>
  );
}

export default SpotDetails;
