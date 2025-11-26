import React, { useContext, useState, useEffect } from 'react';
import { DESTINATIONS_DATA } from '../const/constants';
import { slugify } from '../utils/helpers';
import { Destination } from '../types/types';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';



const Destinations: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDestinations(DESTINATIONS_DATA);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="pt-20">
      <section className="bg-gray-100 dark:bg-gray-800 py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-extrabold text-gray-800 dark:text-gray-100">Our Destinations</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mt-4 max-w-3xl mx-auto">Explore breathtaking locations from around the globe, handpicked for your next adventure.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {destinations.map((dest, index) => (
                <Link to={`/destinations/${slugify(dest.name)}`} key={index}>
                   <div className="relative rounded-lg overflow-hidden group shadow-lg h-96">
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
        </div>
      </section>
    </div>
  );
};

export default Destinations;