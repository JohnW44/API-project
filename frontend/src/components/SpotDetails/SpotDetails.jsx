import './SpotDetails.css';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSpotDetails } from '../../store/spots';
import { faker } from '@faker-js/faker';

function SpotDetails() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector(state => state.spots.currentSpot);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchSpotDetails(spotId))
      .then(() => setIsLoading(false))
      .catch(error => {
        console.error('Error fetching spot details:', error);
        setIsLoading(false);
      });
  }, [dispatch, spotId]);

  const formatRating = (rating) => {
    if (rating === null || rating === undefined) {
      return 'New';
    }
    return typeof rating === 'number' ? rating.toFixed(1) : rating.toString();
  };

  // New function to handle button click
  const handleReserveClick = () => {
    alert("Feature Coming Soon...");
  };

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

  const lorem = faker.lorem;


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
            <span className="rating">★ {formatRating(spot.avgStarRating)}</span>
            <span className="reviews">· {spot.numReviews || 0} reviews</span>
          </div>
          {/* Updated button with onClick handler */}
          <button className="reserve-button" onClick={handleReserveClick}>Reserve</button>
        </div>
      </div>
    </div>
  );
}

export default SpotDetails;
