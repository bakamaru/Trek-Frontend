import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'rect' | 'circle' | 'text';
}

const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'rect' }) => {
    const baseClass = "animate-pulse bg-gray-200 dark:bg-gray-700";

    const variantClasses = {
        rect: "rounded-md",
        circle: "rounded-full",
        text: "rounded h-4 w-full"
    };

    return (
        <div className={`${baseClass} ${variantClasses[variant]} ${className}`} />
    );
};

export default Skeleton;
