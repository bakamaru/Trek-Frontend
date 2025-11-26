import React, { useContext } from 'react';
import { USER_PROFILE_DATA, USER_BOOKINGS_DATA, REWARD_POINTS_TOTAL } from '../../const/constants';
import { Link } from 'react-router-dom';




const Dashboard: React.FC = () => {
    const upcomingTrips = USER_BOOKINGS_DATA.filter(b => b.status === 'Confirmed');
    const nextTrip = upcomingTrips[0];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-gray-100">
                Welcome back, {USER_PROFILE_DATA.name.split(' ')[0]}!
            </h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center space-x-4">
                    <div className="bg-blue-100 dark:bg-blue-700/20 p-3 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.28-1.25-1.43-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.28-1.25 1.43-1.857M12 12a3 3 0 100-6 3 3 0 000 6z" /></svg>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Bookings</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{USER_BOOKINGS_DATA.length}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center space-x-4">
                    <div className="bg-blue-100 dark:bg-blue-700/20 p-3 rounded-full">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Upcoming Trips</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{upcomingTrips.length}</p>
                    </div>
                </div>
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center space-x-4">
                    <div className="bg-green-100 dark:bg-green-500/20 p-3 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4M17 3v4m-2 2h4m-4 12v4m-2-2h4M12 6a2 2 0 100-4 2 2 0 000 4zm0 14a2 2 0 100-4 2 2 0 000 4z" /></svg>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Reward Points</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{REWARD_POINTS_TOTAL.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Next Trip */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Your Next Adventure</h2>
                {nextTrip ? (
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <img src={nextTrip.tripImage} alt={nextTrip.tripName} className="w-full sm:w-1/3 h-auto object-cover rounded-lg" />
                        <div className="flex-1">
                            <span className="text-sm font-semibold text-blue-700 uppercase">UPCOMING</span>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">{nextTrip.tripName}</h3>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                <strong>Travel Date:</strong> {new Date(nextTrip.travelDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <strong>Travelers:</strong> {nextTrip.travelers}
                            </p>
                        </div>
                        <Link to="/dashboard/bookings" className="bg-blue-700 text-white px-5 py-2.5 rounded-md font-semibold hover:bg-blue-800 transition-colors duration-300 self-start sm:self-center">
                            View Booking
                        </Link>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-600 dark:text-gray-400 mb-4">You have no upcoming trips. Time to plan a new adventure!</p>
                        <Link to="/" className="bg-blue-700 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-800 transition-colors duration-300">
                            Explore Tours & Treks
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;