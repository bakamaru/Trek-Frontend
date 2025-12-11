
import React, { useState, useEffect } from 'react';

import { HotelDetail as HotelDetailType } from '../types/types';
import LoadingSpinner from '../components/LoadingSpinner';
import { useParams } from 'react-router-dom';

const StarIcon: React.FC<{ filled: boolean; className?: string }> = ({ filled, className = 'h-5 w-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`${className} ${filled ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

interface HotelDetailProps {
  //hotelId: string;
}

const HotelDetail: React.FC<HotelDetailProps> = () => {
  const [hotel, setHotel] = useState<HotelDetailType | null>(null);
  const [loading, setLoading] = useState(true);
 const { slug } = useParams();
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const foundHotel:any ={};// HOTELS_DETAIL_DATA.find(h => h.id === slug);
      setHotel(foundHotel || null);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [slug]);


  if (loading) {
    return <LoadingSpinner fullPage={true} />;
  }

  if (!hotel) {
    return (
      <div className="pt-20 h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">Hotel Not Found</h1>
      </div>
    );
  }

  const AmenityIcon: React.FC<{ name: string }> = ({ name }) => {
    const icons: { [key: string]: React.ReactNode } = {
        'Free WiFi': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a10 10 0 0114.142 0M1.394 8.536a15 15 0 0121.212 0" /></svg>,
        'Spa & Wellness Center': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945C21.42 11.998 21 13 21 14c0 1.657-1.343 3-3 3h-1.333L15 20l-1.333-3H9L7.667 20 6.333 17H5c-1.657 0-3-1.343-3-3 0-1 .42-1.998 1.055-2.686zM12 6a2 2 0 100-4 2 2 0 000 4z" /></svg>,
        'Fitness Center': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
        'Restaurant': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0c-.454-.303-.977-.454-1.5-.454V5.118a2.704 2.704 0 013 0 2.704 2.704 0 003 0 2.704 2.704 0 013 0 2.704 2.704 0 003 0c.454.303.977.454 1.5.454v10.428zM5 20h14a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>,
    };
    return icons[name] || icons['Restaurant'];
  }

  return (
    <div className="pt-20 bg-gray-50 dark:bg-gray-900">
        <section className="py-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">{hotel.name}</h1>
                    <div className="flex items-center mt-2 text-lg">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < hotel.rating} />)}
                        </div>
                        <span className="text-gray-600 dark:text-gray-400 ml-2">{hotel.rating} stars ({hotel.reviews} reviews)</span>
                        <span className="mx-2 text-gray-400">·</span>
                        <span className="text-gray-600 dark:text-gray-400">{hotel.location}</span>
                    </div>
                </div>

                {/* Gallery */}
                <div className="grid grid-cols-4 grid-rows-2 gap-2 h-96 mb-12">
                    <div className="col-span-2 row-span-2 rounded-lg overflow-hidden">
                        <img src={hotel.gallery[0]} alt="Main hotel view" className="w-full h-full object-cover" />
                    </div>
                    {hotel.gallery.slice(1, 4).map((img, i) => (
                        <div key={i} className="rounded-lg overflow-hidden">
                            <img src={img} alt={`Hotel view ${i+2}`} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-10">
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">About this hotel</h2>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{hotel.overview}</p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Amenities</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {hotel.amenities.map(amenity => (
                                    <div key={amenity} className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                                        <AmenityIcon name={amenity} />
                                        <span>{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Available Rooms</h2>
                            <div className="space-y-6">
                                {hotel.rooms.map(room => (
                                    <div key={room.name} className="flex flex-col md:flex-row gap-4 p-4 border dark:border-gray-700 rounded-lg">
                                        <img src={room.image} alt={room.name} className="w-full md:w-1/3 object-cover rounded-md" />
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{room.name}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{room.beds} · Up to {room.guests} guests</p>
                                        </div>
                                        <div className="text-center md:text-right">
                                            <p className="text-2xl font-bold text-blue-700">${room.price}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">/ night</p>
                                            <button className="mt-2 w-full md:w-auto bg-blue-700 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-800">Book Now</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Guest Reviews</h2>
                             <div className="space-y-6">
                                {hotel.reviewsData.map(review => (
                                    <div key={review.author} className="border-b dark:border-gray-700 pb-4">
                                        <div className="flex items-center mb-2">
                                            <img src={review.avatar} alt={review.author} className="w-12 h-12 rounded-full object-cover mr-4" />
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-white">{review.author}</h4>
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < review.rating} className="h-4 w-4" />)}
                                                </div>
                                            </div>
                                        </div>
                                        <h5 className="font-semibold text-gray-800 dark:text-gray-200">{review.title}</h5>
                                        <p className="text-gray-600 dark:text-gray-300">"{review.comment}"</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                     {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-28 space-y-8">
                             <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                                <h3 className="text-xl font-bold mb-4">Location</h3>
                                <div className="overflow-hidden rounded-lg h-64">
                                    <iframe src={hotel.mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="rounded-lg dark:grayscale dark:invert"></iframe>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    </div>
  );
};

export default HotelDetail;
