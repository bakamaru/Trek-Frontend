import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../config/apiConfig";

export const tourAPI = createApi({
    reducerPath: "tourAPI",
    baseQuery: baseQueryWithAuth,
    endpoints: (builder) => ({
        getTopDestinations: builder.query({
            query: () => ({
                url: "/api/v1/tour/destinations/top",
                method: "GET",
            }),
        }),
        getPopularTours: builder.query({
            query: () => ({
                url: "/api/v1/tour/popular",
                method: "GET",
            }),
        }),
        getTrekDetail: builder.query({
            query: (id) => ({
                url: `/api/v1/tour/trek/${id}`,
                method: "GET",
            }),
        }),
    }),
});

export const {
    useGetTopDestinationsQuery,
    useGetPopularToursQuery,
    useGetTrekDetailQuery,
} = tourAPI;
