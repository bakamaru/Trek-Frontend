import React from 'react';
import Skeleton from './ui/Skeleton';

const PopularTreksSkeleton: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
                    <Skeleton className="h-64 w-full" />
                    <div className="p-6 space-y-4">
                        <div className="flex justify-between">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-6 w-16" />
                        </div>
                        <Skeleton className="h-6 w-3/4" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                        <div className="pt-4 border-t border-gray-100 dark:border-gray-600 flex justify-between">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PopularTreksSkeleton;
