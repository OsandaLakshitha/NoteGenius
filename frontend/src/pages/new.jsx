import React from 'react';

const NoteyLandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="px-4 py-4 flex justify-between items-center bg-white shadow-sm">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
            <span className="text-white text-xl">✓</span>
          </div>
          <span className="ml-2 text-xl font-bold">Notey</span>
        </div>
        <div className="flex items-center space-x-6">
          <a href="#" className="text-gray-600 hover:text-gray-900">Home</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Products</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300">
            Sign Up
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Left Column */}
          <div className="w-full md:w-1/2">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              Introducing<br />
              Our Note-
            </h1>
            <p className="text-gray-700 mb-6">
              Unleash your creativity and boost your productivity with our
              comprehensive note-taking application. Organize your thoughts, capture
              ideas.
            </p>
            <div className="relative">
              <img 
                src="https://img.freepik.com/free-photo/notepad-with-smart-phone-office-wooden-table_1253-1439.jpg?t=st=1742724393~exp=1742727993~hmac=bb826bdcd853fec2723bfde749e2fbc6bd9af7107c549bbc3fd47577a1e8f627&w=1380" 
                alt="Hand writing on notebook" 
                className="w-full rounded-lg shadow-lg" 
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full md:w-1/2 bg-white p-8 rounded-xl shadow-xl">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
                <div className="text-xs text-gray-400">NOTEY-APP</div>
              </div>
              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="font-semibold text-gray-800">Premium tools</div>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="space-y-4">
              <FeatureCard 
                color="bg-amber-100" 
                title="Seamless organization, effortless note-taking, and secure data storage" 
                subtitle="- all in one place" 
              />
              
              <FeatureCard 
                color="bg-gray-800" 
                title="Harness the power of our note-taking app to stay on top of your tasks, meetings" 
                dark={true}
              />
              
              <FeatureCard 
                color="bg-amber-200" 
                title="Embrace a digital solution that adapts to your needs, empowering you to work smarter and achieve more" 
              />
              
              <FeatureCard 
                color="bg-gray-100" 
                title="Simplify your note-taking experience and unlock new levels of productivity with our cutting-" 
              />
              
              <FeatureCard 
                color="bg-amber-50" 
                title="Revolutionize the way you capture, organize, and access your ideas with our user-friendly interface" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ color, title, subtitle, dark = false }) => {
  return (
    <div className="flex items-start space-x-3">
      <div className={`w-12 h-12 ${color} rounded-md flex-shrink-0`}></div>
      <div>
        <p className={`text-sm ${dark ? 'text-white' : 'text-gray-700'}`}>
          {title}
        </p>
        {subtitle && (
          <p className="text-sm text-blue-500">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default NoteyLandingPage;