import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../config/apiConfig";
import {
    TrekRegionSaveRequest,
    PaginationParams,
    ApiResponse,
} from "../../types/trekTypes";

export const trekRegionAPI = createApi({
    reducerPath: "trekRegionAPI",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["TrekRegion"],
    endpoints: (builder) => ({
        // User: get all active regions (paged)
        getAllTrekRegionActive: builder.query<any, PaginationParams>({
            query: (params) => ({
                url: "/api/v1/trekregion/all/active",
                method: "GET",
                params,
            }),
            providesTags: ["TrekRegion"],
        }),

        // Admin: get all (active+inactive) non-deleted regions (paged)
        getAllTrekRegion: builder.query<any, PaginationParams>({
            query: (params) => ({
                url: "/api/v1/trekregion/all",
                method: "GET",
                params,
            }),
            providesTags: ["TrekRegion"],
        }),

        // Admin: get single region by id
        getTrekRegionById: builder.query<any, number>({
            query: (id) => ({
                url: `/api/v1/trekregion/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "TrekRegion", id }],
        }),

        // Admin: delete (soft delete)
        deleteTrekRegion: builder.mutation<any, number>({
            query: (id) => ({
                url: `/api/v1/trekregion/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["TrekRegion"],
        }),

        // Admin: save (create or update)
        saveTrekRegion: builder.mutation<any, TrekRegionSaveRequest>({
            query: (data) => ({
                url: "/api/v1/trekregion/save",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["TrekRegion"],
        }),
    }),
});

export const {
    useGetAllTrekRegionActiveQuery,
    useGetAllTrekRegionQuery,
    useGetTrekRegionByIdQuery,
    useDeleteTrekRegionMutation,
    useSaveTrekRegionMutation,
} = trekRegionAPI;
