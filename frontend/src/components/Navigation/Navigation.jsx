// frontend/src/components/Navigation/Navigation.jsx
import './Navigation.css';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import HauntedHouseLogo from '../../../../images/holiday havs.png';
import { useEffect, useMemo } from 'react';
import { fetchSpots } from '../../store/spots';

function Navigation({ isLoaded }) {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const spotsObj = useSelector(state => state.spots.spotsObj);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch]);

  const userHasSpots = useMemo(() => {
    if (!sessionUser || !spotsObj) return false;
    return Object.values(spotsObj).some(spot => spot.ownerId === sessionUser.id);
  }, [spotsObj, sessionUser]);

  return (
    <nav className='topnav'>
      <div className='left-section'>
        <Link to="/" className="logo-link">
          <img src={HauntedHouseLogo} alt="Haunted House Logo" className="logo" />
        </Link>
        <NavLink to="/" className="site-name">Holiday Havens</NavLink>
      </div>
      {isLoaded && (
        <div className='right-section'>
          {sessionUser && (
            <NavLink to="/spots/new" className="create-spot-link">Create a New Spot</NavLink>
          )}
          {sessionUser && userHasSpots && (
            <NavLink to="/spots/manage" className="manage-spots-link">
              Manage Spots
            </NavLink>
          )}
          <ProfileButton user={sessionUser} navigate={navigate} />
        </div>
      )}    
    </nav>
  );
}

export default Navigation;
