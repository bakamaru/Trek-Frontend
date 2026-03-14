import React from 'react';
import Skeleton from './ui/Skeleton';

const HeroSkeleton: React.FC = () => {
    return (
        <section className="h-screen relative overflow-hidden bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
            <div className="container mx-auto px-4 z-10 flex flex-col items-center text-center">
                <Skeleton className="h-16 w-3/4 md:w-1/2 mb-6" />
                <Skeleton className="h-6 w-2/3 md:w-1/3 mb-10" />
                <Skeleton className="h-14 w-48 rounded-full" />
            </div>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex space-x-2">
                <Skeleton className="h-2 w-8 rounded-full" />
                <Skeleton className="h-2 w-2 rounded-full" />
                <Skeleton className="h-2 w-2 rounded-full" />
            </div>
        </section>
    );
};

export default HeroSkeleton;
