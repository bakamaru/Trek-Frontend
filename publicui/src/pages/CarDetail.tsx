
import React, { useState, useEffect } from 'react';
import { CARS_DETAIL_DATA } from '../const/constants';
import { CarRentalDetail as CarRentalDetailType } from '../types/types';
import LoadingSpinner from '../components/LoadingSpinner';
import { useParams } from 'react-router-dom';


interface CarDetailProps {
  //carId: string;
}

const CarDetail: React.FC<CarDetailProps> = () => {
  const [car, setCar] = useState<CarRentalDetailType | null>(null);
  const [loading, setLoading] = useState(true);
 const { slug } = useParams();
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
        const foundCar = CARS_DETAIL_DATA.find(c => c.id === slug);
        setCar(foundCar || null);
        setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [slug]);

  if (loading) {
    return <LoadingSpinner fullPage={true} />;
  }

  if (!car) {
    return (
      <div className="pt-20 h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">Car Not Found</h1>
      </div>
    );
  }

  const SpecIcon: React.FC<{ type: 'seats' | 'doors' | 'transmission' | 'fuel' }> = ({ type }) => {
    const icons = {
        seats: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
        doors: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14v6m-3-3h6M6 10h2a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2z" /></svg>,
        transmission: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
        fuel: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>,
    };
    return icons[type];
  }

  return (
    <div className="pt-20 bg-gray-50 dark:bg-gray-900">
        <section className="py-12">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-3 gap-12">
                     {/* Main Content */}
                    <div className="lg:col-span-2 space-y-10">
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                             <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">{car.name}</h1>
                             <p className="text-lg text-gray-500 dark:text-gray-400">or similar | {car.type}</p>
                            
                             <img src={car.image} alt={car.name} className="w-full h-auto object-cover rounded-lg my-6" />

                            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Specifications</h2>
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-gray-700 dark:text-gray-300">
                                 <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"><SpecIcon type="seats" /><p>{car.seats} Seats</p></div>
                                 <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"><SpecIcon type="doors" /><p>{car.doors} Doors</p></div>
                                 <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"><SpecIcon type="transmission" /><p>{car.transmission}</p></div>
                                 <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"><SpecIcon type="fuel" /><p>{car.fuel}</p></div>
                            </div>
                        </div>

                         <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Description</h2>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{car.description}</p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Features</h2>
                            <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 list-disc list-inside text-gray-600 dark:text-gray-300">
                                {car.features.map(feature => <li key={feature}>{feature}</li>)}
                            </ul>
                        </div>
                    </div>

                    {/* Booking Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-28 space-y-8">
                             <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border dark:border-gray-700">
                                <div className="text-center pb-4 border-b dark:border-gray-700">
                                    <p className="text-4xl font-bold text-blue-700">${car.pricePerDay}<span className="text-lg text-gray-500 dark:text-gray-400">/day</span></p>
                                    <div className="flex justify-center items-center mt-2">
                                        <img src={car.companyLogo} alt={car.company} className="h-8" />
                                    </div>
                                </div>
                                <form className="space-y-4 pt-4">
                                    <div>
                                        <label htmlFor="pickup" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pick-up Date & Time</label>
                                        <input type="datetime-local" id="pickup" className="mt-1 block w-full p-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:[color-scheme:dark]" />
                                    </div>
                                    <div>
                                        <label htmlFor="dropoff" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Drop-off Date & Time</label>
                                        <input type="datetime-local" id="dropoff" className="mt-1 block w-full p-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:[color-scheme:dark]" />
                                    </div>
                                     <button type="submit" className="w-full bg-blue-700 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-800 transition-colors duration-300 text-lg">
                                        Book Now
                                    </button>
                                </form>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    </div>
  );
};

export default CarDetail;
