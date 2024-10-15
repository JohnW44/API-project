// import HauntedHouseLogo from '../../../../images/Gcds-Halloween-Haunted-house.ico';     
import './LandingPage.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpots } from '../../store/spots';

  function LandingPage() {
    const dispatch = useDispatch();
    const spots = useSelector(state => state.spots.all);

    useEffect(() => {
      dispatch(fetchSpots());
    }, [dispatch]);

    if (!spots) {
      return <div>Loading...</div>;
    }

  return (
    <div className="landing-page">
      <header>
      </header>
      
      <main>
        <h1>Find spooky places to stay</h1>
        <p>Discover haunted homes and eerie rooms perfect for your next adventure.</p>
        <div className="search-bar">
          <input type="text" placeholder="Anywhere" />
          <input type="text" placeholder="Any week" />
          <input type="text" placeholder="Add guests" />
          <button>Search</button>
        </div>
      </main>
      
      <section className="featured-listings">
        <h2>Explore SpookySpots</h2>
        <div className="listings-grid">
          {spots.map((spot) => (
            <div key={spot.id} className="listing-card">
              <div className="listing-image">
                {/* Replace with actual image */}
                <div className="placeholder-image"></div>
              </div>
              <div className="listing-info">
                <div className="listing-location">
                  {spot.city}, {spot.state}
                </div>
                <div className="listing-price">
                  ${spot.price} / night
                </div>
                <div className="listing-rating">
                   {spot.rating}
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
