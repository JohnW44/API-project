import './LandingPage.css';
import { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpots } from '../../store/spots';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const spotsObj = useSelector(state => state.spots.spotsObj);
  
  const spots = useMemo(() => {
    const spotsArray = Object.values(spotsObj);
    console.log("Spots data:", spotsArray);
    return spotsArray;
  }, [spotsObj]);

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
      <section className="featured-listings">
        <h1>Explore Holiday Havens</h1>
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
                  <img 
                    src={spot.previewImage} 
                    alt={spot.name}
                    onError={(e) => {
                      console.error("Failed to load image:", spot.previewImage);
                      e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="placeholder-image">No Image Available</div>
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
