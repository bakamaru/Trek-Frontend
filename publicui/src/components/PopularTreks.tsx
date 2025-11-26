import React, { useContext, useState, useEffect } from 'react';
import { TREKS_DATA } from '../const/constants';
import { slugify } from '../utils/helpers';
import { Trek } from '../types/types';
import LoadingSpinner from './LoadingSpinner';
import { Link } from 'react-router-dom';



const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const PopularTreks: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [treks, setTreks] = useState<Trek[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTreks(TREKS_DATA);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">Popular Treks</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Embark on an adventure of a lifetime with our most sought-after treks.</p>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {treks.map((trek) => (
              <div key={trek.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden group">
                <div className="relative">
                  <img src={trek.image} alt={trek.title} className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-4 left-4 bg-blue-700 text-white text-lg font-bold px-4 py-2 rounded-md">${trek.price}</div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                      <h3 className="text-xl font-bold text-white">{trek.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
                    <span>{trek.duration}</span>
                    <span className={`font-bold px-2 py-1 rounded-full text-xs ${trek.difficulty === 'Strenuous' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'}`}>{trek.difficulty}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 h-16">{trek.overview.substring(0, 100)}...</p>
                  <div className="flex justify-between items-center border-t dark:border-gray-600 pt-4">
                    <div className="flex items-center">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} filled={i < trek.rating} />
                        ))}
                      </div>
                      <span className="text-gray-600 dark:text-gray-300 ml-2">({trek.reviews} reviews)</span>
                    </div>
                    <Link to={`/trek/${trek.id}`} className="text-blue-700 font-semibold hover:underline">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularTreks;