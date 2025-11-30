import React, { useState, useEffect } from "react";
import { TrekReviewSaveRequest } from "../../../types/trekTypes";
import { useSaveTrekReviewsMutation, useDeleteTrekReviewMutation } from "../../../redux/trek/trekAPI";
import toaster from "../../toster";

interface ReviewsTabProps {
    trekId: number;
    detailData: any;
}

const ReviewsTab: React.FC<ReviewsTabProps> = ({ trekId, detailData }) => {
    const [reviews, setReviews] = useState<TrekReviewSaveRequest[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<TrekReviewSaveRequest>({
        trekReviewId: 0,
        star: 5,
        review: "",
        reviewedByName: "",
        isApproved: false,
    });
    const [saveReviews, { isLoading: isSaving }] = useSaveTrekReviewsMutation();
    const [deleteReview, { isLoading: isDeleting }] = useDeleteTrekReviewMutation();

    useEffect(() => {
        if (detailData && detailData.Code === 200) {
            const reviewData = detailData.Data?.Reviews || [];
            const mappedReviews = reviewData.map((item: any) => ({
                trekReviewId: item.TrekReviewId,
                star: item.Star,
                review: item.Review,
                reviewedByName: item.ReviewedByName,
                isApproved: item.IsApproved,
            }));
            setReviews(mappedReviews);
        }
    }, [detailData]);

    const handleAdd = () => {
        setEditingIndex(-1);
        setEditForm({
            trekReviewId: 0,
            star: 5,
            review: "",
            reviewedByName: "",
            isApproved: false,
        });
    };

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setEditForm({ ...reviews[index] });
    };

    const handleCancel = () => {
        setEditingIndex(null);
        setEditForm({
            trekReviewId: 0,
            star: 5,
            review: "",
            reviewedByName: "",
            isApproved: false,
        });
    };

    const handleSave = async () => {
        if (trekId === 0) {
            toaster.error("Please save basic trek info first.");
            return;
        }

        try {
            // Save only the current review being edited
            const response = await saveReviews({ trekId, data: [editForm] }).unwrap();
            if (response.Code === 200) {
                toaster.success("Review saved successfully!");

                // Update local state
                if (editingIndex === -1) {
                    // Adding new - add to reviews array
                    setReviews([...reviews, { ...editForm, trekReviewId: response.Data?.TrekReviewId || 0 }]);
                } else if (editingIndex !== null) {
                    // Editing existing - update in reviews array
                    const updated = [...reviews];
                    updated[editingIndex] = editForm;
                    setReviews(updated);
                }

                handleCancel();
            } else {
                toaster.error("Failed to save review.");
            }
        } catch (error: any) {
            toaster.error(error.data?.message || "An error occurred.");
        }
    };

    const handleRemove = async (index: number) => {
        const reviewToRemove = reviews[index];

        if (!window.confirm("Are you sure you want to delete this review?")) {
            return;
        }

        // If it's a saved review (has trekReviewId > 0), call the API
        if (reviewToRemove.trekReviewId && reviewToRemove.trekReviewId > 0) {
            try {
                const response = await deleteReview({
                    trekId,
                    trekReviewId: reviewToRemove.trekReviewId
                }).unwrap();

                if (response.Code === 200) {
                    toaster.success("Review deleted successfully!");
                    setReviews(reviews.filter((_, i) => i !== index));
                } else {
                    toaster.error("Failed to delete review.");
                }
            } catch (error: any) {
                toaster.error(error.data?.message || "Error deleting review.");
            }
        } else {
            // If it's a new unsaved review, just remove from local state
            setReviews(reviews.filter((_, i) => i !== index));
        }
    };

    const handleFormChange = (field: keyof TrekReviewSaveRequest, value: any) => {
        setEditForm({ ...editForm, [field]: value });
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
                {editingIndex === null && (
                    <button type="button"
                        onClick={handleAdd}
                        className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800"
                    >
                        Add Review
                    </button>
                )}
            </div>

            {/* Edit Form */}
            {editingIndex !== null && (
                <div className="rounded-lg border-2 border-gray-900 bg-gray-50 p-4">
                    <h4 className="mb-3 text-sm font-medium text-gray-900">
                        {editingIndex === -1 ? "Add New Review" : "Edit Review"}
                    </h4>
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-700">Reviewer Name</label>
                                <input
                                    type="text"
                                    value={editForm.reviewedByName || ""}
                                    onChange={(e) => handleFormChange("reviewedByName", e.target.value)}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700">Star Rating</label>
                                <select
                                    value={editForm.star || 5}
                                    onChange={(e) => handleFormChange("star", parseInt(e.target.value))}
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
                                value={editForm.review || ""}
                                onChange={(e) => handleFormChange("review", e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                                placeholder="Review text..."
                            />
                        </div>

                        <div>
                            <label className="flex items-center text-sm">
                                <input
                                    type="checkbox"
                                    checked={editForm.isApproved || false}
                                    onChange={(e) => handleFormChange("isApproved", e.target.checked)}
                                    className="mr-2 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
                                />
                                <span className={editForm.isApproved ? "text-green-700 font-medium" : "text-gray-600"}>
                                    {editForm.isApproved ? "Approved" : "Pending Approval"}
                                </span>
                            </label>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                            >
                                {isSaving ? "Saving..." : "Save"}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={isSaving}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reviews List */}
            {editingIndex === null && (
                <>
                    {reviews.length === 0 ? (
                        <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                            <p className="text-sm text-gray-500">No reviews added yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {reviews.map((review, index) => (
                                <div key={index} className="rounded-lg border border-gray-200 bg-white p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="font-medium text-gray-900">{review.reviewedByName || "Anonymous"}</span>
                                                {renderStars(review.star || 0)}
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${review.isApproved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                                    {review.isApproved ? "Approved" : "Pending"}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">{review.review || "No review text"}</p>
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            <button
                                                type="button"
                                                onClick={() => handleEdit(index)}
                                                className="text-xs text-blue-600 hover:text-blue-800"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleRemove(index)}
                                                className="text-xs text-red-600 hover:text-red-800"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ReviewsTab;
