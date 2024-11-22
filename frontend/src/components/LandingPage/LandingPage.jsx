// import HauntedHouseLogo from '../../../../images/Gcds-Halloween-Haunted-house.ico';     
import './LandingPage.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpots } from '../../store/spots';
import { useNavigate } from 'react-router-dom';
// import backgroundImage from '../../../../images/HomePageBackground.png';

function LandingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const spots = useSelector(state => Object.values(state.spots.spotsObj));

  useEffect(() => {
    const loadSpots = async () => {
      await dispatch(fetchSpots());
    };
    
    loadSpots();
  }, [dispatch]);

  const handleSpotClick = (spotId) => {
    navigate(`/spots/${spotId}`);
  };

  return (
    <div className="landing-page">
      <section className="featured-listings">
        <h2>Explore SpookySpots</h2>
        <div className="listings-grid">
          {spots.map((spot) => (
            <div 
              key={spot.id} 
              className="listing-card"
              onClick={() => handleSpotClick(spot.id)}
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
