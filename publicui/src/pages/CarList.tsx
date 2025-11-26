
import React, { useContext, useState, useEffect, useMemo } from 'react';
import { CARS_DATA } from '../const/constants';
import { CarRental } from '../types/types';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';



const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const FilterSection: React.FC<{title: string; children: React.ReactNode}> = ({ title, children }) => (
    <div className="py-4 border-b dark:border-gray-700">
        <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">{title}</h3>
        <div className="space-y-2">{children}</div>
    </div>
);

const Checkbox: React.FC<{label: string; count?: number}> = ({ label, count }) => (
    <label className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 cursor-pointer">
        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-700 focus:ring-blue-700" />
        <span className="flex-grow">{label}</span>
        {count && <span>({count})</span>}
    </label>
);

const GridIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
);

const ListIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const CarList: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [cars, setCars] = useState<CarRental[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('recommended');

  useEffect(() => {
    const timer = setTimeout(() => {
      setCars(CARS_DATA);
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const sortedCars = useMemo(() => {
      let sorted = [...cars];
      if (sortBy === 'priceLow') {
          sorted.sort((a, b) => a.pricePerDay - b.pricePerDay);
      } else if (sortBy === 'priceHigh') {
          sorted.sort((a, b) => b.pricePerDay - a.pricePerDay);
      } else if (sortBy === 'rating') {
          sorted.sort((a, b) => b.rating - a.rating);
      }
      return sorted;
  }, [cars, sortBy]);

  return (
    <div className="pt-20 bg-gray-50 dark:bg-gray-900">
        <section className="py-12">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md sticky top-28">
                            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Filter Cars</h2>
                            <FilterSection title="Car Type">
                                <Checkbox label="Economy" />
                                <Checkbox label="Compact" />
                                <Checkbox label="SUV" />
                                <Checkbox label="Luxury" />
                            </FilterSection>
                            <FilterSection title="Rental Company">
                                <Checkbox label="Hertz" />
                                <Checkbox label="Avis" />
                                <Checkbox label="Enterprise" />
                                <Checkbox label="Budget" />
                            </FilterSection>
                            <FilterSection title="Price Range">
                                <input type="range" min="50" max="200" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                                    <span>$50</span>
                                    <span>$200</span>
                                </div>
                            </FilterSection>
                        </div>
                    </aside>

                    {/* Car Listings */}
                    <main className="lg:col-span-3">
                         {/* Toolbar */}
                         <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                            <p className="text-gray-600 dark:text-gray-300 mb-4 sm:mb-0">
                                Showing <span className="font-bold text-gray-900 dark:text-white">{sortedCars.length}</span> cars
                            </p>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <label htmlFor="sort" className="text-sm text-gray-600 dark:text-gray-400">Sort by:</label>
                                    <select 
                                        id="sort" 
                                        value={sortBy} 
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-700 focus:border-blue-700 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    >
                                        <option value="recommended">Recommended</option>
                                        <option value="priceLow">Price: Low to High</option>
                                        <option value="priceHigh">Price: High to Low</option>
                                        <option value="rating">Top Rated</option>
                                    </select>
                                </div>
                                <div className="flex border dark:border-gray-600 rounded-lg overflow-hidden">
                                    <button 
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-white text-gray-500 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'}`}
                                        aria-label="Grid View"
                                    >
                                        <GridIcon />
                                    </button>
                                    <button 
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-white text-gray-500 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'}`}
                                        aria-label="List View"
                                    >
                                        <ListIcon />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {loading ? (
                          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md min-h-[30rem] flex items-center justify-center">
                            <LoadingSpinner />
                          </div>
                        ) : (
                          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-6"}>
                              {sortedCars.map(car => (
                                  <div key={car.id} className={`bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden group ${viewMode === 'list' ? 'flex flex-col md:flex-row' : ''}`}>
                                      <div className={`relative ${viewMode === 'list' ? 'w-full md:w-64 flex-shrink-0' : ''}`}>
                                          <img src={car.image} alt={car.name} className={`w-full object-cover ${viewMode === 'list' ? 'h-48 md:h-full' : 'h-56'}`} />
                                      </div>
                                      <div className="p-4 flex-grow flex flex-col">
                                          <div className="flex justify-between items-start">
                                              <div>
                                                  <p className="text-sm text-gray-500 dark:text-gray-400">{car.type}</p>
                                                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{car.name}</h3>
                                              </div>
                                              {viewMode === 'grid' && (
                                                <div className="text-right flex-shrink-0 ml-2">
                                                    <p className="text-xl font-bold text-blue-700">${car.pricePerDay}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">/ day</p>
                                                </div>
                                              )}
                                          </div>
                                          <div className="flex items-center justify-between mt-2">
                                              <div className="flex items-center">
                                                  <img src={car.companyLogo} alt={car.company} className="h-6 mr-2" />
                                                  <span className="text-sm text-gray-600 dark:text-gray-300">{car.company}</span>
                                              </div>
                                              <div className="flex items-center">
                                                  <div className="flex">
                                                      {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < Math.floor(car.rating)} />)}
                                                  </div>
                                                  <span className="text-gray-600 dark:text-gray-300 text-sm ml-1">{car.rating}</span>
                                              </div>
                                          </div>
                                          
                                          {viewMode === 'list' && (
                                               <div className="mt-auto flex justify-between items-end">
                                                    <div>
                                                         {/* Add extra details for list view if available */}
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-2xl font-bold text-blue-700">${car.pricePerDay}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">/ day</p>
                                                        <Link to={`/cars/${car.id}`} className="inline-block bg-blue-700 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-800 transition-colors duration-300">
                                                            View Details
                                                        </Link>
                                                    </div>
                                               </div>
                                          )}

                                          {viewMode === 'grid' && (
                                              <div className="mt-4">
                                                  <Link to={`/cars/${car.id}`} className="w-full text-center block bg-blue-700 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-800 transition-colors duration-300">
                                                      View Details
                                                  </Link>
                                              </div>
                                          )}
                                      </div>
                                  </div>
                              ))}
                          </div>
                        )}
                    </main>
                </div>
            </div>
        </section>
    </div>
  );
};

export default CarList;
