import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import { Link } from 'react-router-dom';
import { useGetAllPopularTrekQuery } from '../redux/api/trekAPI';
import { getCDNUrl, slugify } from '../utils/helpers';
import PopularTreksSkeleton from './PopularTreksSkeleton';

const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-5 w-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

// Match TrekDto + a few optional image fields if backend later adds them
type TrekDto = {
  TrekId: number;
  DestinationId: number;
  IsPopular: boolean;
  IsTrending: boolean;
  TrekCategoryId: number;
  TrekRegionId: number;
  Name: string;
  Url: string;
  Description: string;
  ActivityTypeId: number;
  ActivityLevelId: number;
  DurationDays: number;
  PriceInUSD?: number | null;
  PriceInNrs?: number | null;
  MaxAltitudeMeters: number;
  MaxAltitudeFeet?: number | null;
  StartingPoint: string;
  EndingPoint: string;
  OverviewDescription: string;
  BaseAccommodationType: string;
  StartCityId: number;
  EndCityId: number;
  DefaultCurrencyId: number;
  TrekMap: string;
  IsVerified: boolean;
  IsSystem: boolean;

  // Extra fields from TrekDto
  Region: string;
  Category: string;
  ActivityType: string;
  ActivityLevel: string;
  TotalReviews: number;
  TotalAvgStars: number;

  // Optional image fields if you decide to add them later
  CoverImage?: string;
  ThumbnailImage?: string;
};

type TrekApiResponse = {
  Code: number;
  Message: string;
  Data: TrekDto[];
  Errors?: any[];
};

const PopularTreks: React.FC = () => {
  const CACHE_KEY = 'popular_treks_cache';

  const [cachedTreks, setCachedTreks] = React.useState<TrekDto[] | null>(() => {
    try {
      const saved = localStorage.getItem(CACHE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const { data: rawData, isLoading, error } = useGetAllPopularTrekQuery({
    offset: 1,
    limit: 6,
    query: '',
  });

  React.useEffect(() => {
    if (rawData?.Data) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(rawData.Data));
      setCachedTreks(rawData.Data);
    }
  }, [rawData]);

  const response = rawData as TrekApiResponse | undefined;
  const treks: TrekDto[] = response?.Data ?? cachedTreks ?? [];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">
            Popular Treks
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Embark on an adventure of a lifetime with our most sought-after treks.
          </p>
        </div>

        {isLoading && treks.length === 0 ? (
          <PopularTreksSkeleton />
        ) : error && treks.length === 0 ? (
          <div className="text-red-500 text-center">Failed to load treks</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {treks.map((trek) => {
              const price =
                trek.PriceInUSD

              const durationLabel = trek.DurationDays
                ? `${trek.DurationDays} Days`
                : '';

              const difficulty = trek.ActivityLevel || 'Unknown';
              const rating = Math.round(trek.TotalAvgStars || 0);
              const reviews = trek.TotalReviews || 0;

              // Choose image source (if you later add CoverImage/ThumbnailImage, this will just work)
              const image = getCDNUrl(trek.ThumbnailImage);

              const overview =
                trek.OverviewDescription?.substring(0, 100) ?? '';
              const trekUrl = trek.Url || slugify(trek.Name);

              return (
                <div
                  key={trek.TrekId}
                  className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden group"
                >
                  <div className="relative">
                    <a
                      href={`/trek/${trekUrl}`}

                    ><img
                        src={image + "?w=500&h=300&mode=crop"}
                        alt={trek.Name}
                        className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
                      /></a>
                    <div className="absolute top-4 left-4 bg-blue-700 text-white text-lg font-bold px-4 py-2 rounded-md">
                      {`$${price}`}
                    </div>
                    {/* Region badge to attract attention */}
                    <div className="absolute top-4 right-4 bg-white/90 text-gray-900 text-sm font-semibold px-3 py-1 rounded-full shadow">
                      {trek.Region ?? 'Region'}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                      <h3 className="text-xl font-bold text-white">
                        {trek.Name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
                      <span>{durationLabel}</span>
                      <span
                        className={`font-bold px-2 py-1 rounded-full text-xs ${difficulty.toLowerCase().includes('strenuous') ||
                          difficulty.toLowerCase().includes('hard')
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          }`}
                      >
                        {difficulty}
                      </span>
                    </div>

                    <p
                      className="text-gray-600 dark:text-gray-300 mb-4 h-16 line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: overview + '...' }}
                    />

                    <div className="flex justify-between items-center border-t dark:border-gray-600 pt-4">
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} filled={i < rating} />
                          ))}
                        </div>
                        <span className="text-gray-600 dark:text-gray-300 ml-2">
                          ({reviews} reviews)
                        </span>
                      </div>
                      <a
                        href={`/trek/${trekUrl}`}
                        className="text-blue-700 font-semibold hover:underline"
                      >
                        Know More
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularTreks;
