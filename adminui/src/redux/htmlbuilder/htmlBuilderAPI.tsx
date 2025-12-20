import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../config/apiConfig";
import { PaginationParams } from "../../types/trekTypes";

// Adjust these imports/paths to match your project structure
import {
    HtmlComponentSaveRequest,
    HtmlComponentDetailDto,
    HtmlComponentItemDto,
} from "../../types/builderTypes";

export type CheckUniqueParams = {
    name: string;
    oldName?: string;
    htmlComponentId?: number;
};

export const htmlBuilderAPI = createApi({
    reducerPath: "htmlBuilderAPI",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["HtmlComponent"],
    endpoints: (builder) => ({
        getActiveHtmlComponents: builder.query<
            any,
            PaginationParams
        >({
            query: ({ offset = 1, limit = 20, query = "" }: any) => ({
                url: `/api/v1/htmlcomponent/all/active?offset=${offset}&limit=${limit}&query=${encodeURIComponent(
                    query ?? ""
                )}`,
                method: "GET",
            }),
            providesTags: ["HtmlComponent"],
        }),

        getAllHtmlComponents: builder.query<any, PaginationParams>({
            query: ({ offset = 1, limit = 20, query = "" }: any) => ({
                url: `/api/v1/htmlcomponent/all?offset=${offset}&limit=${limit}&query=${encodeURIComponent(
                    query ?? ""
                )}`,
                method: "GET",
            }),
            providesTags: ["HtmlComponent"],
        }),
        getHtmlComponentById: builder.query<any, number>({
            query: (id) => ({
                url: `/api/v1/htmlcomponent/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "HtmlComponent", id }],
        }),
        checkHtmlComponentNameUnique: builder.query<any, CheckUniqueParams>({
            query: ({ name, oldName = "", htmlComponentId = 0 }) => ({
                url: `/api/v1/htmlcomponent/check/unique?name=${encodeURIComponent(
                    name ?? ""
                )}&oldName=${encodeURIComponent(oldName ?? "")}&htmlComponentId=${htmlComponentId ?? 0}`,
                method: "GET",
            }),
        }),

        saveHtmlComponent: builder.mutation<any, HtmlComponentSaveRequest>({
            query: (data) => ({
                url: "/api/v1/htmlcomponent/save",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["HtmlComponent"],
        }),
        deleteHtmlComponent: builder.mutation<any, number>({
            query: (id) => ({
                url: `/api/v1/htmlcomponent/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["HtmlComponent"],
        }),
    }),
});

export const {
    useGetActiveHtmlComponentsQuery,
    useGetAllHtmlComponentsQuery,
    useGetHtmlComponentByIdQuery,
    useCheckHtmlComponentNameUniqueQuery,
    useSaveHtmlComponentMutation,
    useDeleteHtmlComponentMutation,
    useLazyCheckHtmlComponentNameUniqueQuery
} = htmlBuilderAPI;
