import React from 'react';
import Skeleton from './ui/Skeleton';

const BlogSkeleton: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800">
                    <Skeleton className="h-56 w-full" />
                    <div className="p-6 space-y-4">
                        <div className="flex space-x-2">
                            <Skeleton className="h-4 w-16 rounded-full" />
                            <Skeleton className="h-4 w-16 rounded-full" />
                        </div>
                        <Skeleton className="h-8 w-3/4" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>
                        <div className="pt-4 flex items-center justify-between">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-12" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BlogSkeleton;
