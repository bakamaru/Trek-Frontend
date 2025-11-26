import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ITokenResponse } from "../../types";
import { BaseEndpoints } from "../../config/BaseEndpoints";

interface LoginRequest {
    username: string;
    password?: string;
    grant_type: string;
    client_id: string;
    client_secret: string;
    scope?: string;
}

export const userAPI = createApi({
    reducerPath: "userAPI",
    baseQuery: fetchBaseQuery({ baseUrl: BaseEndpoints.base }),
    endpoints: (builder) => ({
        login: builder.mutation<ITokenResponse, LoginRequest>({
            query: (credentials) => ({
                url: "/connect/token",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    grant_type: credentials.grant_type,
                    client_id: credentials.client_id,
                    client_secret: credentials.client_secret,
                    username: credentials.username,
                    password: credentials.password || '', // Optional password
                    scope: credentials.scope || ''
                }),
            }),
        }),
        getUserProfile: builder.query<ITokenResponse, undefined | void>({
            query: () => ({
                url: "/api/v1/user/profile",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }),
        }),
    }),
});

export const {
    useGetUserProfileQuery,
    useLazyGetUserProfileQuery,
    useLoginMutation
} = userAPI;
