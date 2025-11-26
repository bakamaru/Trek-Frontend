import React, { useContext, useState, useEffect } from 'react';
import { DESTINATIONS_DATA } from '../const/constants';
import { slugify } from '../utils/helpers';
import { Destination } from '../types/types';
import LoadingSpinner from './LoadingSpinner';
import { Link } from 'react-router-dom';



const TopDestinations: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDestinations(DESTINATIONS_DATA.slice(0, 5));
      setLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">Top Destinations</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Explore our most popular travel destinations.</p>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {destinations.map((dest, index) => (
              <Link to={`/destinations/${slugify(dest.name)}`} key={index}>
                  <div className="relative rounded-lg overflow-hidden group shadow-lg h-80">
                  <img src={dest.image} alt={dest.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                      <h3 className="text-2xl font-bold">{dest.name}</h3>
                      <p className="text-sm font-medium bg-blue-700 inline-block px-3 py-1 rounded-full mt-2">{dest.tours} Tours</p>
                  </div>
                  </div>
              </Link>
            ))}
          </div>
        )}
        <div className="text-center mt-16">
            <Link to="/destinations" className="bg-blue-700 text-white px-8 py-4 rounded-md font-semibold hover:bg-blue-800 transition-colors duration-300 text-lg">
                View All Destinations
            </Link>
        </div>
      </div>
    </section>
  );
};

export default TopDestinations;