import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../config/apiConfig";
import { InExServiceSaveRequest, PaginationParams } from "../../types/trekTypes";

export const inExServiceAPI = createApi({
    reducerPath: "inExServiceAPI",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["InExService"],
    endpoints: (builder) => ({
        getAllInExServiceActive: builder.query<any, PaginationParams>({
            query: (params) => ({
                url: "/api/v1/inexservice/all/active",
                method: "GET",
                params,
            }),
            providesTags: ["InExService"],
        }),
        getAllInExService: builder.query<any, PaginationParams>({
            query: (params) => ({
                url: "/api/v1/inexservice/all",
                method: "GET",
                params,
            }),
            providesTags: ["InExService"],
        }),
        getInExServiceById: builder.query<any, number>({
            query: (id) => ({
                url: `/api/v1/inexservice/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "InExService", id }],
        }),
        deleteInExService: builder.mutation<any, number>({
            query: (id) => ({
                url: `/api/v1/inexservice/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["InExService"],
        }),
        saveInExService: builder.mutation<any, InExServiceSaveRequest>({
            query: (data) => ({
                url: "/api/v1/inexservice/save",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["InExService"],
        }),
    }),
});

export const {
    useGetAllInExServiceActiveQuery,
    useGetAllInExServiceQuery,
    useGetInExServiceByIdQuery,
    useDeleteInExServiceMutation,
    useSaveInExServiceMutation,
} = inExServiceAPI;
