import React from 'react';
import { getCDNUrl, slugify } from '../utils/helpers';
import LoadingSpinner from './LoadingSpinner';
import { Link } from 'react-router-dom';
import { useGetTopDestinationsQuery, Destination } from '../redux/api/destinationAPI';
import DestinationsSkeleton from './DestinationsSkeleton';



const TopDestinations: React.FC = () => {
  const CACHE_KEY = 'top_destinations_cache';

  const [cachedDestinations, setCachedDestinations] = React.useState<Destination[] | null>(() => {
    try {
      const saved = localStorage.getItem(CACHE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const { data: rawData, isLoading, error } = useGetTopDestinationsQuery({
    offset: 1,
    limit: 4,
    query: "",
  });

  React.useEffect(() => {
    if (rawData?.Data) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(rawData.Data));
      setCachedDestinations(rawData.Data);
    }
  }, [rawData]);

  const destinations: Destination[] = rawData?.Data ?? cachedDestinations ?? [];
  const noImageUrl = import.meta.env.VITE_CDN_PATH + "/no-td.png?w=600&h=400&mode=crop";

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">
            Top Destinations
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Explore our most popular travel destinations.
          </p>
        </div>

        {isLoading && destinations.length === 0 ? (
          <DestinationsSkeleton />
        ) : error && destinations.length === 0 ? (
          <div className="text-red-500 text-center">Failed to load destinations</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {destinations.map((dest, index) => {
              const image =
                getCDNUrl(dest.ThumbnailImage) ||
                noImageUrl

              return (
                <a
                  href={`/destination/${slugify(dest.Name)}`}
                  key={dest.DestinationId ?? index}
                >
                  <div className="relative rounded-lg overflow-hidden group shadow-lg h-80">
                    <img
                      src={image + "?w=600&h=400&mode=crop"}
                      alt={dest.Name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />
                    <div className="absolute bottom-0 left-0 p-6 text-white">
                      <h3 className="text-2xl font-bold">{dest.Name || ""}</h3>
                      {dest.CountryName && (
                        <p className="text-sm font-medium bg-blue-700 inline-block px-3 py-1 rounded-full mt-2">
                          {dest.CountryName == "null" ? "Nepal" : (dest.CountryName || "")}
                        </p>
                      )}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}

        <div className="text-center mt-16">
          <a
            href="/destination"
            className="bg-blue-700 text-white px-8 py-4 rounded-md font-semibold hover:bg-blue-800 transition-colors duration-300 text-lg"
          >
            View All Destinations
          </a>
        </div>
      </div>
    </section>
  );
};

export default TopDestinations;
