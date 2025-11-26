import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../config/apiConfig";
import { PermitSaveRequest, PaginationParams } from "../../types/trekTypes";

export const permitAPI = createApi({
    reducerPath: "permitAPI",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["Permit"],
    endpoints: (builder) => ({
        getAllPermitActive: builder.query<any, PaginationParams>({
            query: (params) => ({
                url: "/api/v1/permit/all/active",
                method: "GET",
                params,
            }),
            providesTags: ["Permit"],
        }),
        getAllPermit: builder.query<any, PaginationParams>({
            query: (params) => ({
                url: "/api/v1/permit/all",
                method: "GET",
                params,
            }),
            providesTags: ["Permit"],
        }),
        getPermitById: builder.query<any, number>({
            query: (id) => ({
                url: `/api/v1/permit/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Permit", id }],
        }),
        deletePermit: builder.mutation<any, number>({
            query: (id) => ({
                url: `/api/v1/permit/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Permit"],
        }),
        savePermit: builder.mutation<any, PermitSaveRequest>({
            query: (data) => ({
                url: "/api/v1/permit/save",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Permit"],
        }),
    }),
});

export const {
    useGetAllPermitActiveQuery,
    useGetAllPermitQuery,
    useGetPermitByIdQuery,
    useDeletePermitMutation,
    useSavePermitMutation,
} = permitAPI;
