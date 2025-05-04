import React, { useState, Suspense, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Points, PointMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo } from 'react';
import { Group } from 'three';
import { FaLinkedin, FaInstagram } from 'react-icons/fa';

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
  const menuRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Prevent background scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Trap focus and close on Esc
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const focusableSelectors = 'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
    const menu = menuRef.current;
    const focusableEls = menu ? Array.from(menu.querySelectorAll(focusableSelectors)) : [];
    const firstEl = focusableEls[0] as HTMLElement;
    const lastEl = focusableEls[focusableEls.length - 1] as HTMLElement;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      } else if (e.key === 'Tab' && menu) {
        if (focusableEls.length === 0) return;
        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    // Focus the first link
    setTimeout(() => { firstEl?.focus(); }, 0);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white dark:bg-darkSurface shadow-lg w-full">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between h-14 px-2 sm:h-16 sm:px-8 lg:px-20 relative w-full">
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
            <div className="flex-1 flex items-center justify-center sm:justify-start absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 sm:static sm:left-auto sm:top-auto sm:transform-none">
              <Link to="/" className="group flex items-center space-x-2 mx-0 sm:mx-12">
                <motion.span
                  className="text-xl sm:text-2xl font-extrabold text-primary-500 select-none"
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
                    className="text-lg sm:text-2xl font-bold tracking-wider text-gray-900 dark:text-white z-10"
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
                  className={
                    `${isActive('/blog') 
                      ? 'bg-primary-100 dark:bg-darkSurface text-primary-600 dark:text-darkPrimaryAccent' 
                      : 'text-gray-900 dark:text-darkTextPrimary hover:bg-primary-100 dark:hover:bg-darkSurface hover:text-primary-600 dark:hover:text-darkPrimaryAccent'} px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-in-out transform hover:scale-105`
                  }
                >
                  Blogs
                </Link>
                <Link 
                  to="/projects" 
                  className={
                    `${isActive('/projects') 
                      ? 'bg-primary-100 dark:bg-darkSurface text-primary-600 dark:text-darkPrimaryAccent' 
                      : 'text-gray-900 dark:text-darkTextPrimary hover:bg-primary-100 dark:hover:bg-darkSurface hover:text-primary-600 dark:hover:text-darkPrimaryAccent'} px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-in-out transform hover:scale-105`
                  }
                >
                  Projects
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
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black bg-opacity-50 sm:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            />
            {/* Sliding panel */}
            <motion.div
              key="panel"
              ref={menuRef}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 max-w-xs w-full h-full bg-white dark:bg-darkSurface shadow-2xl rounded-r-2xl z-50 flex flex-col justify-between py-3 px-2 sm:hidden focus:outline-none overflow-y-auto"
              role="dialog"
              aria-modal="true"
            >
              <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <h2 className="text-lg font-bold text-gray-900 dark:text-darkTextPrimary">Menu</h2>
                <div className="flex items-center space-x-2">
                  <ThemeToggle />
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none p-2 rounded-full focus:ring-2 focus:ring-primary-500"
                  >
                    <span className="sr-only">Close menu</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <nav className="flex-1 space-y-1 flex flex-col mt-1">
                {[
                  { to: '/', label: 'Home', icon: <span className='inline-block w-2 h-2 rounded-full bg-primary-500 mr-3'></span> },
                  { to: '/about', label: 'About', icon: <span className='inline-block w-2 h-2 rounded-full bg-primary-500 mr-3'></span> },
                  { to: '/blog', label: 'Blogs', icon: <span className='inline-block w-2 h-2 rounded-full bg-primary-500 mr-3'></span> },
                  { to: '/projects', label: 'Projects', icon: <span className='inline-block w-2 h-2 rounded-full bg-primary-500 mr-3'></span> },
                  { to: '/contact', label: 'Contact', icon: <span className='inline-block w-2 h-2 rounded-full bg-primary-500 mr-3'></span> },
                ].map((item, idx) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 * idx, type: 'spring', stiffness: 200, damping: 20 }}
                  >
                    <Link
                      to={item.to}
                      ref={idx === 0 ? firstLinkRef : undefined}
                      className="flex items-center px-4 py-3 text-base font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-darkSurface/70 hover:bg-primary-100 dark:hover:bg-gray-700 rounded-2xl shadow-sm transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-500 mb-1"
                      style={{ fontFamily: 'Inter, Poppins, sans-serif', letterSpacing: '0.01em' }}
                      onClick={() => setIsMobileMenuOpen(false)}
                      tabIndex={0}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              {/* Social Links at the bottom */}
              <div className="mt-4 flex flex-col items-center flex-shrink-0">
                <span className="text-xs text-gray-400 mb-1">Connect with me</span>
                <div className="flex space-x-4">
                  <a
                    href="https://www.linkedin.com/in/ritesh-lavti/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200 bg-gray-100 dark:bg-gray-800 p-3 rounded-full shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedin size={24} />
                  </a>
                  <a
                    href="https://www.instagram.com/ritesh__maheshwari/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-500 hover:text-pink-700 bg-gray-100 dark:bg-gray-800 p-3 rounded-full shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    aria-label="Instagram"
                  >
                    <FaInstagram size={24} />
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-3 px-2 sm:py-6 sm:px-12 lg:px-16 w-full">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative bg-white dark:bg-black shadow-lg mt-auto overflow-hidden">
        {/* Sparkling dots background for mobile only */}
        <div className="sm:hidden absolute inset-0 z-0">
          <StarsBackground numStars={80} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center py-3 px-2 sm:py-4 sm:px-12 lg:px-16 w-full">
          <div className="w-full flex justify-center mb-2">
            <div className="w-32 h-32 sm:w-60 sm:h-60" style={{ borderRadius: '50%', overflow: 'hidden', background: 'inherit' }}>
              <Canvas camera={{ position: [0, 0, 3] }}>
                <ambientLight intensity={0.7} />
                <directionalLight position={[2, 2, 2]} intensity={0.7} />
                <RotatingSphereWithSparkles />
                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.5} />
              </Canvas>
            </div>
          </div>
          <p className="text-center text-gray-500 dark:text-gray-400 text-xs sm:text-base">
            © {new Date().getFullYear()} Ritesh Lavti. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

