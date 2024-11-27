import { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchSpots, fetchDeleteSpot } from '../../store/spots';
import './ManageSpots.css';
import { useModal } from '../../context/Modal';
import DeleteSpotModal from '../DeleteSpot/DeleteSpotModal';

function ManageSpots() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(state => state.session.user);
  const spotsObj = useSelector(state => state.spots.spotsObj);
  const { setModalContent } = useModal();
  
  const userSpots = useMemo(() => 
    Object.values(spotsObj).filter(spot => 
      spot.ownerId === currentUser?.id
    ),
    [spotsObj, currentUser?.id]
  );

  const handleSpotClick = useCallback((spotId) => {
    navigate(`/spots/${spotId}`);
  }, [navigate]);

  const handleDelete = useCallback((e, spotId) => {
    e.stopPropagation();
    setModalContent(
      <DeleteSpotModal 
        onConfirm={() => dispatch(fetchDeleteSpot(spotId))}
      />
    );
  }, [dispatch, setModalContent]);

  const handleUpdate = useCallback((e, spotId) => {
    e.stopPropagation();
    navigate(`/spots/${spotId}/edit`);
  }, [navigate]);

  const handleCreateClick = useCallback(() => {
    navigate('/spots/new');
  }, [navigate]);

  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch]);

  if (!currentUser) {
    navigate('/');
    return null;
  }

  const SpotCard = ({ spot }) => {
    const isSpotOwner = spot.ownerId === currentUser?.id;

    return (
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
          {isSpotOwner && (
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
          )}
          <div className="listing-price">
            ${spot.price} / night
          </div>
          <div className="listing-rating">
            ★ {spot.avgRating || 'New'}
          </div>
        </div>
      </div>
    );
  };

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
          userSpots.map(spot => (
            <SpotCard key={spot.id} spot={spot} />
          ))
        ) : (
          <p>You have not listed any Holiday Havens yet!</p>
        )}
      </div>
    </div>
  );
}

export default ManageSpots; 