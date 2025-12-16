import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useGetUserReviewsQuery, useSaveReviewMutation, TrekUserReviewDto, TrekReviewSaveRequest } from '../../redux/api/reviewAPI';
import { toast } from 'react-toastify'; // Assuming toast is used in project

// Star Icon Component for Display and Input
const StarIcon: React.FC<{ filled: boolean; onClick?: () => void; className?: string }> = ({ filled, onClick, className }) => (
    <svg
        onClick={onClick}
        xmlns="http://www.w3.org/2000/svg"
        className={`h-5 w-5 ${filled ? 'text-yellow-400' : 'text-gray-300'} ${className || ''} ${onClick ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
        viewBox="0 0 20 20"
        fill="currentColor"
    >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

type ReviewFormData = {
    star: number;
    review: string;
};

const MyReviews: React.FC = () => {
    const [offset, setOffset] = useState(1);
    const LIMIT = 4;

    // API Call
    const { data: reviewsResponse, isLoading, isError } = useGetUserReviewsQuery({ offset: offset, limit: LIMIT });
    const [saveReview, { isLoading: isSaving }] = useSaveReviewMutation();

    // Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingReview, setEditingReview] = useState<TrekUserReviewDto | null>(null);

    // Form
    const { control, register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ReviewFormData>({
        defaultValues: {
            star: 5,
            review: ''
        }
    });

    // Handle Edit Click
    const handleEditClick = (review: TrekUserReviewDto) => {
        setEditingReview(review);
        setValue('star', review.Star);
        setValue('review', review.Review);
        setIsEditModalOpen(true);
    };

    // Close Modal
    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setEditingReview(null);
        reset();
    };

    // Submit Form
    const onSubmit = async (data: ReviewFormData) => {
        if (!editingReview) return;

        const payload: TrekReviewSaveRequest = {
            TrekReviewId: editingReview.TrekReviewId,
            TrekId: editingReview.TrekId,
            Star: data.star,
            Review: data.review,
            ReviewedByName: editingReview.ReviewedByName,
            IsApproved: false // Reset approval on edit
        };

        try {
            await saveReview(payload).unwrap();
            // toast.success('Review updated successfully!'); 
            handleCloseModal();
        } catch (error) {
            console.error('Failed to update review', error);
            // toast.error('Failed to update review');
        }
    };

    const reviews = reviewsResponse?.Data || [];
    // Calculate total pages logic assuming RowTotal is in the DTO of the first item
    const totalCount = reviews.length > 0 ? reviews[0].RowTotal : 0;
    const totalPages = Math.ceil(totalCount / LIMIT);


    //if (isError) return <div className="p-8 text-center text-red-500">Failed to load reviews.</div>;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-md min-h-[600px] flex flex-col">
            <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 mb-6 border-b pb-4 dark:border-gray-700">My Reviews</h1>

            <div className="space-y-6 flex-grow">
                {isLoading && reviews.length == 0 && (
                    <div className="p-8 text-center text-gray-500">
                        <div role="status">
                            <svg aria-hidden="true" className="inline w-8 h-8 w-8 h-8 text-neutral-tertiary animate-spin fill-brand" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>)}



                {reviews.length > 0 && (
                    reviews.map((review: TrekUserReviewDto) => (
                        <div key={review.TrekReviewId} className="p-6 border dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700/30 hover:shadow-md transition-shadow relative group">

                            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                                <div>
                                    <Link to={`/trek/${review.TrekUrl}`} className="text-lg font-bold text-blue-600 dark:text-blue-400 hover:underline">
                                        {review.TrekName}
                                    </Link>
                                    {review.TravelDate && (
                                        <p className="text-xs text-text-500 dark:text-gray-400 mt-1">
                                            Travel Date: {new Date(review.TravelDate).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <StarIcon key={i} filled={i < review.Star} />
                                        ))}
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${review.IsApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {review.IsApproved ? 'Published' : 'Pending Approval'}
                                    </span>
                                </div>
                            </div>

                            <p className="text-gray-700 dark:text-gray-300 text-base italic leading-relaxed mb-4 pl-4 border-l-4 border-gray-200 dark:border-gray-600">
                                "{review.Review}"
                            </p>

                            <div className="flex justify-end pt-2 border-t border-gray-100 dark:border-gray-700/50">
                                <button
                                    onClick={() => handleEditClick(review)}
                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors py-1 px-3 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit Review
                                </button>
                            </div>
                        </div>
                    ))
                )}
                {isLoading == false && reviews.length == 0 && (
                    <div className="text-center py-16 bg-gray-50 dark:bg-gray-700/30 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No reviews yet</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">You haven't posted any reviews.</p>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalCount > 4 && (
                <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-100 dark:border-gray-700 shrink-0">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Page {offset} of {totalPages}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setOffset(prev => Math.max(prev - 1, 1))}
                            disabled={offset === 1}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setOffset(prev => (prev < totalPages ? prev + 1 : prev))}
                            disabled={offset >= totalPages}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden transform transition-all animate-scale-in">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-700/30">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edit Your Review</h3>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                            {/* Star Rating Input */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rating</label>
                                <Controller
                                    name="star"
                                    control={control}
                                    rules={{ required: true, min: 1 }}
                                    render={({ field: { value, onChange } }) => (
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <StarIcon
                                                    key={star}
                                                    filled={star <= value}
                                                    onClick={() => onChange(star)}
                                                    className="w-8 h-8 md:w-10 md:h-10 cursor-pointer"
                                                />
                                            ))}
                                            <span className="ml-3 text-lg font-medium text-gray-700 dark:text-gray-300">{value} Stars</span>
                                        </div>
                                    )}
                                />
                            </div>

                            {/* Review Text Input */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Experience</label>
                                <textarea
                                    {...register('review', { required: 'Review text is required', minLength: { value: 10, message: 'Review must be at least 10 characters' } })}
                                    rows={5}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow resize-none"
                                    placeholder="Share details of your own experience at this place..."
                                ></textarea>
                                {errors.review && <p className="text-red-500 text-xs mt-1">{errors.review.message}</p>}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200 dark:shadow-none transition-all"
                                >
                                    {isSaving ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyReviews;