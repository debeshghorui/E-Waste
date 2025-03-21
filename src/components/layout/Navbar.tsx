"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaCog, FaRecycle, FaLeaf, FaHome, FaChartLine, FaCaretDown, FaQuestionCircle, FaInfoCircle, FaBlog, FaChevronRight, FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isAboutMenuOpen, setIsAboutMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const aboutMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Check if we're on the data destruction page to use blue theme
  const isDataDestructionPage = pathname?.includes('/services/data-destruction') || false;
  // Check if we're on the home page
  const isHomePage = pathname === '/';
  // Check if we're on login or signup pages
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const themeColor = isDataDestructionPage ? 'blue' : 'green';

  // Mount check
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    if (!isMounted) return;
    
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMounted]);

  // Close menus when clicking outside
  useEffect(() => {
    if (!isMounted) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (aboutMenuRef.current && !aboutMenuRef.current.contains(event.target as Node)) {
        setIsAboutMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMounted]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    if (isAboutMenuOpen) setIsAboutMenuOpen(false);
  };

  const toggleAboutMenu = () => {
    setIsAboutMenuOpen(!isAboutMenuOpen);
    if (isProfileMenuOpen) setIsProfileMenuOpen(false);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // Handle initial SSR render
  if (!isMounted) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 h-16">
        <div className={`absolute inset-0 ${
          isDataDestructionPage 
            ? 'bg-blue-600' 
            : 'bg-gradient-to-br from-black via-gray-900 to-gray-800'
        } transition-all duration-300`}></div>
        <nav className="relative h-full transition-all duration-300 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Link href="/" className="flex-shrink-0 flex items-center">
                  <div className="w-10 h-10 relative mr-2 rounded-full">
                    <Image 
                      src="/logo.svg" 
                      alt="EcoNirvana Logo" 
                      width={40}
                      height={40}
                      priority
                      className="w-full h-full"
                    />
                  </div>
                  <span className="text-xl font-bold text-white">
                    EcoNirvana
                  </span>
                </Link>
              </div>
              <div className="hidden md:flex md:items-center md:space-x-1"></div>
              <div className="md:hidden flex items-center"></div>
            </div>
          </div>
        </nav>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-16">
      {/* Background that extends full width/height with no gaps */}
      <div className={`absolute inset-0 ${
        isDataDestructionPage 
          ? 'bg-blue-600' 
          : 'bg-gradient-to-br from-black via-gray-900 to-gray-800'
      } transition-all duration-300`}>
        {/* Conditional overlay for scrolled state */}
        {scrolled && (
          <div className={`absolute inset-0 ${
            isDataDestructionPage 
              ? 'bg-blue-700/50' 
              : 'bg-gray-900'
          } shadow-lg shadow-black/30`}></div>
        )}
      </div>
      
      <nav className="relative h-full transition-all duration-300 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <div className={`w-10 h-10 relative mr-2 rounded-full ${
                  isDataDestructionPage ? 'bg-white p-2' : ''
                }`}>
                  <Image 
                    src="/logo.svg" 
                    alt="EcoNirvana Logo" 
                    width={40}
                    height={40}
                    priority
                    className="w-full h-full"
                  />
                </div>
                <span className="text-xl font-bold text-white">
                  EcoNirvana
                </span>
              </Link>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden md:flex md:items-center md:space-x-1">              
              {!isHomePage && !isAuthPage && (
                <form onSubmit={handleSearch} className="relative mr-2">
                  <div className="flex items-center bg-gray-800 rounded-lg overflow-hidden">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-transparent text-white px-3 py-1.5 text-sm focus:outline-none w-32 lg:w-40"
                    />
                    <button
                      type="submit"
                      className="p-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white"
                      aria-label="Search"
                    >
                      <FaSearch className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              )}
              
              {user && (
                <>
                  <Link 
                    href="/dashboard" 
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      scrolled 
                        ? `text-gray-300 hover:text-green-400 hover:bg-gray-800` 
                        : `text-white hover:bg-gray-800`
                    }`}
                  >
                    <FaHome className="mr-1.5 h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link 
                    href="/recycle" 
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      scrolled 
                        ? `text-gray-300 hover:text-green-400 hover:bg-gray-800` 
                        : `text-white hover:bg-gray-800`
                    }`}
                  >
                    <FaRecycle className="mr-1.5 h-4 w-4" />
                    Recycle
                  </Link>
                  <Link 
                    href="/rewards" 
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      scrolled 
                        ? `text-gray-300 hover:text-green-400 hover:bg-gray-800` 
                        : `text-white hover:bg-gray-800`
                    }`}
                  >
                    <FaChartLine className="mr-1.5 h-4 w-4" />
                    Rewards
                  </Link>
                </>
              )}
              
              {/* About Dropdown Menu - Only shown when not on the home page */}
              {!isHomePage && (
                <div className="relative" ref={aboutMenuRef}>
                  <button
                    onClick={toggleAboutMenu}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      scrolled 
                        ? `text-gray-300 hover:text-green-400 hover:bg-gray-800` 
                        : `text-white hover:bg-gray-800`
                    }`}
                  >
                    <FaInfoCircle className="mr-1.5 h-4 w-4" />
                    About
                    <FaCaretDown className="ml-1 h-3 w-3" />
                  </button>
                  
                  <AnimatePresence>
                    {isAboutMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-1 w-48 bg-gray-800 rounded-md shadow-lg z-50 overflow-hidden"
                      >
                        <div className="py-1">
                          <Link
                            href="/about"
                            className="flex items-center justify-between px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                            onClick={() => setIsAboutMenuOpen(false)}
                          >
                            <div className="flex items-center">
                              <FaInfoCircle className="mr-2 h-4 w-4" />
                              Who we are
                            </div>
                            <FaChevronRight className="h-3 w-3 opacity-50" />
                          </Link>
                          <Link
                            href="/why-econirvana"
                            className="flex items-center justify-between px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                            onClick={() => setIsAboutMenuOpen(false)}
                          >
                            <div className="flex items-center">
                              <FaLeaf className="mr-2 h-4 w-4" />
                              Why EcoNirvana
                            </div>
                            <FaChevronRight className="h-3 w-3 opacity-50" />
                          </Link>
                          <Link
                            href="/blog"
                            className="flex items-center justify-between px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                            onClick={() => setIsAboutMenuOpen(false)}
                          >
                            <div className="flex items-center">
                              <FaBlog className="mr-2 h-4 w-4" />
                              Blog
                            </div>
                            <FaChevronRight className="h-3 w-3 opacity-50" />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
              
              {/* Individual Links for About section - Only shown on the home page */}
              {isHomePage && (
                <>
                  <Link 
                    href="/about" 
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      scrolled 
                        ? `text-gray-300 hover:text-green-400 hover:bg-gray-800` 
                        : `text-white hover:bg-gray-800`
                    }`}
                  >
                    <FaInfoCircle className="mr-1.5 h-4 w-4" />
                    Who We Are
                  </Link>
                  <Link 
                    href="/why-econirvana" 
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      scrolled 
                        ? `text-gray-300 hover:text-green-400 hover:bg-gray-800` 
                        : `text-white hover:bg-gray-800`
                    }`}
                  >
                    <FaLeaf className="mr-1.5 h-4 w-4" />
                    Why EcoNirvana
                  </Link>
                  <Link 
                    href="/blog" 
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      scrolled 
                        ? `text-gray-300 hover:text-green-400 hover:bg-gray-800` 
                        : `text-white hover:bg-gray-800`
                    }`}
                  >
                    <FaBlog className="mr-1.5 h-4 w-4" />
                    Blog
                  </Link>
                </>
              )}
              
              {/* Quiz Button */}
              <Link 
                href="/quiz" 
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  scrolled 
                    ? `text-gray-300 hover:text-green-400 hover:bg-gray-800` 
                    : `text-white hover:bg-gray-800`
                }`}
              >
                <FaQuestionCircle className="mr-1.5 h-4 w-4" />
                Quiz
              </Link>
              
              {user ? (
                <div className="relative ml-3" ref={profileMenuRef}>
                  <button
                    onClick={toggleProfileMenu}
                    className={`flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      scrolled 
                        ? `focus:ring-green-500 text-gray-300 focus:ring-offset-gray-900` 
                        : 'focus:ring-white text-white focus:ring-offset-black'
                    }`}
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className={`flex items-center bg-gray-800 rounded-full p-0.5`}>
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-700">
                        {user.name ? (
                          <div className="w-full h-full flex items-center justify-center text-lg font-medium bg-gray-700 text-white">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        ) : (
                          <FaUser className="w-full h-full p-1 text-white" />
                        )}
                      </div>
                      <span className="ml-2 mr-1 text-sm font-medium text-white">
                        {user.name.split(' ')[0]}
                      </span>
                      <svg 
                        className="h-4 w-4 text-gray-400" 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20" 
                        fill="currentColor" 
                        aria-hidden="true"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </button>
                  
                  {/* Profile dropdown menu */}
                  <AnimatePresence>
                    {isProfileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-black ring-1 ring-black ring-opacity-5 divide-y divide-gray-800"
                      >
                        <div className="py-1">
                          <Link
                            href="/settings"
                            className="group flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            <FaCog className="mr-3 h-4 w-4 text-gray-400 group-hover:text-white" />
                            Settings
                          </Link>
                        </div>
                        <div className="py-1">
                          <button
                            onClick={handleLogout}
                            className="group flex w-full items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                          >
                            <FaSignOutAlt className="mr-3 h-4 w-4 text-gray-400 group-hover:text-white" />
                            Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors border-2 border-green-200 ${
                      scrolled 
                        ? 'text-white hover:border-green-500' 
                        : 'text-white hover:border-green-500'
                    }`}
                  >
                    Log in
                  </Link>
                  <Link 
                    href="/signup" 
                    className={`ml-2 px-4 py-2 rounded-md text-sm font-medium transition-colors border-2 border-green-600 ${
                      scrolled 
                        ? 'bg-green-500 text-white hover:bg-green-400 hover:border-green-500' 
                        : 'bg-green-500 text-white hover:bg-green-400 hover:border-green-500'
                    }`}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className={`inline-flex items-center justify-center p-2 rounded-md ${
                  scrolled 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                    : 'text-white hover:bg-gray-800'
                } focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white`}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <FaTimes className="block h-6 w-6" />
                ) : (
                  <FaBars className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-black border-t border-gray-800"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {user ? (
                  <>
                    {!isHomePage && !isAuthPage && (
                      <form 
                        onSubmit={handleSearch} 
                        className="mb-2"
                      >
                        <div className="relative flex items-center bg-gray-800 rounded-lg overflow-hidden">
                          <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-grow bg-transparent text-white px-3 py-2 text-sm focus:outline-none"
                          />
                          <button
                            type="submit"
                            className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white"
                            aria-label="Search"
                          >
                            <FaSearch className="h-4 w-4" />
                          </button>
                        </div>
                      </form>
                    )}
                    <Link
                      href="/dashboard"
                      className="flex items-center text-gray-300 hover:bg-gray-800 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaHome className="mr-2 h-5 w-5" />
                      Dashboard
                    </Link>
                    <Link
                      href="/recycle"
                      className="flex items-center text-gray-300 hover:bg-gray-800 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaRecycle className="mr-2 h-5 w-5" />
                      Recycle
                    </Link>
                    <Link
                      href="/rewards"
                      className="flex items-center text-gray-300 hover:bg-gray-800 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaChartLine className="mr-2 h-5 w-5" />
                      Rewards
                    </Link>
                    
                    {/* Mobile About submenu - Only shown when not on the home page */}
                    {!isHomePage && (
                      <div className="border-t border-gray-700 pt-2 mt-2">
                        <div className="px-3 py-1 text-xs text-gray-500 uppercase tracking-wider">
                          About
                        </div>
                        <Link
                          href="/about"
                          className="flex items-center text-gray-300 hover:bg-gray-800 hover:text-white block px-3 py-2 rounded-md text-base font-medium pl-6"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <FaInfoCircle className="mr-2 h-5 w-5" />
                          Who we are
                        </Link>
                        <Link
                          href="/why-econirvana"
                          className="flex items-center text-gray-300 hover:bg-gray-800 hover:text-white block px-3 py-2 rounded-md text-base font-medium pl-6"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <FaLeaf className="mr-2 h-5 w-5" />
                          Why EcoNirvana
                        </Link>
                        <Link
                          href="/blog"
                          className="flex items-center text-gray-300 hover:bg-gray-800 hover:text-white block px-3 py-2 rounded-md text-base font-medium pl-6"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <FaBlog className="mr-2 h-5 w-5" />
                          Blog
                        </Link>
                      </div>
                    )}
                    
                    {/* Mobile About links for home page */}
                    {isHomePage && (
                      <>
                        <Link
                          href="/about"
                          className="flex items-center text-gray-300 hover:bg-gray-800 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <FaInfoCircle className="mr-2 h-5 w-5" />
                          Who We Are
                        </Link>
                        <Link
                          href="/why-econirvana"
                          className="flex items-center text-gray-300 hover:bg-gray-800 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <FaLeaf className="mr-2 h-5 w-5" />
                          Why EcoNirvana
                        </Link>
                        <Link
                          href="/blog"
                          className="flex items-center text-gray-300 hover:bg-gray-800 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <FaBlog className="mr-2 h-5 w-5" />
                          Blog
                        </Link>
                      </>
                    )}
                    
                    {/* Mobile Quiz Link */}
                    <Link
                      href="/quiz"
                      className="flex items-center text-gray-300 hover:bg-gray-800 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaQuestionCircle className="mr-2 h-5 w-5" />
                      Quiz
                    </Link>
                    
                    <Link
                      href="/settings"
                      className="flex items-center text-gray-300 hover:bg-gray-800 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaCog className="mr-2 h-5 w-5" />
                      Settings
                    </Link>
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center w-full text-left text-gray-300 hover:bg-gray-800 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    >
                      <FaSignOutAlt className="mr-2 h-5 w-5" />
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    {!isHomePage && !isAuthPage && (
                      <form 
                        onSubmit={handleSearch} 
                        className="mb-2"
                      >
                        <div className="relative flex items-center bg-gray-800 rounded-lg overflow-hidden">
                          <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-grow bg-transparent text-white px-3 py-2 text-sm focus:outline-none"
                          />
                          <button
                            type="submit"
                            className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white"
                            aria-label="Search"
                          >
                            <FaSearch className="h-4 w-4" />
                          </button>
                        </div>
                      </form>
                    )}
                    <Link
                      href="/about"
                      className="flex items-center text-gray-300 hover:bg-gray-800 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaInfoCircle className="mr-2 h-5 w-5" />
                      Who We Are
                    </Link>
                    <Link
                      href="/why-econirvana"
                      className="flex items-center text-gray-300 hover:bg-gray-800 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaLeaf className="mr-2 h-5 w-5" />
                      Why EcoNirvana
                    </Link>
                    <Link
                      href="/blog"
                      className="flex items-center text-gray-300 hover:bg-gray-800 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaBlog className="mr-2 h-5 w-5" />
                      Blog
                    </Link>
                    <Link
                      href="/quiz"
                      className="flex items-center text-gray-300 hover:bg-gray-800 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaQuestionCircle className="mr-2 h-5 w-5" />
                      Quiz
                    </Link>
                    <Link
                      href="/login"
                      className="flex items-center border-2 border-green-200 text-white hover:border-green-500 block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaUser className="mr-2 h-5 w-5" />
                      Log in
                    </Link>
                    <Link
                      href="/signup"
                      className="flex items-center bg-green-500 text-white hover:bg-green-400 block px-3 py-2 rounded-md text-base font-medium mt-2 border-2 border-green-600 hover:border-green-500"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaUser className="mr-2 h-5 w-5" />
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
};

export default Navbar; 