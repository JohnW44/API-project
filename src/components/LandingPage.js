import React from 'react';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header>
        <nav>
          <div className="logo">Airbnb</div>
          <div className="nav-links">
            <a href="#become-a-host">Become a host</a>
            <a href="#help">Help</a>
            <a href="#sign-up">Sign up</a>
            <a href="#log-in">Log in</a>
          </div>
        </nav>
      </header>
      
      <main>
        <h1>Book unique homes and experiences.</h1>
        <div className="search-bar">
          <input type="text" placeholder="Where" />
          <input type="date" placeholder="Check In" />
          <input type="date" placeholder="Check Out" />
          <input type="number" placeholder="Guests" min="1" />
          <button>Search</button>
        </div>
      </main>
      
      <section className="featured-listings">
        <h2>Featured Listings</h2>
        {/* Add featured listings here */}
      </section>
      
      <footer>
        <p>&copy; 2023 Airbnb, Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
