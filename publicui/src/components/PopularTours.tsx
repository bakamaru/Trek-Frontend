import React, { useContext, useState, useEffect } from 'react';
import { TOURS_DATA } from '../const/constants';
import { Tour } from '../types/types';
import LoadingSpinner from './LoadingSpinner';
import { Link } from 'react-router-dom';




const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const PopularTours: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [tours, setTours] = useState<Tour[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTours(TOURS_DATA);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">Most Popular Tours</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Discover the tours that our customers love the most.</p>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour) => (
              <div key={tour.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden group">
                <div className="relative">
                  <img src={tour.image} alt={tour.title} className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-4 left-4 bg-blue-700 text-white text-lg font-bold px-4 py-2 rounded-md">${tour.price}</div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center text-gray-500 dark:text-gray-400 text-sm mb-2">
                    <span>{tour.location}</span>
                    <span>{tour.duration}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 h-16">{tour.title}</h3>
                  <div className="flex justify-between items-center border-t dark:border-gray-600 pt-4">
                    <div className="flex items-center">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} filled={i < tour.rating} />
                        ))}
                      </div>
                      <span className="text-gray-600 dark:text-gray-300 ml-2">({tour.reviews} reviews)</span>
                    </div>
                     <Link to={`/tour/${tour.id}`} className="text-blue-700 font-semibold hover:underline">
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

export default PopularTours;