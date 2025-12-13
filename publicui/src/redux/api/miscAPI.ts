import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../config/apiConfig";


export const miscAPI = createApi({
    reducerPath: "miscAPI",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["miscAPI"],
    endpoints: (builder) => ({
        getAllCountries: builder.query<any, any>({
            query: (params) => ({
                url: "/api/v1/misc/country/all",
                method: "GET",
                params,
            }),
            providesTags: ["miscAPI"],
        }),

    }),
});

export const {
    useGetAllCountriesQuery
} = miscAPI;
