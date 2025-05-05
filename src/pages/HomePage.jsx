import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUsers, FaGamepad } from 'react-icons/fa';

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to the Pokédex App!</h1>
          <p className="hero-subtitle">Browse Pokémon, build your dream team, and battle with friends.</p>
          <div className="hero-buttons">
            <Link to="/pokemon" className="primary-button">
              Get Started
            </Link>
            <Link to="/battle" className="secondary-button">
              Battle Now
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="pokeball.png" alt="Pokémon" />
        </div>
      </div>
      
      <div className="features-section">
        <h2 className="section-title">Explore the World of Pokémon</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FaSearch />
            </div>
            <h3>Browse Pokémon</h3>
            <p>Explore hundreds of Pokémon and learn about their types, abilities, and stats. Find your favorites!</p>
            <Link to="/pokemon" className="feature-link">Browse Now</Link>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FaUsers />
            </div>
            <h2>Build Your Team</h2>
            <p>Create your dream team of up to six Pokémon with complementary strengths to dominate in battles.</p>
            <Link to="/team" className="feature-link">View Team</Link>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FaGamepad />
            </div>
            <h2>Battle</h2>
            <p>Test your team's strength in battles against other Pokémon. Challenge friends or battle against AI.</p>
            <Link to="/battle" className="feature-link">Battle Now</Link>
          </div>
        </div>
      </div>
      
      <div className="stats-section">
        <div className="stat-item">
          <span className="stat-number">800+</span>
          <span className="stat-label">Pokémon</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">18</span>
          <span className="stat-label">Types</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">∞</span>
          <span className="stat-label">Possible Teams</span>
        </div>
      </div>
      
      <div className="cta-section">
        <h2>Ready to Begin Your Pokémon Journey?</h2>
        <p>Start browsing Pokémon, build your team, and challenge others to battles!</p>
        <Link to="/pokemon" className="cta-button">Start Now</Link>
      </div>
    </div>
  );
};

export default HomePage;