// 3D Rotating Sphere with Sparkling Dots
function RotatingSphereWithSparkles() {
  const group = useRef<Group>(null);
  // Generate random points on a sphere
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 200; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      const r = 1.2 + Math.random() * 0.2;
      pts.push([
        2.2 * r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      ]);
    }
    return new Float32Array(pts.flat());
  }, []);
  return (
    <group ref={group}>
      {/* Hollow wireframe sphere with grid lines */}
      <mesh>
        <sphereGeometry args={[1.05, 32, 32]} />
        <meshBasicMaterial color="#e0e7ef" wireframe opacity={0.5} transparent />
      </mesh>
      <Sparkles
        count={350}
        scale={[4.5, 2.2, 2.2]}
        size={1.2}
        color="#fff8e1"
        speed={1.2}
        opacity={1}
      />
    </group>
  );
}

// Sparkling stars background for mobile footer (copied from Home)
type Star = {
  top: number;
  left: number;
  size: number;
  delay: number;
  vx: number;
  vy: number;
};
function StarsBackground({ numStars = 80 }) {
  const [stars, setStars] = React.useState<Star[]>([]);
  function isTooClose(newStar: Star, arr: Star[], minDist = 5) {
    return arr.some(star => {
      const dx = newStar.left - star.left;
      const dy = newStar.top - star.top;
      return Math.sqrt(dx * dx + dy * dy) < minDist;
    });
  }
  React.useEffect(() => {
    const arr: Star[] = [];
    let attempts = 0;
    while (arr.length < numStars && attempts < numStars * 20) {
      const candidate: Star = {
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 1 + Math.random() * 2,
        delay: Math.random() * 2,
        vx: (Math.random() - 0.5) * 0.03,
        vy: (Math.random() - 0.5) * 0.03,
      };
      if (!isTooClose(candidate, arr, 5)) {
        arr.push(candidate);
      }
      attempts++;
    }
    setStars(arr);
  }, [numStars]);
  React.useEffect(() => {
    let frame: number;
    function animate() {
      setStars(prevStars =>
        prevStars.map(star => {
          let newTop = star.top + star.vy;
          let newLeft = star.left + star.vx;
          if (newTop < 0) newTop = 100;
          if (newTop > 100) newTop = 0;
          if (newLeft < 0) newLeft = 100;
          if (newLeft > 100) newLeft = 0;
          return { ...star, top: newTop, left: newLeft };
        })
      );
      frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);
  return (
    <>
      <div className="absolute inset-0 pointer-events-none z-0">
        {stars.map((star, i) => (
          <div
            key={i}
            className="bg-white rounded-full opacity-80 animate-twinkle dark:bg-white"
            style={{
              position: 'absolute',
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              filter: 'blur(0.5px)',
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        .animate-twinkle {
          animation: twinkle 2.5s infinite ease-in-out;
        }
      `}</style>
    </>
  );
}

export default Layout; 