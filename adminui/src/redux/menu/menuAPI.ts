import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../config/apiConfig";
import { PaginationParams } from "../../types/trekTypes";
import { MenuGroup, MenuOrderSaveRequest, MenuRole, MenuSaveRequest } from "../../types/menu";



export const menuAPI = createApi({
    reducerPath: "menuAPI",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["Menu", "MenuRole", "MenuGroup"],
    endpoints: (builder) => ({
        getMenusByGroup: builder.query<any, number>({
            query: (groupId) => ({
                url: `/api/v1/menu/group?groupId=${groupId}`,
                method: "GET",
            }),
            providesTags: ["Menu"],
        }),
        getMenuById: builder.query<any, number>({
            query: (id) => ({
                url: `/api/v1/menu/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Menu", id }],
        }),

        deleteMenu: builder.mutation<any, number>({
            query: (id) => ({
                url: `/api/v1/menu/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Menu"],
        }),

        saveMenu: builder.mutation<any, MenuSaveRequest>({
            query: (data) => ({
                url: "/api/v1/menu/save",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Menu"],
        }),

        saveMenuOrder: builder.mutation<any, MenuOrderSaveRequest>({
            query: (orders) => ({
                url: "/api/v1/menu/order/save",
                method: "POST",
                body: orders,
            }),
            invalidatesTags: ["Menu"],
        }),

        getMenuRoles: builder.query<any, void>({
            query: () => ({
                url: "/api/v1/menu/roles",
                method: "GET",
            }),
            providesTags: ["MenuRole"],
        }),

        getMenuGroups: builder.query<any, void>({
            query: () => ({
                url: "/api/v1/menu/groups",
                method: "GET",
            }),
            providesTags: ["MenuGroup"],
        }),

        saveMenuGroup: builder.mutation<any, MenuGroup>({
            query: (data) => ({
                url: "/api/v1/menu/groups/save",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["MenuGroup"],
        }),

        deleteMenuGroup: builder.mutation<any, number>({
            query: (id) => ({
                url: `/api/v1/menu/groups/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["MenuGroup"],
        }),
    }),
});

export const {
    useGetMenusByGroupQuery,
    useGetMenuByIdQuery,
    useDeleteMenuMutation,
    useSaveMenuMutation,
    useSaveMenuOrderMutation,
    useGetMenuRolesQuery,
    useGetMenuGroupsQuery,
    useSaveMenuGroupMutation,
    useDeleteMenuGroupMutation,
} = menuAPI;
