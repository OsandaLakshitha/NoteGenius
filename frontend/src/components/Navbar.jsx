
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-indigo-600">
              NoteGenius
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <ul className="flex space-x-8 items-center">
              <li>
                <Link to="/" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/handwritten" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                  Handwritten Notes
                </Link>
              </li>
              <li>
                <Link to="/voice" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                  Voice Notes
                </Link>
              </li>
              <li>
                <Link to="/structured" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                  Structured Text
                </Link>
              </li>
              <li>
                <Link to="/folders" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                  Folders
                </Link>
              </li>
            </ul>
            
            {/* Login/Signup buttons */}
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-800 font-medium hover:text-indigo-600 transition-colors">
                Login
              </Link>
              <Link to="/signup" className="bg-indigo-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                Sign Up
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="outline-none"
            >
              {isMobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t mt-2 py-4 px-6 shadow-inner">
          <ul className="flex flex-col space-y-4">
            <li>
              <Link 
                to="/"
                className="text-gray-700 hover:text-indigo-600 font-medium block transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/handwritten"
                className="text-gray-700 hover:text-indigo-600 font-medium block transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Handwritten Notes
              </Link>
            </li>
            <li>
              <Link 
                to="/voice"
                className="text-gray-700 hover:text-indigo-600 font-medium block transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Voice Notes
              </Link>
            </li>
            <li>
              <Link 
                to="/structured"
                className="text-gray-700 hover:text-indigo-600 font-medium block transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Structured Text
              </Link>
            </li>
            <li>
              <Link 
                to="/folders"
                className="text-gray-700 hover:text-indigo-600 font-medium block transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Folders
              </Link>
            </li>
            <li className="pt-4 border-t">
              <div className="flex flex-col space-y-3">
                <Link 
                  to="/login"
                  className="text-gray-800 font-medium hover:text-indigo-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/signup"
                  className="bg-indigo-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};
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