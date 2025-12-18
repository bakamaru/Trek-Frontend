import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../config/apiConfig";

import { CspConfig, ApiConfig, AppBasicSecurity, FileConfig, WebSetting } from "../../types/settingTypes";
import { ApiResponse } from "../../types/trekTypes";

// Replace any with your real models if you have them.
export type Setting = any;
// export type CspConfig = any; // Removed in favor of imported type
// export type ApiConfig = any; // Removed in favor of imported type
export type OptimizationConfig = any;
// export type FileConfig = any; // Removed in favor of imported type
// export type AppBasicSecurity = any; // Removed in favor of imported type

export const settingAPI = createApi({
    reducerPath: "settingAPI",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["Setting", "CSP", "ApiConfig", "Optimization", "FileConfig", "BasicSecurity"],
    endpoints: (builder) => ({
        // GET api/v1/setting/web
        getWebSetting: builder.query<ApiResponse<WebSetting>, void>({
            query: () => ({ url: "/api/v1/setting/web", method: "GET" }),
            providesTags: ["Setting"],
        }),

        // POST api/v1/setting/web/save  (multipart/form-data because logo upload)
        saveWebSetting: builder.mutation<ApiResponse<any>, WebSetting>({
            query: (data) => {
                const formData = new FormData();

                // If your "Setting" object is complex, you may need to append fields explicitly.
                // This generic approach appends primitives; files must be appended as File.
                Object.entries(data ?? {}).forEach(([k, v]) => {
                    if (v === undefined || v === null) return;
                    if (v instanceof File) formData.append(k, v);
                    else formData.append(k, String(v));
                });

                return {
                    url: "/api/v1/setting/web/save",
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: ["Setting"],
        }),

        // POST api/v1/setting/app/restart
        restartApp: builder.mutation<any, void>({
            query: () => ({
                url: "/api/v1/setting/app/restart",
                method: "POST",
            }),
        }),

        // CSP
        getCspConfig: builder.query<ApiResponse<CspConfig>, void>({
            query: () => ({ url: "/api/v1/setting/csp", method: "GET" }),
            providesTags: ["CSP"],
        }),
        saveCspConfig: builder.mutation<ApiResponse<any>, CspConfig>({
            query: (data) => ({ url: "/api/v1/setting/csp/save", method: "POST", body: data }),
            invalidatesTags: ["CSP"],
        }),

        // API Config
        // API Config
        getApiConfig: builder.query<ApiResponse<ApiConfig>, void>({
            query: () => ({ url: "/api/v1/setting/api", method: "GET" }),
            providesTags: ["ApiConfig"],
        }),
        saveApiConfig: builder.mutation<ApiResponse<any>, ApiConfig>({
            query: (data) => ({ url: "/api/v1/setting/api/save", method: "POST", body: data }),
            invalidatesTags: ["ApiConfig"],
        }),

        // Optimization
        getOptimizationConfig: builder.query<any, void>({
            query: () => ({ url: "/api/v1/setting/optimization", method: "GET" }),
            providesTags: ["Optimization"],
        }),
        saveOptimizationConfig: builder.mutation<any, OptimizationConfig>({
            query: (data) => ({ url: "/api/v1/setting/optimization/save", method: "POST", body: data }),
            invalidatesTags: ["Optimization"],
        }),

        // File Config
        getFileConfig: builder.query<ApiResponse<FileConfig>, void>({
            query: () => ({ url: "/api/v1/setting/file", method: "GET" }),
            providesTags: ["FileConfig"],
        }),
        saveFileConfig: builder.mutation<ApiResponse<any>, FileConfig>({
            query: (data) => ({ url: "/api/v1/setting/file/save", method: "POST", body: data }),
            invalidatesTags: ["FileConfig"],
        }),

        // Basic Security
        getBasicSecurityConfig: builder.query<ApiResponse<AppBasicSecurity>, void>({
            query: () => ({ url: "/api/v1/setting/basic", method: "GET" }),
            providesTags: ["BasicSecurity"],
        }),
        saveBasicSecurityConfig: builder.mutation<ApiResponse<any>, AppBasicSecurity>({
            query: (data) => ({ url: "/api/v1/setting/basic/save", method: "POST", body: data }),
            invalidatesTags: ["BasicSecurity"],
        }),
    }),
});

export const {
    useGetWebSettingQuery,
    useSaveWebSettingMutation,
    useRestartAppMutation,
    useGetCspConfigQuery,
    useSaveCspConfigMutation,
    useGetApiConfigQuery,
    useSaveApiConfigMutation,
    useGetOptimizationConfigQuery,
    useSaveOptimizationConfigMutation,
    useGetFileConfigQuery,
    useSaveFileConfigMutation,
    useGetBasicSecurityConfigQuery,
    useSaveBasicSecurityConfigMutation,
} = settingAPI;
