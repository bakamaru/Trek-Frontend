import React, { useContext, useState, useEffect } from 'react';
import { DESTINATIONS_DETAIL_DATA } from '../const/constants';
import { Tour, DestinationDetail as DestinationDetailType } from '../types/types';
import LoadingSpinner from '../components/LoadingSpinner';
import SEO from '../components/SEO';
import { Link, useParams } from 'react-router-dom';


const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);


interface DestinationDetailProps {
  //destinationSlug: string;
}

const DestinationDetail: React.FC<DestinationDetailProps> = () => {
  const [destination, setDestination] = useState<DestinationDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const foundDestination = DESTINATIONS_DETAIL_DATA.find(d => d.slug === slug);
      setDestination(foundDestination || null);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [slug]);

  if (loading) {
    return <LoadingSpinner fullPage={true} />;
  }

  if (!destination) {
    return (
      <div className="pt-20 h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">Destination Not Found</h1>
      </div>
    );
  }

  return (
    <div className="pt-20 bg-gray-50 dark:bg-gray-900">
      <SEO
        title={`Travel to ${destination.name} - Best Tours & Guides`}
        description={`Explore ${destination.name} with our top-rated tours. ${destination.description.substring(0, 100)}...`}
        image={destination.heroImage}
        context={`Travel guide for ${destination.name}. Description: ${destination.description}`}
      />
      {/* Hero Section */}
      <section
        className="h-[50vh] bg-cover bg-center flex items-center justify-center text-white relative"
        style={{ backgroundImage: `url(${destination.heroImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-5xl lg:text-7xl font-extrabold">{destination.name}</h1>
          <p className="text-xl mt-4">Discover the adventures that await you.</p>
        </div>
      </section>

      {/* About Destination Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 text-center mb-8">About {destination.name}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed text-center">
            {destination.description}
          </p>
        </div>
      </section>

      {/* Tours Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">Tours in {destination.name}</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Explore our curated list of tours for an unforgettable experience.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destination.tours.map((tour: Tour) => (
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
        </div>
      </section>
    </div>
  );
};

export default DestinationDetail;