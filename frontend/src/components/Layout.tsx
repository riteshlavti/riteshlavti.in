import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const LOGO_FONTS = [
  { label: 'Poppins', value: 'Poppins, sans-serif', weight: 700 },
  { label: 'Space Grotesk', value: 'Space Grotesk, sans-serif', weight: 700 },
  { label: 'Outfit', value: 'Outfit, sans-serif', weight: 600 },
  { label: 'Sora', value: 'Sora, sans-serif', weight: 700 },
  { label: 'Syne', value: 'Syne, sans-serif', weight: 800 },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [underlineShown, setUnderlineShown] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white dark:bg-darkSurface shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16 px-4 sm:px-8 lg:px-20 relative">
            {/* Mobile menu button (left on mobile), hidden on desktop */}
            <div className="sm:hidden flex items-center flex-shrink-0">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {/* Hamburger icon */}
                <svg
                  className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                {/* Close icon */}
                <svg
                  className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile: Centered Logo/Name, Desktop: Left-aligned */}
            <div className="flex-1 flex items-center justify-center sm:justify-start">
              <Link to="/" className="group flex items-center space-x-3 mx-0 sm:mx-12">
                <motion.span
                  className="text-2xl font-extrabold text-primary-500 select-none"
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  aria-label="Logo code icon"
                >
                  {'</>'}
                </motion.span>
                <motion.div
                  className="relative flex flex-col items-start group"
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                >
                  <motion.span
                    className="text-2xl font-bold tracking-wider text-gray-900 dark:text-white z-10"
                    style={{ fontFamily: 'Kaushan Script, cursive', fontWeight: 700, display: 'inline-block' }}
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.2 }}
                  >
                    Ritesh Lavti
                  </motion.span>
                  <motion.span
                    className="absolute left-0 -bottom-1 w-full h-0.5 rounded-full z-0 bg-primary-500"
                    variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
                    transition={{ type: 'spring', stiffness: 80, damping: 18 }}
                    style={{ originX: 0, display: 'block' }}
                    aria-hidden="true"
                  />
                </motion.div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden sm:flex sm:items-center absolute left-1/2 transform -translate-x-1/2">
              <div className="bg-white dark:bg-darkSurface shadow-md rounded-full px-2 py-1 flex space-x-1 items-center">
                <Link 
                  to="/" 
                  className={`${
                    isActive('/') 
                      ? 'bg-primary-100 dark:bg-darkSurface text-primary-600 dark:text-darkPrimaryAccent' 
                      : 'text-gray-900 dark:text-darkTextPrimary hover:bg-primary-100 dark:hover:bg-darkSurface hover:text-primary-600 dark:hover:text-darkPrimaryAccent'
                  } px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-in-out transform hover:scale-105`}
                >
                  Home
                </Link>
                <Link 
                  to="/about" 
                  className={`${
                    isActive('/about') 
                      ? 'bg-primary-100 dark:bg-darkSurface text-primary-600 dark:text-darkPrimaryAccent' 
                      : 'text-gray-900 dark:text-darkTextPrimary hover:bg-primary-100 dark:hover:bg-darkSurface hover:text-primary-600 dark:hover:text-darkPrimaryAccent'
                  } px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-in-out transform hover:scale-105`}
                >
                  About
                </Link>
                <Link 
                  to="/blog" 
                  className={`${
                    isActive('/blog') 
                      ? 'bg-primary-100 dark:bg-darkSurface text-primary-600 dark:text-darkPrimaryAccent' 
                      : 'text-gray-900 dark:text-darkTextPrimary hover:bg-primary-100 dark:hover:bg-darkSurface hover:text-primary-600 dark:hover:text-darkPrimaryAccent'
                  } px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-in-out transform hover:scale-105`}
                >
                  Blog
                </Link>
                <Link 
                  to="/contact" 
                  className={`${
                    isActive('/contact') 
                      ? 'bg-primary-100 dark:bg-darkSurface text-primary-600 dark:text-darkPrimaryAccent' 
                      : 'text-gray-900 dark:text-darkTextPrimary hover:bg-primary-100 dark:hover:bg-darkSurface hover:text-primary-600 dark:hover:text-darkPrimaryAccent'
                  } px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-in-out transform hover:scale-105`}
                >
                  Contact
                </Link>
              </div>
            </div>

            {/* Theme Toggle: Only show on desktop */}
            <div className="hidden sm:flex items-center mx-0 sm:mx-12">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu sliding panel */}
      <div 
        className={`fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } sm:hidden`}
      >
        {/* Backdrop */}
        <div 
          className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Sliding panel */}
        <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white dark:bg-darkSurface shadow-xl">
          <div className="h-full flex flex-col py-6 px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-darkTextPrimary">Menu</h2>
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <span className="sr-only">Close menu</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <nav className="flex-1 space-y-4">
              <Link
                to="/"
                className="block px-4 py-2 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="block px-4 py-2 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/blog"
                className="block px-4 py-2 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                to="/contact"
                className="block px-4 py-2 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 px-8 sm:px-12 lg:px-16">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 shadow-lg mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-8 sm:px-12 lg:px-16">
          <p className="text-center text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Ritesh Lavti. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 