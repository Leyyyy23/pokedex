import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();
  
    return (
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/">
            <img src="/pokeball.png" alt="Pokédex" />
            <span>Pokédex</span>
          </Link>
        </div>
      
        <ul className="navbar-links">
          <li className={location.pathname === '/' ? 'active' : ''}>
            <Link to="/">Home</Link>
          </li>
          <li className={location.pathname === '/pokemon' ? 'active' : ''}>
            <Link to="/pokemon">Browse</Link>
          </li>
          <li className={location.pathname === '/team' ? 'active' : ''}>
            <Link to="/team">Team</Link>
          </li>
          <li className={location.pathname.startsWith('/battle') ? 'active' : ''}>
            <Link to="/battle">Battle</Link>
          </li>
        </ul>
      </nav>
    );
};

export default Navbar;