import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">NoteGenius</div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/handwritten">Handwritten Notes</Link></li>
        <li><Link to="/voice">Voice Notes</Link></li>
        <li><Link to="/structured">Structured Text</Link></li>
        <li><Link to="/folders">Folders</Link></li> {/* Corrected the link to folders */}
      </ul>
    </nav>
  );
};

export default Navbar;