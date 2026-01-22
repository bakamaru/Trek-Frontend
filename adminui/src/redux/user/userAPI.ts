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
        token: builder.mutation<ITokenResponse, { CLIENT_ID: string, REDIRECT_URI: string, code: string, codeVerifier: string }>({
            query: ({ CLIENT_ID, REDIRECT_URI, code, codeVerifier }) => ({
                url: "/connect/token",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    client_id: CLIENT_ID,
                    redirect_uri: REDIRECT_URI,
                    code: code,
                    code_verifier: codeVerifier,
                }),
            }),
        }),
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
        getRoles: builder.query<any, any>({
            query: (params) => ({
                url: "/api/v1/role/all",
                params,
            }),
        }),
        addRole: builder.mutation<any, any>({
            query: (body) => ({
                url: "/api/v1/role/save",
                method: "POST",
                body: body,
            }),
        }),
        updateRole: builder.mutation<any, any>({
            query: (body) => ({
                url: `/api/v1/role/save`,
                method: "POST",
                body: body,
            }),
        }),
        deleteRole: builder.mutation<any, number>({
            query: (body) => ({
                url: `/api/v1/role/delete`,
                method: "POST",
                body: { Id: body },
            }),
        }),

        getUsers: builder.query<any, any>({
            query: (params) => ({
                url: "/api/v1/user/management/all",
                params,
            }),
        }),
        addUser: builder.mutation<any, any>({
            query: (body) => ({
                url: "/api/v1/user/management/save",
                method: "POST",
                body,
            }),
        }),
        updateUser: builder.mutation<any, any>({
            query: (body) => ({
                url: `/api/v1/user/management/save`,
                method: "POST",
                body,
            }),
        }),
        deleteUser: builder.mutation<any, number>({
            query: (body) => ({
                url: `/api/v1/user/management/delete`,
                method: "POST",
                body,
            }),
        }),
        resetPassword: builder.mutation<any, any>({
            query: (body) => ({
                url: `/api/v1/user/management/resetpassword`,
                method: "POST",
                body,
            }),
        }),
        getLoginHistory: builder.query<any, number>({
            query: (userId) => ({
                url: `/api/v1/user/management/login-history/${userId}`,
            }),
        }),
        getOrganizations: builder.query<any, any>({
            query: (params) => ({
                url: "/api/v1/organization/all",
                params,
            }),
        }),
        getUserById: builder.query<any, number>({
            query: (id) => ({
                url: `/api/v1/user/management/${id}`,
            }),
            //providesTags: (result, error, id) => [{ type: "Users", id }],
        }),

        getRoleById: builder.query<any, number>({
            query: (id) => ({
                url: `/api/v1/role/${id}`,
            }),
            //providesTags: (result, error, id) => [{ type: "Roles", id }],
        }),

    }),
});

export const {
    useTokenMutation,
    useGetUserProfileQuery,
    useLazyGetUserProfileQuery,
    useLoginMutation,
    useGetRolesQuery,
    useLazyGetRolesQuery,
    useAddRoleMutation,
    useUpdateRoleMutation,
    useDeleteRoleMutation,
    useGetRoleByIdQuery,
    useGetUsersQuery,
    useLazyGetUsersQuery,
    useAddUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useResetPasswordMutation,
    useGetLoginHistoryQuery,
    useLazyGetLoginHistoryQuery,
    useGetUserByIdQuery,
} = userAPI;
