import React, { useState } from 'react';
import { getCDNUrl, slugify } from '../utils/helpers';
import { Destination } from '../types/types';
import LoadingSpinner from '../components/LoadingSpinner';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { useGetDestinationsActiveQuery } from '../redux/api/destinationAPI';

const Destinations: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const LIMIT = 12;

  const { data, error, isLoading, isFetching } = useGetDestinationsActiveQuery({ offset: page, limit: LIMIT });

  // API may return an envelope { Data: [...] } or raw array
  const destinations: any[] = (data && (data.Data ?? data)) || [];

  const hasMore = destinations.length >= LIMIT;

  return (
    <div className="pt-20">
      <SEO title="Destinations" description="Explore breathtaking locations from around the globe, handpicked for your next adventure." />
      <section className="bg-gray-100 dark:bg-gray-800 py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-extrabold text-gray-800 dark:text-gray-100">Our Destinations</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mt-4 max-w-3xl mx-auto">Explore breathtaking locations from around the globe, handpicked for your next adventure.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          {(isLoading && !destinations.length) || (!destinations.length && isFetching) ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {destinations.map((dest: any, index: number) => {
                  const name = dest.Name ?? dest.name ?? 'Destination';
                  const image = getCDNUrl(dest.CoverImage ?? dest.ThumbnailImage ?? dest.image ?? '');
                  const tours = dest.Tours ?? dest.tours ?? 0;

                  return (
                    <a href={`/destination/${slugify(name)}`} key={index}>
                      <div className="relative rounded-lg overflow-hidden group shadow-lg h-96">
                        <img src={image + "?w=800&h=600&mode=crop"} alt={name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
                        <div className="absolute bottom-0 left-0 p-6 text-white">
                          <h3 className="text-2xl font-bold">{name}</h3>
                          <p className="text-sm font-medium bg-blue-700 inline-block px-3 py-1 rounded-full mt-2">{tours} Trips</p>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>

              {/* <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 disabled:opacity-50"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Prev
                </button>

                <span className="text-sm text-gray-600 dark:text-gray-300">Page {page}</span>

                <button
                  className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasMore}
                >
                  Next
                </button>
              </div> */}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Destinations;