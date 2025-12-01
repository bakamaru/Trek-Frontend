import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../config/apiConfig";

export const authAPI = createApi({
    reducerPath: "authAPI",
    baseQuery: baseQueryWithAuth,
    endpoints: (builder) => ({
        getLoginStatus: builder.query({
            query: () => ({
                url: "/api/v1/auth/status",
                method: "GET",
            }),
        }),
    }),
});

export const { useGetLoginStatusQuery } = authAPI;
