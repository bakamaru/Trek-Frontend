import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../config/apiConfig";
import { ActivityTypeSaveRequest, PaginationParams } from "../../types/trekTypes";

export const activityTypeAPI = createApi({
    reducerPath: "activityTypeAPI",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["ActivityType"],
    endpoints: (builder) => ({
        getAllActivityTypeActive: builder.query<any, PaginationParams>({
            query: (params) => ({
                url: "/api/v1/activitytype/all/active",
                method: "GET",
                params,
            }),
            providesTags: ["ActivityType"],
        }),
        getAllActivityType: builder.query<any, PaginationParams>({
            query: (params) => ({
                url: "/api/v1/activitytype/all",
                method: "GET",
                params,
            }),
            providesTags: ["ActivityType"],
        }),
        getActivityTypeById: builder.query<any, number>({
            query: (id) => ({
                url: `/api/v1/activitytype/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "ActivityType", id }],
        }),
        deleteActivityType: builder.mutation<any, number>({
            query: (id) => ({
                url: `/api/v1/activitytype/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["ActivityType"],
        }),
        saveActivityType: builder.mutation<any, ActivityTypeSaveRequest>({
            query: (data) => ({
                url: "/api/v1/activitytype/save",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["ActivityType"],
        }),
    }),
});

export const {
    useGetAllActivityTypeActiveQuery,
    useGetAllActivityTypeQuery,
    useGetActivityTypeByIdQuery,
    useDeleteActivityTypeMutation,
    useSaveActivityTypeMutation,
} = activityTypeAPI;
