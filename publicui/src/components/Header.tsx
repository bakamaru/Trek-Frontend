import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
import MegaMenu from './MegaMenu';
import { Link } from 'react-router-dom';
import { ThemeToggleButton } from "./common/ThemeToggleButton";
import { useGetMainNavigationQuery } from '../redux/api/menuAPI';
import { useGetUserProfileQuery } from '../redux/user/userAPI';
import helper from '../utils/AuthHelper';

export const RouterContext = React.createContext({
  path: '/',
  navigate: (path: string) => { },
});

type ApiMenuItem = {
  MenuId: number;
  Name: string;
  Url: string;
  MenuOrder: number;
  // other fields exist but we don't need them here
};

const Header: React.FC = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { path } = useContext(RouterContext);
  const { data: menuData, isLoading: menuLoading } = useGetMainNavigationQuery(undefined);

  const userMenuRef = useRef<HTMLDivElement>(null);

  // Authenticate status using Helper
  const isLoggedIn = helper.isLoggedIn();
  const tokenProfile = helper.getUserProfile();

  // Fetch full profile from API if logged in
  const { data: apiProfileResponse } = useGetUserProfileQuery(undefined, {
    skip: !isLoggedIn,
  });

  const userProfile = apiProfileResponse?.Data || tokenProfile;

  // Sort menu items by MenuOrder
  const sortedMenuItems: ApiMenuItem[] = useMemo(() => {
    const items = (menuData?.Data as ApiMenuItem[] | undefined) ?? [];
    return [...items].sort((a, b) => a.MenuOrder - b.MenuOrder);
  }, [menuData]);


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

  const renderNavLink = (item: ApiMenuItem, index: number) => {
    // Only "Tour & Treks" should display MegaMenu
    if (item.Name === "Tour & Treks") {
      return (
        <div key={item.MenuId} className="group relative">
          <span className={`${getLinkClassName(item.Url || '#')} cursor-pointer flex items-center`}>
            {item.Name}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 pt-4 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300">
            <MegaMenu items={[]} />
          </div>
        </div>
      );
    }

    // Normal menu item
    return (
      <Link
        key={item.MenuId}
        to={item.Url}
        className={getLinkClassName(item.Url)}
      >
        {item.Name}
      </Link>
    );
  };

  // Helper to get initials
  const getInitials = () => {
    const first = userProfile?.FirstName || userProfile?.firstname || "";
    const last = userProfile?.LastName || userProfile?.surname || "";
    // Ensure we account for empty strings to avoid showing nothing if only one name exists
    if (!first && !last) return "U";
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  };

  const displayName = userProfile?.FirstName
    ? `${userProfile.FirstName} ${userProfile.LastName || ''}`
    : (userProfile?.name || "User");

  const profilePicture = userProfile?.ProfilePicture || userProfile?.picture;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isSticky ? 'bg-white shadow-md dark:bg-gray-800' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="text-3xl font-extrabold text-gray-800 dark:text-white">
            Territory <span className="text-blue-700">Himalaya</span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-8">
            {sortedMenuItems.map(renderNavLink)}
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <ThemeToggleButton />

            {isLoggedIn ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt="User"
                      className="w-10 h-10 rounded-full border-2 border-transparent hover:border-blue-700 transition object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center border-2 border-transparent hover:border-blue-700 transition">
                      <span className="text-blue-700 dark:text-blue-200 font-bold text-sm">
                        {getInitials()}
                      </span>
                    </div>
                  )}

                  {/* Dropdown Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 text-gray-600 dark:text-gray-300 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-20 ring-1 ring-black ring-opacity-5 animate-fadeIn">
                    <div className="px-4 py-2 border-b dark:border-gray-600">
                      <p className="text-sm text-gray-700 dark:text-gray-200">Signed in as</p>
                      <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                        {displayName}
                      </p>
                    </div>
                    <Link
                      to="/user/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/user/dashboard/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsUserMenuOpen(false);
                        helper.Logout();
                        window.location.href = "/signin";
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                      Logout
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/signin"
                className="bg-blue-700 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-800 transition-colors duration-300"
              >
                Login
              </Link>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden"
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-8 w-8 transition-colors ${isSticky ? 'text-gray-800 dark:text-gray-300' : 'text-gray-800 dark:text-white'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden bg-white dark:bg-gray-800`}
      >
        <nav className="flex flex-col p-4 space-y-2">
          {isLoggedIn ? (
            <Link
              to="/user/dashboard"
              className="w-full text-center bg-blue-700 text-white px-6 py-3 mt-2 rounded-md font-semibold hover:bg-blue-800 transition-colors duration-300"
            >
              My Account
            </Link>
          ) : (
            <Link
              to="/signin"
              className="w-full text-center bg-blue-700 text-white px-6 py-3 mt-2 rounded-md font-semibold hover:bg-blue-800 transition-colors duration-300"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
