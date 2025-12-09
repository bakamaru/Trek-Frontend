import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../config/apiConfig";

export const menuAPI = createApi({
    reducerPath: "menuAPI",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["Menu", "MenuGroup", "Role"],
    endpoints: (builder) => ({
        // GET /api/v1/menu/mainnavigation
        getMainNavigation: builder.query<any, void>({
            query: () => ({
                url: "/api/v1/menu/mainnavigation",
                method: "GET",
            }),
            providesTags: ["Menu"],
        }),

        // GET /api/v1/menu/group?groupId=&offset=&limit=&query=
        getMenuByGroup: builder.query<
            any,
            { groupId?: number; offset?: number; limit?: number; query?: string }
        >({
            query: ({
                groupId = 0,
                offset = 1,
                limit = 50,
                query = "",
            }) => ({
                url: `/api/v1/menu/group?groupId=${groupId}&offset=${offset}&limit=${limit}&query=${encodeURIComponent(
                    query
                )}`,
                method: "GET",
            }),
            providesTags: ["Menu"],
        }),

        // GET /api/v1/menu/backend
        getBackendMenus: builder.query<
            any,
            { offset?: number; limit?: number; query?: string }
        >({
            query: ({ offset = 0, limit = 50, query = "" } = {}) => ({
                url: `/api/v1/menu/backend?offset=${offset}&limit=${limit}&query=${encodeURIComponent(
                    query
                )}`,
                method: "GET",
            }),
            providesTags: ["Menu"],
        }),

        // GET /api/v1/menu/frontend
        getFrontendMenus: builder.query<
            any,
            { offset?: number; limit?: number; query?: string }
        >({
            query: ({ offset = 0, limit = 50, query = "" } = {}) => ({
                url: `/api/v1/menu/frontend?offset=${offset}&limit=${limit}&query=${encodeURIComponent(
                    query
                )}`,
                method: "GET",
            }),
            providesTags: ["Menu"],
        }),

        // GET /api/v1/menu/{id}
        getMenuById: builder.query<any, number>({
            query: (id) => ({
                url: `/api/v1/menu/${id}`,
                method: "GET",
            }),
            providesTags: ["Menu"],
        }),

        // POST /api/v1/menu/save
        saveMenu: builder.mutation<any, any>({
            query: (body) => ({
                url: "/api/v1/menu/save",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Menu"],
        }),

        // DELETE /api/v1/menu/{id}
        deleteMenu: builder.mutation<any, number>({
            query: (id) => ({
                url: `/api/v1/menu/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Menu"],
        }),

        // POST /api/v1/menu/order/save
        saveMenuOrder: builder.mutation<any, any[]>({
            query: (orders) => ({
                url: "/api/v1/menu/order/save",
                method: "POST",
                body: orders,
            }),
            invalidatesTags: ["Menu"],
        }),

        // GET /api/v1/menu/roles
        getRoles: builder.query<any, void>({
            query: () => ({
                url: "/api/v1/menu/roles",
                method: "GET",
            }),
            providesTags: ["Role"],
        }),

        // GET /api/v1/menu/groups
        getGroups: builder.query<any, void>({
            query: () => ({
                url: "/api/v1/menu/groups",
                method: "GET",
            }),
            providesTags: ["MenuGroup"],
        }),

        // POST /api/v1/menu/groups/save
        saveMenuGroup: builder.mutation<any, any>({
            query: (body) => ({
                url: "/api/v1/menu/groups/save",
                method: "POST",
                body,
            }),
            invalidatesTags: ["MenuGroup"],
        }),

        // DELETE /api/v1/menu/groups/delete/{id}
        deleteMenuGroup: builder.mutation<any, number>({
            query: (id) => ({
                url: `/api/v1/menu/groups/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["MenuGroup", "Menu"],
        }),
    }),
});

export const {
    useGetMainNavigationQuery,
    useGetMenuByGroupQuery,
    useGetBackendMenusQuery,
    useGetFrontendMenusQuery,
    useGetMenuByIdQuery,
    useSaveMenuMutation,
    useDeleteMenuMutation,
    useSaveMenuOrderMutation,
    useGetRolesQuery,
    useGetGroupsQuery,
    useSaveMenuGroupMutation,
    useDeleteMenuGroupMutation,
} = menuAPI;
