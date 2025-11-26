import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../config/apiConfig";
import { AccessibilitySaveRequest, PaginationParams } from "../../types/trekTypes";

export const accessibilityAPI = createApi({
    reducerPath: "accessibilityAPI",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["Accessibility"],
    endpoints: (builder) => ({
        getAllAccessibilityActive: builder.query<any, PaginationParams>({
            query: (params) => ({
                url: "/api/v1/accessibility/all/active",
                method: "GET",
                params,
            }),
            providesTags: ["Accessibility"],
        }),
        getAllAccessibility: builder.query<any, PaginationParams>({
            query: (params) => ({
                url: "/api/v1/accessibility/all",
                method: "GET",
                params,
            }),
            providesTags: ["Accessibility"],
        }),
        getAccessibilityById: builder.query<any, number>({
            query: (id) => ({
                url: `/api/v1/accessibility/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Accessibility", id }],
        }),
        deleteAccessibility: builder.mutation<any, number>({
            query: (id) => ({
                url: `/api/v1/accessibility/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Accessibility"],
        }),
        saveAccessibility: builder.mutation<any, AccessibilitySaveRequest>({
            query: (data) => ({
                url: "/api/v1/accessibility/save",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Accessibility"],
        }),
    }),
});

export const {
    useGetAllAccessibilityActiveQuery,
    useGetAllAccessibilityQuery,
    useGetAccessibilityByIdQuery,
    useDeleteAccessibilityMutation,
    useSaveAccessibilityMutation,
} = accessibilityAPI;
