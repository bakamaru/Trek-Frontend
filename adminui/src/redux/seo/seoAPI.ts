import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../config/apiConfig";

export const seoAPI = createApi({
    reducerPath: "seoAPI",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["SEO"],
    endpoints: (builder) => ({
        getSeoAll: builder.query<any, { offset: number, limit: number, query: string }>({
            query: ({ offset, limit, query }) => ({
                url: `/api/v1/seo/all?offset=${offset}&limit=${limit}&query=${query}`,
                method: "GET",
            }),
            providesTags: ["SEO"],
        }),
        // GET /api/v1/seo/by-url?url=&type=
        getSeoByUrl: builder.query<any, { url: string; type: string }>({
            query: ({ url, type }) => ({
                url: `/api/v1/seo/by-url?url=${encodeURIComponent(
                    url
                )}&type=${encodeURIComponent(type)}`,
                method: "GET",
            }),
            providesTags: ["SEO"],
        }),

        // GET /api/v1/seo/meta?url=&type=
        getSeoMetaContents: builder.query<any, { url: string; type: string }>({
            query: ({ url, type }) => ({
                url: `/api/v1/seo/meta?url=${encodeURIComponent(
                    url
                )}&type=${encodeURIComponent(type)}`,
                method: "GET",
            }),
            providesTags: ["SEO"],
        }),

        // GET /api/v1/seo/by-id/{seoId}
        getSeoById: builder.query<any, number>({
            query: (seoId) => ({
                url: `/api/v1/seo/by-id/${seoId}`,
                method: "GET",
            }),
            providesTags: ["SEO"],
        }),

        // GET /api/v1/seo/by-seotype?seoType=&id=
        getSeoBySeoType: builder.query<any, { seoType: string; id: number }>({
            query: ({ seoType, id }) => ({
                url: `/api/v1/seo/by-seotype?seoType=${encodeURIComponent(
                    seoType
                )}&id=${id}`,
                method: "GET",
            }),
            providesTags: ["SEO"],
        }),

        // GET /api/v1/seo/by-product?productId=&type=
        getSeoByProductId: builder.query<any, { productId: number; type: string }>({
            query: ({ productId, type }) => ({
                url: `/api/v1/seo/by-product?productId=${productId}&type=${encodeURIComponent(
                    type
                )}`,
                method: "GET",
            }),
            providesTags: ["SEO"],
        }),

        // POST /api/v1/seo/check-url
        // body: { url: string, type: string }
        checkUrlExist: builder.mutation<any, { url: string; type: string }>({
            query: (body) => ({
                url: "/api/v1/seo/check-url",
                method: "POST",
                body,
            }),
            // not invalidating by default; change if you want
        }),

        // POST /api/v1/seo/new
        createSeo: builder.mutation<any, any>({
            query: (body) => ({
                url: "/api/v1/seo/new",
                method: "POST",
                body,
            }),
            invalidatesTags: ["SEO"],
        }),

        // POST /api/v1/seo/update
        updateSeo: builder.mutation<any, any>({
            query: (body) => ({
                url: "/api/v1/seo/update",
                method: "POST",
                body,
            }),
            invalidatesTags: ["SEO"],
        }),

        // DELETE /api/v1/seo/{seoId}
        deleteSeo: builder.mutation<any, number>({
            query: (seoId) => ({
                url: `/api/v1/seo/${seoId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["SEO"],
        }),

        // GET /api/v1/seo/jsonld/website
        generateJsonLdForWebsite: builder.query<any, void>({
            query: () => ({
                url: "/api/v1/seo/jsonld/website",
                method: "GET",
            }),
            providesTags: ["SEO"],
        }),

        // GET /api/v1/seo/jsonld/page
        generateJsonLdForPage: builder.query<any, void>({
            query: () => ({
                url: "/api/v1/seo/jsonld/page",
                method: "GET",
            }),
            providesTags: ["SEO"],
        }),

        // GET /api/v1/seo/jsonld/page/by-product?page=&productId=&type=
        generateJsonLdForPageByProduct: builder.query<
            any,
            { page: string; productId: number; type: string }
        >({
            query: ({ page, productId, type }) => ({
                url: `/api/v1/seo/jsonld/page/by-product?page=${encodeURIComponent(
                    page
                )}&productId=${productId}&type=${encodeURIComponent(type)}`,
                method: "GET",
            }),
            providesTags: ["SEO"],
        }),

        // GET /api/v1/seo/meta/generate
        generateMetaContents: builder.query<any, void>({
            query: () => ({
                url: "/api/v1/seo/meta/generate",
                method: "GET",
            }),
            providesTags: ["SEO"],
        }),
    }),
});

export const {
    useGetSeoAllQuery,
    useGetSeoByUrlQuery,
    useGetSeoMetaContentsQuery,
    useGetSeoByIdQuery,
    useGetSeoBySeoTypeQuery,
    useGetSeoByProductIdQuery,
    useCheckUrlExistMutation,
    useCreateSeoMutation,
    useUpdateSeoMutation,
    useDeleteSeoMutation,
    useGenerateJsonLdForWebsiteQuery,
    useGenerateJsonLdForPageQuery,
    useGenerateJsonLdForPageByProductQuery,
    useGenerateMetaContentsQuery,
} = seoAPI;
