import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../config/apiConfig";
import {
    TrekCategorySaveRequest,
    PaginationParams,
    ApiResponse,
} from "../../types/trekTypes";

export const trekCategoryAPI = createApi({
    reducerPath: "trekCategoryAPI",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["TrekCategory"],
    endpoints: (builder) => ({
        // User: get all active categories (paged)
        getAllTrekCategoryActive: builder.query<any, PaginationParams>({
            query: (params) => ({
                url: "/api/v1/trekcategory/all/active",
                method: "GET",
                params,
            }),
            providesTags: ["TrekCategory"],
        }),

        // Admin: get all (active+inactive) non-deleted categories (paged)
        getAllTrekCategory: builder.query<any, PaginationParams>({
            query: (params) => ({
                url: "/api/v1/trekcategory/all",
                method: "GET",
                params,
            }),
            providesTags: ["TrekCategory"],
        }),

        // Admin: get single category by id
        getTrekCategoryById: builder.query<any, number>({
            query: (id) => ({
                url: `/api/v1/trekcategory/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "TrekCategory", id }],
        }),

        // Admin: delete (soft delete)
        deleteTrekCategory: builder.mutation<any, number>({
            query: (id) => ({
                url: `/api/v1/trekcategory/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["TrekCategory"],
        }),

        // Admin: save (create or update)
        saveTrekCategory: builder.mutation<any, TrekCategorySaveRequest>({
            query: (data) => ({
                url: "/api/v1/trekcategory/save",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["TrekCategory"],
        }),
    }),
});

export const {
    useGetAllTrekCategoryActiveQuery,
    useGetAllTrekCategoryQuery,
    useGetTrekCategoryByIdQuery,
    useDeleteTrekCategoryMutation,
    useSaveTrekCategoryMutation,
} = trekCategoryAPI;
