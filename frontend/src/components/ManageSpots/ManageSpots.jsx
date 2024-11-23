import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchSpots, fetchDeleteSpot } from '../../store/spots';
import './ManageSpots.css';

function ManageSpots() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(state => state.session.user);
  const spotsObj = useSelector(state => state.spots.spotsObj);
  
  // Filter spots for current user
  const userSpots = Object.values(spotsObj).filter(spot => 
    spot.ownerId === currentUser?.id
  );

  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch]);

  const handleSpotClick = (spotId) => {
    navigate(`/spots/${spotId}`);
  };

  const handleDelete = async (e, spotId) => {
    e.stopPropagation();
    await dispatch(fetchDeleteSpot(spotId));
  };

  const handleUpdate = (e, spotId) => {
    e.stopPropagation();
    navigate(`/spots/${spotId}/edit`);
  };

  const handleCreateClick = () => {
    navigate('/spots/new');
  };

  if (!currentUser) {
    navigate('/');
    return null;
  }

  return (
    <div className="manage-spots">
      <div className="manage-header">
        <h1>Manage Your Holiday Havens</h1>
        <button 
          onClick={handleCreateClick}
          className="create-new-spot-button"
        >
          Create a New Holiday Haven
        </button>
      </div>
      
      <div className="listings-grid">
        {userSpots.length > 0 ? (
          userSpots.map((spot) => (
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
                <div className="spot-actions">
                  <button 
                    onClick={(e) => handleUpdate(e, spot.id)}
                    className="update-button"
                  >
                    Update
                  </button>
                  <button 
                    onClick={(e) => handleDelete(e, spot.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>You have not listed any Holiday Havens yet!</p>
        )}
      </div>
    </div>
  );
}

export default ManageSpots; 