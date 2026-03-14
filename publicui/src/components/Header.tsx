import React, { useState, useEffect, useRef, useMemo } from 'react';
import MegaMenu from './MegaMenu';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggleButton } from "./common/ThemeToggleButton";
import { useGetMainNavigationQuery, useGetMegaMenuQuery } from '../redux/api/menuAPI';
import { useGetUserProfileQuery } from '../redux/user/userAPI';
import helper from '../utils/AuthHelper';
import { signin, signout } from '../utils/OIDCAuth';

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
  const [isMobileMegaMenuOpen, setIsMobileMegaMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const path = location.pathname;
  // Cache keys
  const MAIN_MENU_CACHE = 'main_menu_cache';
  const MEGA_MENU_CACHE = 'mega_menu_cache';

  // State for cached data
  const [cachedMenu, setCachedMenu] = useState<any[] | null>(() => {
    try {
      const saved = localStorage.getItem(MAIN_MENU_CACHE);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [cachedMegaMenu, setCachedMegaMenu] = useState<any[] | null>(() => {
    try {
      const saved = localStorage.getItem(MEGA_MENU_CACHE);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const { data: menuData, isLoading: menuLoading } = useGetMainNavigationQuery(undefined);
  const { data: megaMenuData, isLoading: megamenuloading } = useGetMegaMenuQuery("");

  // Update cache when new data arrives
  useEffect(() => {
    if (menuData?.Data) {
      localStorage.setItem(MAIN_MENU_CACHE, JSON.stringify(menuData.Data));
      setCachedMenu(menuData.Data as any[]);
    }
  }, [menuData]);

  useEffect(() => {
    if (megaMenuData?.Data) {
      localStorage.setItem(MEGA_MENU_CACHE, JSON.stringify(megaMenuData.Data));
      setCachedMegaMenu(megaMenuData.Data as any[]);
    }
  }, [megaMenuData]);

  const userMenuRef = useRef<HTMLDivElement>(null);

  // Authenticate status using Helper
  const isLoggedIn = helper.isLoggedIn();
  const tokenProfile = helper.getUserProfile();

  // Fetch full profile from API if logged in
  const { data: apiProfileResponse } = useGetUserProfileQuery(undefined, {
    skip: !isLoggedIn,
  });

  const userProfile = apiProfileResponse?.Data;

  // Sort menu items by MenuOrder
  const sortedMenuItems: ApiMenuItem[] = useMemo(() => {
    const items = (menuData?.Data ?? cachedMenu ?? []) as ApiMenuItem[];
    return [...items].sort((a, b) => a.MenuOrder - b.MenuOrder);
  }, [menuData, cachedMenu]);


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

    // Check if on Home Page
    const isHomePage = path === '/';

    // Active State Logic
    let isActive = false;
    if (href === '/') {
      isActive = path === '/';
    } else {
      isActive = path.startsWith(href) || (href === 'Tour & Treks' && (path.startsWith('/trek') || path.startsWith('/tour')));
    }

    // Return early if active to prevent class overrides
    if (isActive) {
      // Active Color Logic
      if (isHomePage && !isSticky && !isMenuOpen) {
        // Transparent Header Active: Brighter Blue or White with heavy shadow? 
        // User asked for "branding primary color". blue-700 is too dark for transparent header over dark hero.
        // We use blue-400 which is a lighter version of the brand color, visible on dark.
        return `${baseClass} text-blue-400 drop-shadow-md`;
      }
      // Standard/Opaque Header Active: Brand Blue (700)
      return `${baseClass} text-blue-700 dark:text-blue-400`;
    }

    // Inactive Color Logic
    let colorClass = '';
    if (!isHomePage) {
      // Non-Home: Always standard theme colors
      colorClass = 'text-gray-800 hover:text-blue-700 dark:text-gray-200 dark:hover:text-blue-400';
    } else {
      // Home Page
      if (isSticky || isMenuOpen) {
        colorClass = 'text-gray-700 hover:text-blue-700 dark:text-gray-300 dark:hover:text-blue-400';
      } else {
        // Transparent Home Header
        colorClass = 'text-white hover:text-blue-200 drop-shadow-md';
      }
    }

    return `${baseClass} ${colorClass}`;
  };

  const renderNavLink = (item: ApiMenuItem, index: number) => {
    // Only "Tour & Treks" should display MegaMenu
    if (item.Name === "Tour & Treks") {
      return (
        <div key={item.MenuId} className="group relative">
          <span className={`${getLinkClassName('Tour & Treks')} cursor-pointer flex items-center`}>
            {item.Name}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 pt-4 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300">
            <MegaMenu items={megaMenuData?.Data ?? cachedMegaMenu ?? []} isLoading={megamenuloading && !cachedMegaMenu} />
          </div>
        </div>
      );
    }

    // Normal menu item
    return (
      <a
        key={item.MenuId}
        href={item.Url}
        className={getLinkClassName(item.Url)}
      >
        {item.Name}
      </a>
    );
  };

  // Helper to get initials
  const getInitials = () => {
    const first = userProfile?.FirstName;
    const last = userProfile?.LastName;
    // Ensure we account for empty strings to avoid showing nothing if only one name exists
    if (!first && !last) return "U";
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  };

  const displayName = `${userProfile?.FirstName} ${userProfile?.LastName}`;

  // Get profile picture and prepend CDN base URL if it's a relative path
  const rawProfilePicture = userProfile?.ProfilePicture;
  const CDN_URL = (import.meta.env.VITE_CDN_PATH || '').replace(/\/+$/, '');
  const getProfilePictureUrl = (path: string | undefined | null) => {
    if (!path)
      return 'https://ui-avatars.com/api/?name=User&background=random'; // Fallback image
    if (path.startsWith('http'))
      return path;
    return `${CDN_URL}${path}?w=150&h=150&mode=crop`;
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsUserMenuOpen(false);
    helper.Logout();
    signout();
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isSticky || path !== '/' ? 'bg-white shadow-md dark:bg-gray-800' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <a href="/" className="text-3xl font-extrabold flex items-center gap-2">
            {/* Dynamic Logo Text based on state */}
            <img src={`${CDN_URL}/assets/logo/${isSticky || isMenuOpen || path !== '/' ? 'logo-h-light.svg' : 'logo-h-dark.svg'}`} width={300} />

          </a>

          <nav className="hidden lg:flex items-center space-x-8">
            {sortedMenuItems.map(renderNavLink)}
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden lg:block">
              <ThemeToggleButton />
            </div>

            {isLoggedIn ? (
              <div className="relative hidden lg:block" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  {rawProfilePicture ? (
                    <img
                      src={getProfilePictureUrl(rawProfilePicture)}
                      alt={getInitials()}
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
                      to="/user/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <a
                      href="#"
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                      Logout
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => signin()}
                className="hidden lg:block bg-blue-700 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-800 transition-colors duration-300"
              >
                Login
              </button>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden"
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-8 w-8 transition-colors ${isSticky || isMenuOpen || path !== '/' ? 'text-gray-800 dark:text-gray-300' : 'text-white drop-shadow-md'}`}
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
        className={`lg:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'} overflow-y-auto bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700`}
      >
        <nav className="flex flex-col p-4 space-y-2">
          {sortedMenuItems.map((item) => {
            if (item.Name === "Tour & Treks") {
              return (
                <div key={item.MenuId} className="flex flex-col">
                  <button
                    onClick={() => setIsMobileMegaMenuOpen(!isMobileMegaMenuOpen)}
                    className={`flex items-center justify-between w-full py-2 font-semibold ${isMobileMegaMenuOpen ? 'text-blue-700 dark:text-blue-400' : 'text-gray-800 dark:text-white'}`}
                  >
                    <span>{item.Name}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 transition-transform duration-200 ${isMobileMegaMenuOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Mobile Mega Menu Content */}
                  <div className={`pl-4 space-y-2 overflow-hidden transition-all duration-300 ${isMobileMegaMenuOpen ? 'max-h-[2000px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                    {(() => {
                      const items = (megaMenuData?.Data ?? cachedMegaMenu ?? []) as any[];
                      const rootGroups = items
                        .filter(i => i.ParentId === 0)
                        .sort((a, b) => a.MenuOrder - b.MenuOrder);

                      return rootGroups.map(group => (
                        <div key={group.MenuId} className="mb-4">
                          <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-2 text-sm uppercase tracking-wider">
                            {group.Name}
                          </h4>
                          <div className="space-y-2 pl-2 border-l-2 border-gray-100 dark:border-gray-700">
                            {items
                              .filter(i => i.ParentId === group.MenuId)
                              .sort((a, b) => a.MenuOrder - b.MenuOrder)
                              .map(subGroup => (
                                <div key={subGroup.MenuId}>
                                  {subGroup.Url === '#' ? (
                                    <h5 className="font-semibold text-gray-700 dark:text-gray-200 text-sm py-1">
                                      {subGroup.Name}
                                    </h5>
                                  ) : (
                                    <a
                                      href={subGroup.Url}
                                      onClick={() => setIsMenuOpen(false)}
                                      className="block font-semibold text-gray-700 dark:text-gray-200 text-sm py-1 hover:text-blue-700 dark:hover:text-blue-400"
                                    >
                                      {subGroup.Name}
                                    </a>
                                  )}
                                  <div className="pl-3 mt-1 space-y-1">
                                    {items
                                      .filter(i => i.ParentId === subGroup.MenuId)
                                      .sort((a, b) => a.MenuOrder - b.MenuOrder)
                                      .map(child => (
                                        <a
                                          key={child.MenuId}
                                          href={child.Url}
                                          onClick={() => setIsMenuOpen(false)}
                                          className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 py-1"
                                        >
                                          {child.Name}
                                        </a>
                                      ))}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              );
            }
            return (
              <a
                key={item.MenuId}
                href={item.Url}
                onClick={() => setIsMenuOpen(false)}
                className={`py-2 font-semibold ${path === item.Url ? 'text-blue-700 dark:text-blue-400' : 'text-gray-800 dark:text-white hover:text-blue-700 dark:hover:text-blue-400'}`}
              >
                {item.Name}
              </a>
            );
          })}

          <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700">
            {isLoggedIn ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-2 mb-4">
                  {rawProfilePicture ? (
                    <img
                      src={getProfilePictureUrl(rawProfilePicture)}
                      alt={getInitials()}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <span className="text-blue-700 dark:text-blue-200 font-bold text-sm">
                        {getInitials()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{displayName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Signed in</p>
                  </div>
                </div>
                <Link
                  to="/user/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/user/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  My Profile
                </Link>
                <button
                  onClick={(e) => {
                    handleLogout(e);
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-center border border-red-500/30 text-red-600 dark:text-red-400 px-6 py-2 rounded-md font-semibold hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  signin();
                  setIsMenuOpen(false);
                }}
                className="w-full text-center bg-blue-700 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-800 transition-colors duration-300"
              >
                Login
              </button>
            )}

            <div className="mt-6 flex justify-center">
              <ThemeToggleButton />
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;

