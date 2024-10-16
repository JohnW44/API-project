// frontend/src/components/Navigation/Navigation.jsx

import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import HauntedHouseLogo from '../../../../images/Gcds-Halloween-Haunted-house.ico';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav className='topnav'>
      <div className='left-section'>
        <img src={HauntedHouseLogo} alt="Haunted House Logo" className="logo" />
        <NavLink to="/" className="site-name">SpookySpots</NavLink>
      </div>
      <div className='center-section'>
        <Link to="/spots" className="nav-link">All Spots</Link>
        {sessionUser && <Link to="/spots/new" className="nav-link">Create a Spot</Link>}
      </div>
      {isLoaded && (
        <div className='right-section'>
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </nav>
  );
}


export default Navigation;
