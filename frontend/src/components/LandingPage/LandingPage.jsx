import './LandingPage.css';
import { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpots } from '../../store/spots';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const spotsObj = useSelector(state => state.spots.spotsObj);
  
  const spots = useMemo(() => 
    Object.values(spotsObj),
    [spotsObj]
  );

  const handleSpotClick = useCallback((spotId) => {
    navigate(`/spots/${spotId}`);
  }, [navigate]);

  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch]);

  const getRandomColor = () => {
    const colors = [
      '#ff0000', // red
      '#00ff00', // green
      '#ffff00', // yellow
      '#ff00ff', // pink  
      '#00ffff'  // turquoise
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.setProperty('--random-color', getRandomColor());
  };

  return (
    <div className="landing-page">
      <h1 className="landing-title">Holiday Havens</h1>
      <section className="featured-listings">
        <h2>Explore Holiday Havens</h2>
        <div className="listings-grid">
          {spots.map((spot) => (
            <div 
              key={spot.id} 
              className="listing-card"
              onClick={() => handleSpotClick(spot.id)}
              onMouseEnter={handleMouseEnter}
            >
              <div className="listing-image">
                {spot.previewImage ? (
                  <img src={spot.previewImage} alt={spot.name} />
                ) : (
                  <div className="placeholder-image"></div>
                )}
                <div className="listing-name-overlay">{spot.name}</div>
              </div>
              <div className="listing-info">
                <div className="listing-location">
                  {spot.city}, {spot.state}
                </div>
                <div className="listing-price">
                  ${spot.price} / night
                </div>
                <div className="listing-rating">
                  ★ {spot.avgRating || 'New'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
