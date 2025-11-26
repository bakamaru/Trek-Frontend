import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../config/apiConfig";
import { TourTypeSaveRequest, PaginationParams } from "../../types/trekTypes";

export const tourTypeAPI = createApi({
    reducerPath: "tourTypeAPI",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["TourType"],
    endpoints: (builder) => ({
        getAllTourTypeActive: builder.query<any, PaginationParams>({
            query: (params) => ({
                url: "/api/v1/tourtype/all/active",
                method: "GET",
                params,
            }),
            providesTags: ["TourType"],
        }),
        getAllTourType: builder.query<any, PaginationParams>({
            query: (params) => ({
                url: "/api/v1/tourtype/all",
                method: "GET",
                params,
            }),
            providesTags: ["TourType"],
        }),
        getTourTypeById: builder.query<any, number>({
            query: (id) => ({
                url: `/api/v1/tourtype/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "TourType", id }],
        }),
        deleteTourType: builder.mutation<any, number>({
            query: (id) => ({
                url: `/api/v1/tourtype/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["TourType"],
        }),
        saveTourType: builder.mutation<any, TourTypeSaveRequest>({
            query: (data) => ({
                url: "/api/v1/tourtype/save",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["TourType"],
        }),
    }),
});

export const {
    useGetAllTourTypeActiveQuery,
    useGetAllTourTypeQuery,
    useGetTourTypeByIdQuery,
    useDeleteTourTypeMutation,
    useSaveTourTypeMutation,
} = tourTypeAPI;
