// frontend/src/components/Navigation/Navigation.jsx
import './Navigation.css';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import HauntedHouseLogo from '../../../../images/SpookySpots-logo2.png';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const navigate = useNavigate();

  return (
    <nav className='topnav'>
      <div className='left-section'>
        <Link to="/" className="logo-link">
          <img src={HauntedHouseLogo} alt="Haunted House Logo" className="logo" />
        </Link>
        <NavLink to="/" className="site-name">SpookySpots</NavLink>
      </div>
      <div className='center-section'>
        {sessionUser && (
          <NavLink to="/spots/new" className="nav-link">Create a New Spot</NavLink>
        )}
      </div>
      {isLoaded && (
        <div className='right-section'>
          <ProfileButton user={sessionUser} navigate={navigate} />
        </div>
      )}    
    </nav>
  );
}

export default Navigation;
