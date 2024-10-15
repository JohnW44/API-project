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
        <h1>Find places to stay on Airbnb</h1>
        <p>Discover entire homes and private rooms perfect for any trip.</p>
        <div className="search-bar">
          <input type="text" placeholder="Anywhere" />
          <input type="text" placeholder="Any week" />
          <input type="text" placeholder="Add guests" />
          <button>Search</button>
        </div>
      </main>
      
      <section className="featured-listings">
        <h2>Explore Airbnb</h2>
        {/* Add featured categories or listings here */}
      </section>
    </div>
  );
};

export default LandingPage;
