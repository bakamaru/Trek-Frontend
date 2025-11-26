

import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';


const Hero: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Flight');

  const renderForm = () => {
    switch (activeTab) {
      case 'Flight':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Location</label>
              <input type="text" placeholder="Where are you from?" className="w-full p-3 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-700 outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">To</label>
              <input type="text" placeholder="Where are you going?" className="w-full p-3 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-700 outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Date</label>
              <input type="date" className="w-full p-3 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-700 outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:[color-scheme:dark]" />
            </div>
            <Link to="/flights" className="w-full text-center bg-blue-700 text-white p-3 rounded-md font-semibold hover:bg-blue-800 transition-colors duration-300 h-[50px] flex items-center justify-center">Search</Link>
          </div>
        );
      case 'Hotel':
        return (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Location</label>
              <input type="text" placeholder="Enter a destination or hotel" className="w-full p-3 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-700 outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Check in</label>
              <input type="date" className="w-full p-3 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-700 outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:[color-scheme:dark]" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Check out</label>
              <input type="date" className="w-full p-3 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-700 outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:[color-scheme:dark]" />
            </div>
            <Link to="/hotels" className="w-full text-center bg-blue-700 text-white p-3 rounded-md font-semibold hover:bg-blue-800 transition-colors duration-300 h-[50px] flex items-center justify-center">Search</Link>
          </div>
        );
      case 'Car Rent':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Picking up</label>
              <input type="text" placeholder="Enter a location" className="w-full p-3 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-700 outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Dropping off</label>
              <input type="text" placeholder="Enter a location" className="w-full p-3 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-700 outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Date</label>
              <input type="date" className="w-full p-3 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-700 outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:[color-scheme:dark]" />
            </div>
            <Link to="/cars" className="w-full text-center bg-blue-700 text-white p-3 rounded-md font-semibold hover:bg-blue-800 transition-colors duration-300 h-[50px] flex items-center justify-center">Search</Link>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="hero-bg bg-cover bg-center h-screen flex items-center justify-center relative">
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="container mx-auto px-4 z-10 text-center text-white mt-20">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 animate-fade-in-down">Amazing Tour In Hampshire</h1>
        <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto">7 days, 8 night tour</p>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-2xl max-w-5xl mx-auto text-left">
          <div className="flex border-b dark:border-gray-700 mb-6">
            {['Flight', 'Hotel', 'Car Rent'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-6 font-semibold text-lg transition-colors duration-300 ${
                  activeTab === tab ? 'border-b-4 border-blue-700 text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          {renderForm()}
        </div>
      </div>
    </section>
  );
};

export default Hero;