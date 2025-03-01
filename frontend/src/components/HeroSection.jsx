import React from 'react';
import { Link } from 'react-router-dom';
import heroImage1 from '../assets/hello1.jpg';
import heroImage2 from '../assets/hello2.avif';

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Welcome to NoteGenius</h1>
        <p>Transform your handwritten or voice-recorded notes into structured, organized text with the power of AI.</p>
        <div className="cta-buttons">
          <Link to="/handwritten">
            <button className="cta-button">Try Handwritten Notes</button>
          </Link>
          {/* Link to Voice Notes page */}
          <Link to="/voice">
            <button className="cta-button">Try Voice Notes</button>
          </Link>
        </div>
      </div>
      <div className="hero-image">
      <img src={heroImage2} alt="NoteGenius" />
      </div>
    </section>
  );
};

export default HeroSection;