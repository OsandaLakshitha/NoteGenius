import React from 'react';
import { Link } from 'react-router-dom';
import heroImage1 from '../assets/hello1.jpg';
import heroImage2 from '../assets/hello2.avif';
import { Button } from '@mui/material';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-gray-50 min-h-screen">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-100 rounded-full opacity-40 blur-3xl"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-16 flex flex-col md:flex-row items-center justify-between">
        {/* Hero Content */}
        <div className="max-w-2xl text-center md:text-left md:mr-12 mb-12 md:mb-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Transform Your <span className="text-indigo-600">Notes</span> Into Organized Knowledge
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            NoteGenius uses advanced AI to convert your handwritten or voice-recorded notes into 
            structured, searchable text — helping you capture ideas and stay organized effortlessly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link to="/handwritten" className="w-full sm:w-auto">
              <Button 
                variant="contained" 
                color="primary"
                size="large"
                sx={{ 
                  borderRadius: '8px',
                  padding: '10px 24px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.4)'
                }}
              >
                Try Handwritten Notes
              </Button>
            </Link>
            <Link to="/voice" className="w-full sm:w-auto">
              <Button 
                variant="outlined" 
                color="primary"
                size="large"
                sx={{ 
                  borderRadius: '8px',
                  padding: '10px 24px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderWidth: '2px',
                  '&:hover': {
                    borderWidth: '2px'
                  }
                }}
              >
                Try Voice Notes
              </Button>
            </Link>
          </div>
          
          
        </div>

        {/* Hero Image with Floating Elements */}
        <div className="relative max-w-lg w-full">
          <div className="relative z-10">
            <img
              src={heroImage2}
              alt="NoteGenius in action"
              className="rounded-2xl shadow-2xl w-full h-auto"
            />
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-4 -left-10 bg-white p-4 rounded-xl shadow-lg z-20">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-800">99% Accuracy</span>
            </div>
          </div>
          
          <div className="absolute bottom-4 -right-10 bg-white p-4 rounded-xl shadow-lg z-20">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-800">Instant Results</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;