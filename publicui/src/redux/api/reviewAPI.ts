import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../config/apiConfig";

/** Params */
export type PaginationParams = {
    offset?: number; // 1-based
    limit?: number;
};

/** DTOs */
export type TrekReviewDto = {
    TrekReviewId: number;
    TrekId: number;
    Star: number;
    Review: string;
    ReviewedByName: string;
    IsApproved: boolean;
};
export type TrekUserReviewDto = {
    TrekName: string;
    TrekUrl: string;
    TravelDate: Date;
    TrekReviewId: number;
    TrekId: number;
    Star: number;
    Review: string;
    ReviewedByName: string;
    IsApproved: boolean;
    RowTotal: number
};

export type TrekReviewSaveRequest = {
    TrekReviewId: number;
    Star: number;
    Review: string;
    ReviewedByName: string;
    IsApproved: boolean;
    TrekId: number;
};

export const reviewAPI = createApi({
    reducerPath: "reviewAPI",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["Review"],
    endpoints: (builder) => ({
        /** User: list reviews (paged) */
        getUserReviews: builder.query<any, PaginationParams>({
            query: (params) => ({
                url: "/api/v1/review/user",
                method: "GET",
                params,
            }),
            providesTags: ["Review"],
        }),

        /** User: save (create/update) review */
        saveReview: builder.mutation<any, TrekReviewSaveRequest>({
            query: (data) => ({
                url: "/api/v1/review/save",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Review"],
        }),

        /** User: delete review by id */
        deleteReview: builder.mutation<any, number>({
            query: (id) => ({
                url: `/api/v1/review/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Review"],
        }),
    }),
});

export const {
    useGetUserReviewsQuery,
    useSaveReviewMutation,
    useDeleteReviewMutation,
} = reviewAPI;
