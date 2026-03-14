import React from 'react';
import Skeleton from './ui/Skeleton';

const DestinationsSkeleton: React.FC = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="rounded-lg overflow-hidden h-80 relative shadow-sm border border-gray-200 dark:border-gray-800">
                    <Skeleton className="h-full w-full" />
                    <div className="absolute bottom-6 left-6 right-6 space-y-2">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-6 w-1/2 rounded-full" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DestinationsSkeleton;
