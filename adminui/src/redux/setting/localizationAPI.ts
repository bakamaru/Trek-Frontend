import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../config/apiConfig";
import { ApiResponse, PaginatedResponse } from "../../types/common";
import {
    LocaleRegion,
    Country,
    LocalizationImportRequest,
    SetDefaultLocaleRequest,
    SetLanguageRequest,
    LocaleResource
} from "../../types/settingTypes";

export const localizationAPI = createApi({
    reducerPath: "localizationAPI",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["LocaleRegion", "LocaleResource", "Country"],
    endpoints: (builder) => ({
        // GET api/v1/localization/region/all?pageNo=&rowsPerPage=&query=
        getRegions: builder.query<PaginatedResponse<LocaleRegion>, { pageNo?: number; rowsPerPage?: number; query?: string }>({
            query: ({ pageNo = 1, rowsPerPage = 10, query = "" }) => ({
                url: `/api/v1/localization/region/all?pageNo=${pageNo}&rowsPerPage=${rowsPerPage}&query=${encodeURIComponent(
                    query
                )}`,
                method: "GET",
            }),
            providesTags: ["LocaleRegion"],
        }),

        // GET api/v1/localization/region/{id}
        getRegion: builder.query<ApiResponse<LocaleRegion>, number>({
            query: (id) => ({
                url: `/api/v1/localization/region/byid/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "LocaleRegion", id }],
        }),

        // GET api/v1/localization/country/all
        getCountries: builder.query<ApiResponse<Country[]>, void>({
            query: () => ({ url: "/api/v1/localization/country/all", method: "GET" }),
            providesTags: ["Country"],
        }),

        // POST api/v1/localization/import  (multipart/form-data)
        importLocalization: builder.mutation<ApiResponse<any>, LocalizationImportRequest>({
            query: ({ ImportFile }) => {
                const formData = new FormData();
                if (ImportFile) formData.append("ImportFile", ImportFile);
                return {
                    url: "/api/v1/localization/import",
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: ["LocaleRegion", "LocaleResource"],
        }),

        // POST api/v1/localization/region/new
        createRegion: builder.mutation<ApiResponse<any>, Partial<LocaleRegion>>({
            query: (data) => ({
                url: "/api/v1/localization/region/new",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["LocaleRegion"],
        }),

        // POST api/v1/localization/region/update
        updateRegion: builder.mutation<ApiResponse<any>, LocaleRegion>({
            query: (data) => ({
                url: `/api/v1/localization/region/update`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["LocaleRegion"],
        }),

        // GET api/v1/localization/region/{localRegionId}/resource/all?pageNo=&limit=
        getResources: builder.query<PaginatedResponse<LocaleResource>, { localRegionId: number; pageNo?: number; limit?: number; query?: string }>({
            query: ({ localRegionId, pageNo = 1, limit = 20, query = "" }) => ({
                url: `/api/v1/localization/region/${localRegionId}/resource/all?pageNo=${pageNo}&limit=${limit}&query=${query}`,
                method: "GET",
            }),
            transformResponse: (response: ApiResponse<any>) => {
                return {
                    Code: response.Code,
                    Message: response.Message,
                    Data: response.Data.Resources,
                    RowTotal: response.Data.Resources && response.Data.Resources.length > 0
                        ? response.Data.Resources[0].RowTotal
                        : response.Data.RowTotal,
                    Errors: response.Errors
                };
            },
            providesTags: ["LocaleResource"],
        }),

        // GET api/v1/localization/export/{localRegionId}  (returns XLSX)
        exportLocalization: builder.query<Blob, { localRegionId: number }>({
            query: ({ localRegionId }) => ({
                url: `/api/v1/localization/export/${localRegionId}`,
                method: "GET",
                responseHandler: async (response) => await response.blob(),
            }),
        }),

        // POST api/v1/localization/set-default
        setDefaultLocale: builder.mutation<ApiResponse<any>, SetDefaultLocaleRequest>({
            query: (data) => ({
                url: "/api/v1/localization/set-default",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["LocaleRegion", "LocaleResource"],
        }),

        // POST api/v1/localization/resource/save
        saveLocaleResource: builder.mutation<ApiResponse<any>, LocaleResource>({
            query: (data) => ({
                url: "/api/v1/localization/resource/save", // endpoint from razor: /admin/localization/update/locale
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["LocaleResource"],
        }),

        // DELETE api/v1/localization/region/{id}
        deleteRegion: builder.mutation<ApiResponse<any>, number>({
            query: (id) => ({
                url: `/api/v1/localization/delete`, // endpoint from razor: /admin/localization/delete
                method: "POST", // Razor uses POST for delete usually or expects simple post with ID
                body: { id }
            }),
            invalidatesTags: ["LocaleRegion", "LocaleResource"],
        }),

        // POST api/v1/localization/language
        setLanguage: builder.mutation<ApiResponse<any>, SetLanguageRequest>({
            query: (data) => ({
                url: "/api/v1/localization/language",
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const {
    useGetRegionsQuery,
    useGetRegionQuery,
    useGetCountriesQuery,
    useImportLocalizationMutation,
    useCreateRegionMutation,
    useUpdateRegionMutation,
    useGetResourcesQuery,
    useExportLocalizationQuery,
    useLazyExportLocalizationQuery,
    useSetDefaultLocaleMutation,
    useSaveLocaleResourceMutation,
    useDeleteRegionMutation,
    useSetLanguageMutation,
} = localizationAPI;
