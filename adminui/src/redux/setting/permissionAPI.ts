import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../config/apiConfig";

export type RolePermissionViewModel = any;

export const permissionAPI = createApi({
    reducerPath: "permissionAPI",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["Permission", "Role"],
    endpoints: (builder) => ({
        // GET api/v1/permission/role/all
        getRoles: builder.query<any, void>({
            query: () => ({ url: "/api/v1/permission/role/all", method: "GET" }),
            providesTags: ["Role"],
        }),

        // GET api/v1/permission/role/{roleId}
        getRolePermissions: builder.query<any, number>({
            query: (roleId) => ({
                url: `/api/v1/permission/role/${roleId}`,
                method: "GET",
            }),
            providesTags: (result, error, roleId) => [{ type: "Permission", id: roleId }],
        }),

        // POST api/v1/permission/role/{roleId}/save
        saveRolePermissions: builder.mutation<any, { roleId: number; data: RolePermissionViewModel }>({
            query: ({ roleId, data }) => ({
                url: `/api/v1/permission/role/${roleId}/save`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Permission", id: arg.roleId },
                "Role",
            ],
        }),
    }),
});

export const { useGetRolesQuery, useGetRolePermissionsQuery, useSaveRolePermissionsMutation } = permissionAPI;
