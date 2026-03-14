import React from 'react';
import HeroSkeleton from '../HeroSkeleton';
import DestinationsSkeleton from '../DestinationsSkeleton';
import PopularTreksSkeleton from '../PopularTreksSkeleton';
import BlogSkeleton from '../BlogSkeleton';
import Skeleton from '../ui/Skeleton';

const HomeSkeleton: React.FC = () => {
    return (
        <div className="space-y-0 overflow-hidden">
            <HeroSkeleton />

            {/* Services Skeleton */}
            <section className="py-20 bg-white dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-start space-x-6 p-6 border border-gray-100 dark:border-gray-700 rounded-lg">
                                <Skeleton className="h-12 w-12 flex-shrink-0" variant="circle" />
                                <div className="flex-1 space-y-3">
                                    <Skeleton className="h-6 w-1/2" />
                                    <Skeleton className="h-4 w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12 flex flex-col items-center">
                        <Skeleton className="h-10 w-64 mb-4" />
                        <Skeleton className="h-4 w-96 max-w-full" />
                    </div>
                    <DestinationsSkeleton />
                </div>
            </section>

            <section className="py-16 bg-white dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12 flex flex-col items-center">
                        <Skeleton className="h-10 w-64 mb-4" />
                        <Skeleton className="h-4 w-96 max-w-full" />
                    </div>
                    <PopularTreksSkeleton />
                </div>
            </section>

            {/* Gallery/Blog section placeholders */}
            <section className="py-20 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12 flex flex-col items-center">
                        <Skeleton className="h-10 w-64 mb-4" />
                        <Skeleton className="h-4 w-96 max-w-full" />
                    </div>
                    <BlogSkeleton />
                </div>
            </section>
        </div>
    );
};

export default HomeSkeleton;
