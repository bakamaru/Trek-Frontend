import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../config/apiConfig";

export type ModuleActionRequest = { moduleName: string };

export const moduleAPI = createApi({
    reducerPath: "moduleAPI",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["Module"],
    endpoints: (builder) => ({
        // GET api/v1/module/all?pageNo=&pageSize=&status=&query=
        getModules: builder.query<any, { pageNo?: number; pageSize?: number; status?: number; query?: string }>({
            query: ({ pageNo = 1, pageSize = 8, status = 1, query = "" }) => ({
                url: `/api/v1/module/all?pageNo=${pageNo}&pageSize=${pageSize}&status=${status}&query=${encodeURIComponent(
                    query
                )}`,
                method: "GET",
            }),
            providesTags: ["Module"],
        }),

        // POST api/v1/module/install
        installModule: builder.mutation<any, ModuleActionRequest>({
            query: (data) => ({
                url: "/api/v1/module/install",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Module"],
        }),

        // POST api/v1/module/uninstall
        uninstallModule: builder.mutation<any, ModuleActionRequest>({
            query: (data) => ({
                url: "/api/v1/module/uninstall",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Module"],
        }),
    }),
});

export const { useGetModulesQuery, useInstallModuleMutation, useUninstallModuleMutation } = moduleAPI;
