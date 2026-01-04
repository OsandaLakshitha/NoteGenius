import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      <Navbar />  {/* Navbar should always be visible */}
      <main className="pt-20">
        <Outlet />  {/* This will render the page component */}
      </main>
      <Footer />  {/* Footer should always be visible */}
    </div>
  );
};

export default Layout;
