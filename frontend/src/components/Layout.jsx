import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      <Navbar />  {/* Navbar is always visible */}
      <main className="min-h-screen">
        <Outlet /> {/* Renders the current route's component */}
      </main>
      <Footer />  {/* Footer is always visible */}
    </div>
  );
};

export default Layout;
