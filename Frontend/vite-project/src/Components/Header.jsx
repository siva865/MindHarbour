// Header.jsx

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Header({ onBookSession }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  const mobileMenuVariants = {
    open: { x: 0, opacity: 1, transition: { duration: 0.3 } },
    closed: { x: "-100%", opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Mind Harbour</h1>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6 text-gray-700 font-medium">
            <a href="#Hero" className="hover:text-blue-600">Home</a>
            <a href="#Services" className="hover:text-blue-600">Services</a>
            <a href="#AboutMe" className="hover:text-blue-600">About Us</a>
            <button 
              onClick={onBookSession} 
              className="hover:text-blue-600 focus:outline-none"
            >
              Book a session
            </button>
            <a href="#ContactForm" className="hover:text-blue-600">Contact Us</a>
            <a href="#FAQsSection" className="hover:text-blue-600">FAQs</a>
          </nav>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-800 focus:outline-none">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-xl px-6 pt-20"
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {/* Close X Button */}
            <button
              onClick={toggleMenu}
              className="absolute top-4 right-4 text-gray-700"
            >
              <X size={24} />
            </button>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col space-y-6 text-black font-semibold text-lg">
              <a href="#Hero" onClick={toggleMenu}>Home</a>
              <a href="#Services" onClick={toggleMenu}>Services</a>
              <a href="#AboutMe" onClick={toggleMenu}>About Us</a>
              <button 
                onClick={() => {
                  toggleMenu();
                  onBookSession();
                }}
                className="text-left"
              >
                Book a session
              </button>
              <a href="#ContactForm" onClick={toggleMenu}>Contact Us</a>
              <a href="#FAQsSection" onClick={toggleMenu}>FAQs</a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tablet View */}
      <nav className="hidden lg:hidden md:flex justify-center py-4 bg-white border-b shadow-sm text-gray-700 font-medium">
        <div className="flex space-x-6">
          <a href="#Hero" className="hover:text-blue-600">Home</a>
          <a href="#Services" className="hover:text-blue-600">Services</a>
          <a href="#AboutMe" className="hover:text-blue-600">About Us</a>
          <button 
            onClick={onBookSession} 
            className="hover:text-blue-600 focus:outline-none"
          >
            Book a session
          </button>
          <a href="#ContactForm" className="hover:text-blue-600">Contact Us</a>
          <a href="#FAQsSection" className="hover:text-blue-600">FAQs</a>
        </div>
      </nav>
    </header>
  );
}

export default Header;
