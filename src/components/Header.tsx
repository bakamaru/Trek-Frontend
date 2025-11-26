import React, { useState, useEffect, useContext, useRef } from 'react';
import { NAV_LINKS, USER_PROFILE_DATA } from '../const/constants';
import { NavLink as NavLinkType } from '../types/types';
import MegaMenu from './MegaMenu';
import { Link } from 'react-router-dom';
import { ThemeToggleButton } from "./common/ThemeToggleButton";

export const RouterContext = React.createContext({
  path: '/',
  navigate: (path: string) => {},
});

const Header: React.FC = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { path } = useContext(RouterContext);

  //const { theme, toggleTheme } = useContext(ThemeContext);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);

    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
        window.removeEventListener('scroll', handleScroll);
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getLinkClassName = (href: string) => {
    const baseClass = `font-semibold transition-colors duration-300`;
    const colorClass = isSticky || isMenuOpen 
      ? 'text-gray-700 hover:text-blue-700 dark:text-gray-300 dark:hover:text-blue-400' 
      : 'text-gray-800 hover:text-blue-700 dark:text-white dark:hover:text-blue-400';
    const activeClass = path === href ? 'text-blue-700 dark:text-blue-400' : '';
    return `${baseClass} ${colorClass} ${activeClass}`;
  };

  const renderNavLink = (link: NavLinkType, index: number) => {
    if (link.megaMenu) {
        return (
            <div key={index} className="group relative">
                <span className={`${getLinkClassName('#')} cursor-pointer flex items-center`}>
                    {link.label}
                    <svg xmlns="http://www.w.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 pt-4 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300">
                    <MegaMenu items={link.megaMenu} />
                </div>
            </div>
        )
    }
    return <Link key={index} to={link.href} className={getLinkClassName(link.href)}>{link.label}</Link>
  }
  
  const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
  const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isSticky ? 'bg-white shadow-md dark:bg-gray-800' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="text-3xl font-extrabold text-gray-800 dark:text-white">
            Heavenly<span className="text-blue-700">Pathways</span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-8">
            {NAV_LINKS.map(renderNavLink)}
          </nav>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
             {/* <button onClick={toggleTheme} className={`p-2 rounded-full transition-colors ${isSticky ? 'text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700' : 'text-gray-800 dark:text-white hover:bg-black/10 dark:hover:bg-white/20'}`} aria-label="Toggle theme">
               {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button> */}
              <ThemeToggleButton />
            <div className="relative" ref={userMenuRef}>
              <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="block focus:outline-none">
                <img src={USER_PROFILE_DATA.profilePicture} alt="User" className="w-10 h-10 rounded-full border-2 border-transparent hover:border-blue-700 transition" />
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-20 ring-1 ring-black ring-opacity-5">
                  <div className="px-4 py-2 border-b dark:border-gray-600">
                    <p className="text-sm text-gray-700 dark:text-gray-200">Signed in as</p>
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">{USER_PROFILE_DATA.name}</p>
                  </div>
                  <Link to="/user/dashboard/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600" onClick={() => setIsUserMenuOpen(false)}>Dashboard</Link>
                  <Link to="/user/dashboard/dashboard/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600" onClick={() => setIsUserMenuOpen(false)}>My Profile</Link>
                  <a href="#" onClick={(e) => {e.preventDefault(); setIsUserMenuOpen(false);}} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600">Logout</a>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden"
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 transition-colors ${isSticky ? 'text-gray-800 dark:text-gray-300' : 'text-gray-800 dark:text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`lg:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden bg-white dark:bg-gray-800`}>
          <nav className="flex flex-col p-4 space-y-2">
            {NAV_LINKS.map((link) => (
              // Basic mobile menu, doesn't support megamenu dropdowns
              <Link key={link.label} to={link.href === '#' ? '' : link.href} className="font-semibold text-gray-700 hover:text-blue-700 dark:text-gray-300 dark:hover:text-blue-400 p-2 rounded">
                {link.label}
              </Link>
            ))}
             <Link to="/user/dashboard/dashboard" className="w-full text-center bg-blue-700 text-white px-6 py-3 mt-2 rounded-md font-semibold hover:bg-blue-800 transition-colors duration-300">
              My Account
            </Link>
          </nav>
        </div>
    </header>
  );
};

export default Header;