import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeatureSection from '../components/FeatureSection';
import AboutSection from '../components/AboutSection';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="home">
      <Navbar />
      <HeroSection />
      <FeatureSection />
      <AboutSection />
      <Footer />
    </div>
  );
};

export default Home;