import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ background: '#333', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          My Library Bookie
        </Link>
        <div>
          <Link to="/" style={{ color: 'white', marginRight: '1rem' }}>Home</Link>
          <Link to="/login" style={{ color: 'white', marginRight: '1rem' }}>Login</Link>
          <Link to="/signup" style={{ color: 'white' }}>Sign Up</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;