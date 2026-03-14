import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../config/apiConfig";
import {
    TrekBasicSaveRequest,
    ItinerarySaveRequest,
    TrekImageSaveRequest,
    TrekInclusionExclusionSaveRequest,
    TrekHighLightSaveRequest,
    TrekWhyUsSaveRequest,
    TrekRecommendedSessionSaveRequest,
    TrekFAQSaveRequest,
    TrekReviewSaveRequest,
    TrekDepartureSaveRequest,
    TrekGuideSaveRequest,
    PaginationParams,
} from "../../types/trekTypes";

export const trekAPI = createApi({
    reducerPath: "trekAPI",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["Trek"],
    endpoints: (builder) => ({
        getAllPopularTrek: builder.query<any, PaginationParams>({
            query: (params) => ({
                url: "/api/v1/trek/popular",
                method: "GET",
                params,
            }),
            providesTags: ["Trek"],
        }),
        getAllTrekActive: builder.query<any, PaginationParams>({
            query: (params) => ({
                url: "/api/v1/trek/all/active",
                method: "GET",
                params,
            }),
            providesTags: ["Trek"],
        }),
        getAllTrek: builder.query<any, PaginationParams>({
            query: (params) => ({
                url: "/api/v1/trek/all",
                method: "GET",
                params,
            }),
            providesTags: ["Trek"],
        }),
        getTrekDetail: builder.query<any, number>({
            query: (id) => ({
                url: `/api/v1/trek/detail/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Trek", id }],
        }),
        getTrekDetailByUrl: builder.query<any, string>({
            query: (url) => ({
                url: `/api/v1/trek/detail/byurl/${url}`,
                method: "GET",
            }),
            providesTags: ["Trek"],
        }),
        saveTrekBasic: builder.mutation<any, TrekBasicSaveRequest>({
            query: (data) => ({
                url: "/api/v1/trek/save-basic",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Trek"],
        }),
        deleteTrek: builder.mutation<any, number>({
            query: (id) => ({
                url: `/api/v1/trek/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Trek"],
        }),
        saveTrekItineraries: builder.mutation<any, { trekId: number; data: ItinerarySaveRequest[] }>({
            query: ({ trekId, data }) => ({
                url: `/api/v1/trek/${trekId}/itineraries/save`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Trek"],
        }),
        saveTrekGallery: builder.mutation<any, { trekId: number; data: FormData }>({
            query: ({ trekId, data }) => ({
                url: `/api/v1/trek/${trekId}/gallery/save`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Trek"],
        }),
        deleteTrekGallery: builder.mutation<any, { trekId: number; trekImageId: number }>({
            query: ({ trekId, trekImageId }) => ({
                url: `/api/v1/trek/${trekId}/gallery/delete/${trekImageId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Trek"],
        }),
        saveTrekInclusions: builder.mutation<any, { trekId: number; data: TrekInclusionExclusionSaveRequest[] }>({
            query: ({ trekId, data }) => ({
                url: `/api/v1/trek/${trekId}/inclusions/save`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Trek"],
        }),
        saveTrekHighlights: builder.mutation<any, { trekId: number; data: TrekHighLightSaveRequest[] }>({
            query: ({ trekId, data }) => ({
                url: `/api/v1/trek/${trekId}/highlights/save`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Trek"],
        }),
        saveTrekWhyUs: builder.mutation<any, { trekId: number; data: TrekWhyUsSaveRequest[] }>({
            query: ({ trekId, data }) => ({
                url: `/api/v1/trek/${trekId}/whyus/save`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Trek"],
        }),
        saveTrekRecommendedSessions: builder.mutation<any, { trekId: number; data: TrekRecommendedSessionSaveRequest[] }>({
            query: ({ trekId, data }) => ({
                url: `/api/v1/trek/${trekId}/recommendedsessions/save`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Trek"],
        }),
        saveTrekFaqs: builder.mutation<any, { trekId: number; data: TrekFAQSaveRequest[] }>({
            query: ({ trekId, data }) => ({
                url: `/api/v1/trek/${trekId}/faqs/save`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Trek"],
        }),
        saveTrekReviews: builder.mutation<any, { trekId: number; data: TrekReviewSaveRequest[] }>({
            query: ({ trekId, data }) => ({
                url: `/api/v1/trek/${trekId}/reviews/save`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Trek"],
        }),
        deleteTrekReview: builder.mutation<any, { trekId: number; trekReviewId: number }>({
            query: ({ trekId, trekReviewId }) => ({
                url: `/api/v1/trek/${trekId}/reviews/delete/${trekReviewId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Trek"],
        }),
        saveTrekDepartures: builder.mutation<any, { trekId: number; data: TrekDepartureSaveRequest[] }>({
            query: ({ trekId, data }) => ({
                url: `/api/v1/trek/${trekId}/departures/save`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Trek"],
        }),
        saveTrekGuides: builder.mutation<any, { trekId: number; data: TrekGuideSaveRequest[] }>({
            query: ({ trekId, data }) => ({
                url: `/api/v1/trek/${trekId}/guides/save`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Trek"],
        }),
        // Public review submission
        submitTrekReview: builder.mutation<any, { trekId: number; star: number; review: string; reviewedByName: string }>({
            query: ({ trekId, star, review, reviewedByName }) => ({
                url: `/api/v1/trek/${trekId}/review/submit`,
                method: "POST",
                body: { Star: star, Review: review, ReviewedByName: reviewedByName },
            }),
            invalidatesTags: ["Trek"],
        }),
    }),
});

export const {
    useGetAllPopularTrekQuery,
    useGetAllTrekActiveQuery,
    useGetAllTrekQuery,
    useGetTrekDetailQuery,
    useGetTrekDetailByUrlQuery,
    useSaveTrekBasicMutation,
    useDeleteTrekMutation,
    useSaveTrekItinerariesMutation,
    useSaveTrekGalleryMutation,
    useSaveTrekInclusionsMutation,
    useSaveTrekHighlightsMutation,
    useSaveTrekWhyUsMutation,
    useSaveTrekRecommendedSessionsMutation,
    useSaveTrekFaqsMutation,
    useSaveTrekReviewsMutation,
    useSaveTrekDeparturesMutation,
    useSaveTrekGuidesMutation,
    useDeleteTrekGalleryMutation,
    useDeleteTrekReviewMutation,
    useSubmitTrekReviewMutation
} = trekAPI;
