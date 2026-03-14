import React, { useState, useEffect, useMemo } from 'react';
import { useGetDestinationByCountryIdQuery, useGetDestinationTreksQuery } from '../redux/api/destinationAPI';
import { Tour } from '../types/types';
import LoadingSpinner from '../components/LoadingSpinner';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { getCDNUrl } from '../utils/helpers';

const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const ExploreNepal: React.FC = () => {
    const [selectedDestId, setSelectedDestId] = useState<number | null>(null);
    const COUNTRY_ID_NEPAL = 149;

    // Fetch all destinations for Nepal
    const { data: countryDestResp, isLoading: isLoadingCountryDest } = useGetDestinationByCountryIdQuery({
        countryId: COUNTRY_ID_NEPAL,
        offset: 1,
        limit: 100
    });

    // Extract destinations list
    const destinations = useMemo(() => {
        const raw = countryDestResp?.Data || countryDestResp || [];
        return Array.isArray(raw) ? raw : [];
    }, [countryDestResp]);

    // Set initial selected destination if none selected
    useEffect(() => {
        if (destinations.length > 0 && selectedDestId === null) {
            setSelectedDestId(destinations[0].DestinationId);
        }
    }, [destinations, selectedDestId]);

    // Find current selected destination object
    const currentDestination = useMemo(() => {
        return destinations.find((d: any) => d.DestinationId === selectedDestId);
    }, [destinations, selectedDestId]);

    // Fetch treks for the selected destination
    const { data: treksResp, isLoading: isLoadingTreks } = useGetDestinationTreksQuery(
        selectedDestId ? { destinationId: selectedDestId, offset: 1, limit: 20 } : (undefined as any),
        { skip: !selectedDestId }
    );

    // Map treks response into frontend Tour[] shape
    const mappedTours: Tour[] = useMemo(() => {
        const raw = treksResp?.Data || treksResp || [];
        if (!Array.isArray(raw)) return [];
        return raw.map((t: any) => ({
            id: t.TrekId?.toString(),
            image: t.ImageUrl || t.Image || t.image || '',
            slug: t.Url || '',
            price: t.PriceInUSD || 0,
            location: t.Location || t.Region || '',
            duration: t.Duration || '',
            title: t.Title || t.Name || '',
            rating: t.Rating ?? 5,
            reviews: t.ReviewsCount ?? 0,
        }));
    }, [treksResp]);

    if (isLoadingCountryDest && destinations.length === 0) {
        return <LoadingSpinner fullPage={true} />;
    }

    return (
        <div className="pt-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <SEO
                title="Explore Nepal - Discover the Best Treks & Tours"
                description="Explore various destinations within Nepal, from Everest to Annapurna. Book your next adventure today."
                image={currentDestination?.CoverImage || ""}
                context="Travel guide for Nepal destinations and treks."
            />

            {/* Hero Section */}
            <section
                className="h-[40vh] bg-cover bg-center flex items-center justify-center text-white relative transition-all duration-500"
                style={{
                    backgroundImage: `url(${getCDNUrl(currentDestination?.CoverImage || currentDestination?.ThumbnailImage || "") + "?w=1920&h=650&mode=crop"})`
                }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                <div className="container mx-auto px-4 z-10 text-center">
                    <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight">Explore Nepal</h1>
                    <p className="text-xl mt-4 max-w-2xl mx-auto font-medium">
                        {currentDestination ? `Discovering ${currentDestination.Name}` : "Choose a region to start your adventure"}
                    </p>
                </div>
            </section>

            {/* Destinations Navigation */}
            <section className="py-10 bg-white dark:bg-gray-800 shadow-sm sticky top-[80px] z-20 overflow-x-auto">
                <div className="container mx-auto px-4 flex flex-nowrap md:flex-wrap items-center justify-start md:justify-center gap-4 scrollbar-hide py-2">
                    {destinations.map((dest: any) => (
                        <button
                            key={dest.DestinationId}
                            onClick={() => setSelectedDestId(dest.DestinationId)}
                            className={`px-6 py-3 rounded-full font-bold transition-all duration-300 whitespace-nowrap shadow-sm border ${selectedDestId === dest.DestinationId
                                ? 'bg-blue-700 text-white border-blue-700 scale-105 shadow-md'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            {dest.Name}
                        </button>
                    ))}
                </div>
            </section>

            {/* About the Selected Destination */}
            {currentDestination && (
                <section className="py-16 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                    <div className="container mx-auto px-4 max-w-4xl text-center">
                        <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 mb-6">About {currentDestination.Name}</h2>
                        <div className="prose dark:prose-invert mx-auto">
                            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                                {currentDestination.Description || currentDestination.ShortDescription || `Experience the breathtaking beauty and rich culture of ${currentDestination.Name}, one of Nepal's most iconic regions.`}
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* Treks/Tours Listing */}
            <section className="py-20 bg-white dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                        <div>
                            <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">
                                {currentDestination ? `Top Tours in ${currentDestination.Name}` : "Trips"}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Handpicked adventures for an unforgettable experience.
                            </p>
                        </div>
                        {isLoadingTreks && (
                            <div className="mt-4 md:mt-0 flex items-center text-blue-700 font-semibold italic">
                                <LoadingSpinner />
                                <span className="ml-2">Loading adventures...</span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {mappedTours.map((tour: Tour) => (
                            <div key={tour.id} className="bg-white dark:bg-gray-700 rounded-xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-600 flex flex-col">
                                <div className="relative overflow-hidden aspect-[16/10]">
                                    <img
                                        src={getCDNUrl(tour.image) + "?w=600&h=400&mode=crop"}
                                        alt={tour.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4 bg-blue-700 text-white text-lg font-bold px-4 py-2 rounded-lg shadow-lg z-10">
                                        ${tour.price}
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                </div>
                                <div className="p-8 flex-grow flex flex-col">
                                    <div className="flex justify-between items-center text-gray-500 dark:text-gray-400 text-sm mb-3">
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-1 text-blue-700" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
                                            {tour.location}
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-1 text-blue-700" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path></svg>
                                            {tour.duration}
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 line-clamp-2 h-16 leading-tight group-hover:text-blue-700 transition-colors">
                                        {tour.title}
                                    </h3>
                                    <div className="mt-auto flex justify-between items-center border-t dark:border-gray-600 pt-6">
                                        <div className="flex items-center">
                                            <div className="flex mr-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <StarIcon key={i} filled={i < tour.rating} />
                                                ))}
                                            </div>
                                            <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">({tour.reviews})</span>
                                        </div>
                                        <Link to={`/trek/${tour.slug}`} className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-lg font-bold transition-all transform group-hover:translate-x-1">
                                            Know More
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {!isLoadingTreks && mappedTours.length === 0 && (
                            <div className="col-span-full py-20 text-center">
                                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <p className="text-2xl font-medium text-gray-500 dark:text-gray-400">No tours or treks found for this region.</p>
                                <p className="text-gray-400 mt-2">Try selecting another destination in Nepal.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ExploreNepal;
