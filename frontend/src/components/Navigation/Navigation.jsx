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
    <nav className='topnav'>
      <div className='left-section'>
        <Link to="/" className="logo-link" onMouseEnter={handleMouseEnter}>
          <img src={HauntedHouseLogo} alt="Haunted House Logo" className="logo" />
        </Link>
        <NavLink to="/" className="site-name" onMouseEnter={handleMouseEnter}>
          Holiday Havens
        </NavLink>
      </div>
      {isLoaded && (
        <div className='right-section'>
          {sessionUser && (
            <NavLink 
              to="/spots/new" 
              className="nav-button"
              onMouseEnter={handleMouseEnter}
            >
              Create a New Spot
            </NavLink>
          )}
          {sessionUser && userHasSpots && (
            <NavLink 
              to="/spots/manage" 
              className="nav-button"
              onMouseEnter={handleMouseEnter}
            >
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
