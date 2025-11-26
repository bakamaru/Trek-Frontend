
import React, { useContext, useState, useEffect } from 'react';
import { FLIGHTS_DATA } from '../const/constants';
import { Flight } from '../types/types';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';



const FilterSection: React.FC<{title: string; children: React.ReactNode}> = ({ title, children }) => (
    <div className="py-4 border-b dark:border-gray-700">
        <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">{title}</h3>
        <div className="space-y-2">{children}</div>
    </div>
);

const Checkbox: React.FC<{label: string; count: number}> = ({ label, count }) => (
    <label className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 cursor-pointer">
        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-700 focus:ring-blue-700" />
        <span className="flex-grow">{label}</span>
        <span>({count})</span>
    </label>
);


const FlightList: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [flights, setFlights] = useState<Flight[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFlights(FLIGHTS_DATA);
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);


  return (
    <div className="pt-20 bg-gray-50 dark:bg-gray-900">
        <section className="py-12">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md sticky top-28">
                            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Filter Flights</h2>
                            <FilterSection title="Stops">
                                <Checkbox label="Non-stop" count={2} />
                                <Checkbox label="1 Stop" count={1} />
                                <Checkbox label="2+ Stops" count={0} />
                            </FilterSection>
                            <FilterSection title="Airlines">
                                <Checkbox label="Qatar Airways" count={1} />
                                <Checkbox label="Emirates" count={1} />
                                <Checkbox label="British Airways" count={1} />
                                <Checkbox label="Singapore Airlines" count={1} />
                            </FilterSection>
                            <FilterSection title="Price Range">
                                <input type="range" min="500" max="1300" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                                    <span>$500</span>
                                    <span>$1300</span>
                                </div>
                            </FilterSection>
                        </div>
                    </aside>

                    {/* Flight Listings */}
                    <main className="lg:col-span-3">
                        {loading ? (
                          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md min-h-[30rem] flex items-center justify-center">
                            <LoadingSpinner />
                          </div>
                        ) : (
                          <div className="space-y-6">
                              {flights.map(flight => (
                                  <div key={flight.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col md:flex-row items-center gap-4">
                                      <div className="flex-shrink-0 w-full md:w-auto text-center md:text-left">
                                          <img src={flight.airlineLogo} alt={flight.airline} className="h-12 mx-auto md:mx-0" />
                                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{flight.airline}</p>
                                      </div>
                                      <div className="flex-grow flex items-center justify-between w-full">
                                          <div className="text-center">
                                              <p className="text-xl font-bold text-gray-900 dark:text-white">{flight.from.time}</p>
                                              <p className="text-gray-500 dark:text-gray-400">{flight.from.code}</p>
                                          </div>
                                          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                                              <p>{flight.duration}</p>
                                              <div className="w-24 h-px bg-gray-300 dark:bg-gray-600 my-1 mx-auto"></div>
                                              <p>{flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop(s)`}</p>
                                          </div>
                                          <div className="text-center">
                                              <p className="text-xl font-bold text-gray-900 dark:text-white">{flight.to.time}</p>
                                              <p className="text-gray-500 dark:text-gray-400">{flight.to.code}</p>
                                          </div>
                                      </div>
                                      <div className="w-full md:w-48 text-center border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-4 border-gray-200 dark:border-gray-700">
                                          <p className="text-2xl font-bold text-gray-900 dark:text-white">${flight.price}</p>
                                          <p className="text-sm text-gray-500 dark:text-gray-400">per person</p>
                                          <Link to={`/flights/${flight.id}`} className="mt-2 inline-block w-full bg-blue-700 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-800 transition-colors duration-300">
                                              View Details
                                          </Link>
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

export default FlightList;
