import React from 'react';

const FeatureSection = () => {
  return (
    <section className="features">
      <h2>Why Choose NoteGenius?</h2>
      <div className="feature-cards">
        <div className="feature-card">
          <h3>Handwritten Notes</h3>
          <p>Convert your handwritten notes into digital, structured text effortlessly.</p>
          <button className="cta-button">Learn More</button>
        </div>
        <div className="feature-card">
          <h3>Voice Notes</h3>
          <p>Transform your voice recordings into clear, organized text.</p>
          <button className="cta-button">Learn More</button>
        </div>
        <div className="feature-card">
          <h3>Structured Text</h3>
          <p>Organize your notes into structured formats for better readability.</p>
          <button className="cta-button">Learn More</button>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;