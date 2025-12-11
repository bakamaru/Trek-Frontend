import React from 'react';

const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const MyReviews: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-md">
            <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 mb-6">My Reviews</h1>

            <div className="space-y-6">
                {/* {USER_REVIEWS_DATA.length > 0 ? (
                    USER_REVIEWS_DATA.map(review => (
                        <div key={review.id} className="p-4 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                            <div className="flex flex-col md:flex-row gap-4">
                                <img src={review.tripImage} alt={review.tripName} className="w-full md:w-32 h-32 md:h-24 object-cover rounded-md" />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{review.tripName}</h2>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">{review.date}</span>
                                    </div>
                                    <div className="flex items-center mb-3">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <StarIcon key={i} filled={i < review.rating} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 italic">"{review.comment}"</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                        You haven't left any reviews yet. Complete a trip to share your experience!
                    </p>
                )} */}
            </div>
        </div>
    );
};

export default MyReviews;