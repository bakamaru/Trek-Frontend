import React, { useState, useContext, useMemo } from 'react';
import { TREKS_DATA } from '../const/constants';
import { useParams } from 'react-router-dom';

interface BookingProps {
    //trekId: string;
}

const Booking: React.FC<BookingProps> = () => {
    const { slug } = useParams();
    const trek = useMemo(() => TREKS_DATA.find(t => t.id === slug), [slug]);

    const [numTravelers, setNumTravelers] = useState(1);
    const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const totalPrice = useMemo(() => trek ? trek.price * numTravelers : 0, [trek, numTravelers]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (trek) {
            // setBookingDetails({
            //     item: trek,
            //     travelers: numTravelers,
            //     date: bookingDate,
            // });
            // navigate('/checkout');
        }
    };

    if (!trek) {
        return <div className="pt-20 h-screen flex items-center justify-center"><h1 className="text-3xl font-bold">Trek Not Found</h1></div>;
    }

    return (
        <div className="pt-20 bg-gray-50 dark:bg-gray-900">
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 text-center mb-12">Complete Your Booking</h1>
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Booking Form */}
                        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Traveler Information</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Booking Details */}
                                <div className="border-b dark:border-gray-700 pb-6">
                                    <h3 className="text-xl font-semibold dark:text-gray-200 mb-4">Trip Details</h3>
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="travelers" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Number of Travelers</label>
                                            <input type="number" id="travelers" value={numTravelers} onChange={e => setNumTravelers(Math.max(1, parseInt(e.target.value)))} min="1" className="mt-1 block w-full p-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                                        </div>
                                        <div>
                                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Departure Date</label>
                                            <input type="date" id="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} className="mt-1 block w-full p-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:[color-scheme:dark]" />
                                        </div>
                                    </div>
                                </div>
                                {/* Personal Details */}
                                <div className="border-b dark:border-gray-700 pb-6">
                                    <h3 className="text-xl font-semibold dark:text-gray-200 mb-4">Personal Details</h3>
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                                            <input type="text" id="name" value={fullName} onChange={e => setFullName(e.target.value)} required className="mt-1 block w-full p-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                                            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full p-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                                        <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 block w-full p-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                                    </div>
                                </div>
                                
                                <button type="submit" className="w-full bg-blue-700 text-white px-6 py-4 rounded-md font-semibold hover:bg-blue-800 transition-colors duration-300 text-lg">
                                    Proceed to Checkout
                                </button>
                            </form>
                        </div>
                        {/* Summary */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-28 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border dark:border-gray-700">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 border-b dark:border-gray-700 pb-4">Booking Summary</h2>
                                <img src={trek.image} alt={trek.title} className="rounded-lg mb-4" />
                                <h3 className="text-xl font-semibold dark:text-gray-200">{trek.title}</h3>
                                <div className="space-y-3 my-4 text-gray-600 dark:text-gray-300">
                                    <p className="flex justify-between"><span>Duration:</span> <strong>{trek.duration}</strong></p>
                                    <p className="flex justify-between"><span>Price per person:</span> <strong>${trek.price}</strong></p>
                                    <p className="flex justify-between"><span>Travelers:</span> <strong>{numTravelers}</strong></p>
                                </div>
                                <div className="border-t dark:border-gray-700 pt-4">
                                    <p className="flex justify-between text-2xl font-bold text-gray-800 dark:text-gray-100">
                                        <span>Total:</span>
                                        <span>${totalPrice.toLocaleString()}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Booking;