import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../config/apiConfig";
import { ActivityLevelSaveRequest, PaginationParams } from "../../types/trekTypes";

export const activityLevelAPI = createApi({
    reducerPath: "activityLevelAPI",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["ActivityLevel"],
    endpoints: (builder) => ({
        getAllActivityLevelActive: builder.query<any, PaginationParams>({
            query: (params) => ({
                url: "/api/v1/activitylevel/all/active",
                method: "GET",
                params,
            }),
            providesTags: ["ActivityLevel"],
        }),
        getAllActivityLevel: builder.query<any, PaginationParams>({
            query: (params) => ({
                url: "/api/v1/activitylevel/all",
                method: "GET",
                params,
            }),
            providesTags: ["ActivityLevel"],
        }),
        getActivityLevelById: builder.query<any, number>({
            query: (id) => ({
                url: `/api/v1/activitylevel/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "ActivityLevel", id }],
        }),
        deleteActivityLevel: builder.mutation<any, number>({
            query: (id) => ({
                url: `/api/v1/activitylevel/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["ActivityLevel"],
        }),
        saveActivityLevel: builder.mutation<any, ActivityLevelSaveRequest>({
            query: (data) => ({
                url: "/api/v1/activitylevel/save",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["ActivityLevel"],
        }),
    }),
});

export const {
    useGetAllActivityLevelActiveQuery,
    useGetAllActivityLevelQuery,
    useGetActivityLevelByIdQuery,
    useDeleteActivityLevelMutation,
    useSaveActivityLevelMutation,
} = activityLevelAPI;
