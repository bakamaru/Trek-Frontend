import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../config/apiConfig";
import { CitySaveRequest, PaginationParams } from "../../types/trekTypes";

export const cityAPI = createApi({
    reducerPath: "cityAPI",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["City"],
    endpoints: (builder) => ({
        getAllCityActive: builder.query<any, PaginationParams>({
            query: (params) => ({
                url: "/api/v1/city/all/active",
                method: "GET",
                params,
            }),
            providesTags: ["City"],
        }),
        getAllCity: builder.query<any, PaginationParams>({
            query: (params) => ({
                url: "/api/v1/city/all",
                method: "GET",
                params,
            }),
            providesTags: ["City"],
        }),
        getCityById: builder.query<any, number>({
            query: (id) => ({
                url: `/api/v1/city/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "City", id }],
        }),
        deleteCity: builder.mutation<any, number>({
            query: (id) => ({
                url: `/api/v1/city/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["City"],
        }),
        saveCity: builder.mutation<any, CitySaveRequest>({
            query: (data) => ({
                url: "/api/v1/city/save",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["City"],
        }),
    }),
});

export const {
    useGetAllCityActiveQuery,
    useGetAllCityQuery,
    useGetCityByIdQuery,
    useDeleteCityMutation,
    useSaveCityMutation,
} = cityAPI;
