import React, { useContext } from 'react';
import { Link } from 'react-router-dom';



const DashboardSidebar: React.FC = () => {
    
const USER_PROFILE_DATA:any = {}
    const navItems = [
        { href: '/user/dashboard', label: 'Dashboard', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg> },
        { href: '/user/dashboard/bookings', label: 'My Bookings', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 4a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1z" clipRule="evenodd" /></svg> },
        { href: '/user/dashboard/reviews', label: 'My Reviews', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg> },
        { href: '/user/dashboard/rewards', label: 'My Rewards', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM15 2a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0V6h-1a1 1 0 110-2h1V3a1 1 0 011-1zm-5 4a3 3 0 013 3v3a3 3 0 11-6 0V9a3 3 0 013-3zm-1 3a1 1 0 10-2 0v3a1 1 0 102 0V9z" clipRule="evenodd" /></svg> },
        { href: '/user/dashboard/invoices', label: 'My Invoices', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 15v4a1 1 0 001 1h12a1 1 0 001-1v-4a1 1 0 00-.293-.707L16 11.586V8a6 6 0 00-6-6zM8 18a1 1 0 01-1-1v-1a1 1 0 012 0v1a1 1 0 01-1 1zm4 0a1 1 0 01-1-1v-1a1 1 0 012 0v1a1 1 0 01-1 1z" /></svg> },
        { href: '/user/dashboard/profile', label: 'My Profile', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg> },
        { href: '/user/dashboard/password', label: 'Change Password', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" /></svg> },
    ];
    
    return (
        <aside className="lg:w-64 xl:w-72 lg:flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <div className="flex items-center space-x-4 p-2 mb-5 border-b dark:border-gray-700 pb-5">
                    <img className="h-16 w-16 rounded-full object-cover" src={USER_PROFILE_DATA.profilePicture} alt="User" />
                    <div>
                        <h4 className="font-bold text-lg text-gray-800 dark:text-gray-100">{USER_PROFILE_DATA.name}</h4>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Travel Enthusiast</span>
                    </div>
                </div>
                <nav className="space-y-2">
                    {navItems.map(item => <Link key={item.href} to={item.href} //icon={item.icon}
                    >{item.label}</Link>)}
                    <a href="#" onClick={(e) => { e.preventDefault(); /* Handle logout */ }} className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                         <span className="mr-3"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg></span>
                         Logout
                    </a>
                </nav>
            </div>
        </aside>
    );
};

export default DashboardSidebar;