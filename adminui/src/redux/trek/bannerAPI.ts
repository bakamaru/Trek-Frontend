import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../config/apiConfig";
import { BannerItemSaveRequest, BannerSaveRequest } from "../../types/trekTypes";

type BannerListQuery = {
    offset?: number;
    limit?: number;
    query?: string;
};

export const bannerAPI = createApi({
    reducerPath: "bannerAPI",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["Banner", "BannerItem"],
    endpoints: (builder) => ({
        // GET /api/v1/banner/all/active
        getActiveBanners: builder.query<any, BannerListQuery>({
            query: (params) => {
                const {
                    offset = 1,
                    limit = 20,
                    query = "",
                } = params ?? {};

                return {
                    url: `/api/v1/banner/all/active?offset=${offset}&limit=${limit}&query=${encodeURIComponent(
                        query
                    )}`,
                    method: "GET",
                };
            },
            providesTags: ["Banner"],
        }),

        // GET /api/v1/banner/all
        getAllBanners: builder.query<any, BannerListQuery>({
            query: (params) => {
                const {
                    offset = 1,
                    limit = 20,
                    query = "",
                } = params ?? {};

                return {
                    url: `/api/v1/banner/all?offset=${offset}&limit=${limit}&query=${encodeURIComponent(
                        query
                    )}`,
                    method: "GET",
                };
            },
            providesTags: ["Banner"],
        }),

        // GET /api/v1/banner/{id}
        getBannerById: builder.query<any, number>({
            query: (id) => ({
                url: `/api/v1/banner/${id}`,
                method: "GET",
            }),
            providesTags: ["Banner"],
        }),

        // POST /api/v1/banner/save
        saveBanner: builder.mutation<any, BannerSaveRequest>({
            query: (body) => ({
                url: "/api/v1/banner/save",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Banner"],
        }),

        // DELETE /api/v1/banner/{id}
        deleteBanner: builder.mutation<any, number>({
            query: (id) => ({
                url: `/api/v1/banner/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Banner", "BannerItem"],
        }),

        // GET /api/v1/banner/{bannerId}/item/all
        getBannerItemsByBannerId: builder.query<any, number>({
            query: (bannerId) => ({
                url: `/api/v1/banner/${bannerId}/item/all`,
                method: "GET",
            }),
            providesTags: ["BannerItem"],
        }),

        // GET /api/v1/banner/item/{bannerItemId}
        getBannerItemById: builder.query<any, number>({
            query: (bannerItemId) => ({
                url: `/api/v1/banner/item/${bannerItemId}`,
                method: "GET",
            }),
            providesTags: ["BannerItem"],
        }),

        // POST /api/v1/banner/item/save
        saveBannerItem: builder.mutation<any, BannerItemSaveRequest>({
            query: (body) => ({
                url: "/api/v1/banner/item/save",
                method: "POST",
                body,
            }),
            invalidatesTags: ["BannerItem", "Banner"],
        }),

        // DELETE /api/v1/banner/item/{bannerItemId}
        deleteBannerItem: builder.mutation<any, number>({
            query: (bannerItemId) => ({
                url: `/api/v1/banner/item/${bannerItemId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["BannerItem", "Banner"],
        }),

        // POST /api/v1/banner/item/sort
        sortBannerItems: builder.mutation<any, any[]>({
            query: (items) => ({
                url: "/api/v1/banner/item/sort",
                method: "POST",
                body: items,
            }),
            invalidatesTags: ["BannerItem"],
        }),

        // GET /api/v1/banner/item/by-key/{bannerKey}
        getBannerItemsByKey: builder.query<any, string>({
            query: (bannerKey) => ({
                url: `/api/v1/banner/item/by-key/${encodeURIComponent(
                    bannerKey
                )}`,
                method: "GET",
            }),
            providesTags: ["BannerItem"],
        }),
    }),
});

export const {
    useGetActiveBannersQuery,
    useGetAllBannersQuery,
    useGetBannerByIdQuery,
    useSaveBannerMutation,
    useDeleteBannerMutation,
    useGetBannerItemsByBannerIdQuery,
    useGetBannerItemByIdQuery,
    useSaveBannerItemMutation,
    useDeleteBannerItemMutation,
    useSortBannerItemsMutation,
    useGetBannerItemsByKeyQuery,
} = bannerAPI;
