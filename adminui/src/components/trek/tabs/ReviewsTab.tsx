import React, { useState, useEffect } from "react";
import { TrekReviewSaveRequest } from "../../../types/trekTypes";
import { useSaveTrekReviewsMutation } from "../../../redux/trek/trekAPI";
import toaster from "../../toster";

interface ReviewsTabProps {
    trekId: number;
    detailData: any;
}

const ReviewsTab: React.FC<ReviewsTabProps> = ({ trekId, detailData }) => {
    const [reviews, setReviews] = useState<TrekReviewSaveRequest[]>([]);
    const [saveReviews, { isLoading: isSaving }] = useSaveTrekReviewsMutation();

    useEffect(() => {
        if (detailData && detailData.code === 200) {
            const reviewData = detailData.data?.reviews || [];
            setReviews(reviewData);
        }
    }, [detailData]);

    const handleAdd = () => {
        setReviews([
            ...reviews,
            {
                trekReviewId: 0,
                star: 5,
                review: "",
                reviewedByName: "",
                isApproved: false,
            },
        ]);
    };

    const handleRemove = (index: number) => {
        setReviews(reviews.filter((_, i) => i !== index));
    };

    const handleChange = (index: number, field: keyof TrekReviewSaveRequest, value: any) => {
        const updated = [...reviews];
        updated[index] = { ...updated[index], [field]: value };
        setReviews(updated);
    };

    const handleSave = async () => {
        if (trekId === 0) {
            toaster.error("Please save basic trek info first.");
            return;
        }

        try {
            const response = await saveReviews({ trekId, data: reviews }).unwrap();
            if (response.code === 200) {
                toaster.success("Reviews saved successfully!");
            } else {
                toaster.error("Failed to save reviews.");
            }
        } catch (error: any) {
            toaster.error(error.data?.message || "An error occurred.");
        }
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        className={`h-4 w-4 ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Trek Reviews</h3>
                <button
                    onClick={handleAdd}
                    className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800"
                >
                    Add Review
                </button>
            </div>

            {reviews.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                    <p className="text-sm text-gray-500">No reviews added yet.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {reviews.map((review, index) => (
                        <div key={index} className="rounded-lg border border-gray-200 bg-white p-4">
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">Reviewer Name</label>
                                        <input
                                            type="text"
                                            value={review.reviewedByName || ""}
                                            onChange={(e) => handleChange(index, "reviewedByName", e.target.value)}
                                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">Star Rating</label>
                                        <select
                                            value={review.star || 5}
                                            onChange={(e) => handleChange(index, "star", parseInt(e.target.value))}
                                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                                        >
                                            <option value={5}>5 Stars</option>
                                            <option value={4}>4 Stars</option>
                                            <option value={3}>3 Stars</option>
                                            <option value={2}>2 Stars</option>
                                            <option value={1}>1 Star</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700">Review</label>
                                    <textarea
                                        rows={3}
                                        value={review.review || ""}
                                        onChange={(e) => handleChange(index, "review", e.target.value)}
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                                        placeholder="Review text..."
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {renderStars(review.star || 0)}
                                        <label className="flex items-center text-sm">
                                            <input
                                                type="checkbox"
                                                checked={review.isApproved || false}
                                                onChange={(e) => handleChange(index, "isApproved", e.target.checked)}
                                                className="mr-2 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
                                            />
                                            <span className={review.isApproved ? "text-green-700 font-medium" : "text-gray-600"}>
                                                {review.isApproved ? "Approved" : "Pending Approval"}
                                            </span>
                                        </label>
                                    </div>
                                    <button
                                        onClick={() => handleRemove(index)}
                                        className="text-xs text-red-600 hover:text-red-800"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="pt-4">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                >
                    {isSaving ? "Saving..." : "Save Reviews"}
                </button>
            </div>
        </div>
    );
};

export default ReviewsTab;
