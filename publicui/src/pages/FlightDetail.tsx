
import React, { useState, useEffect } from 'react';
//import { FLIGHTS_DATA } from '../const/constants';
import { Flight } from '../types/types';
import LoadingSpinner from '../components/LoadingSpinner';
import { useParams } from 'react-router-dom';

interface FlightDetailProps {
  // flightId: string;
}

const FlightDetail: React.FC<FlightDetailProps> = () => {
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const foundFlight:any ={};// FLIGHTS_DATA.find(f => f.id === slug);
      setFlight(foundFlight || null);
      setLoading(false);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingSpinner fullPage={true} />;
  }

  if (!flight) {
    return (
      <div className="pt-20 h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">Flight Not Found</h1>
      </div>
    );
  }

  return (
    <div className="pt-20 bg-gray-50 dark:bg-gray-900">
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <div className="flex justify-between items-start pb-6 border-b dark:border-gray-700">
              <div>
                <img src={flight.airlineLogo} alt={flight.airline} className="h-16 mb-2" />
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{flight.airline}</h1>
                <p className="text-gray-500 dark:text-gray-400">Flight from {flight.from.city} to {flight.to.city}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-700">${flight.price}</p>
                <p className="text-gray-500 dark:text-gray-400">per person</p>
              </div>
            </div>

            <div className="py-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Flight Details</h2>
              <div className="flex items-center justify-around text-center">
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{flight.from.time}</p>
                  <p className="text-lg text-gray-500 dark:text-gray-400">{flight.from.code}</p>
                  <p className="text-gray-600 dark:text-gray-300">{flight.from.city}</p>
                </div>
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                  <p>{flight.duration}</p>
                  <div className="w-32 h-0.5 bg-gray-300 dark:bg-gray-600 my-1 mx-auto relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"></div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"></div>
                  </div>
                  <p>{flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop(s)`}</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{flight.to.time}</p>
                  <p className="text-lg text-gray-500 dark:text-gray-400">{flight.to.code}</p>
                  <p className="text-gray-600 dark:text-gray-300">{flight.to.city}</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t dark:border-gray-700">
              <button className="w-full bg-blue-700 text-white px-6 py-4 rounded-md font-semibold hover:bg-blue-800 transition-colors duration-300 text-lg">
                Book Now
              </button>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default FlightDetail;
