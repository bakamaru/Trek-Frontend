import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../config/apiConfig";

export interface PagedQueryArgs {
    offset?: number;
    limit?: number;
    query?: string;
}

export interface DestinationTrekQueryArgs extends PagedQueryArgs {
    destinationId: number;
}

// Destination DTO (matches backend Destination model)
export interface Destination {
    DestinationId: number;
    CountryId: number;
    CountryName: string;
    CountrySubtitle: string;
    Name: string;
    Description?: string;
    ShortDescription?: string;
    CoverImage?: string;
    ThumbnailImage?: string;
    IsTopDestination?: boolean;
}

const DEFAULT_OFFSET = 1;
const DEFAULT_LIMIT = 20;
const DEFAULT_QUERY = "";

export const destinationAPI = createApi({
    reducerPath: "destinationAPI",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["Destination"],
    endpoints: (builder) => ({
        // /api/v1/destination/all/active
        getDestinationsActive: builder.query<any, PagedQueryArgs | undefined>({
            query: (params) => {
                const {
                    offset = DEFAULT_OFFSET,
                    limit = DEFAULT_LIMIT,
                    query = DEFAULT_QUERY,
                } = params || {};

                return {
                    url: "/api/v1/destination/all/active",
                    method: "GET",
                    params: { offset, limit, query },
                };
            },
            providesTags: ["Destination"],
        }),

        // /api/v1/destination/all
        getDestinations: builder.query<any, PagedQueryArgs | undefined>({
            query: (params) => {
                const {
                    offset = DEFAULT_OFFSET,
                    limit = DEFAULT_LIMIT,
                    query = DEFAULT_QUERY,
                } = params || {};

                return {
                    url: "/api/v1/destination/all",
                    method: "GET",
                    params: { offset, limit, query },
                };
            },
            providesTags: ["Destination"],
        }),

        // GET /api/v1/destination/byslug/{slug}
        getDestinationBySlug: builder.query<any, string>({
            query: (slug) => ({
                url: `/api/v1/destination/byslug/${encodeURIComponent(slug)}`,
                method: 'GET',
            }),
            providesTags: ["Destination"],
        }),

        // /api/v1/destination/{id}
        getDestinationById: builder.query<any, number>({
            query: (id) => ({
                url: `/api/v1/destination/${id}`,
                method: "GET",
            }),
            providesTags: ["Destination"],
        }),

        // /api/v1/destination/top/all
        getTopDestinations: builder.query<any, PagedQueryArgs | undefined>({
            query: (params) => {
                const {
                    offset = DEFAULT_OFFSET,
                    limit = DEFAULT_LIMIT,
                    query = DEFAULT_QUERY,
                } = params || {};

                return {
                    url: "/api/v1/destination/top/all",
                    method: "GET",
                    params: { offset, limit, query },
                };
            },
            providesTags: ["Destination"],
        }),

        // /api/v1/destination/trek/all
        getDestinationTreks: builder.query<any, DestinationTrekQueryArgs | undefined>({
            query: (params) => {
                const {
                    destinationId,
                    offset = DEFAULT_OFFSET,
                    limit = DEFAULT_LIMIT,
                    query = DEFAULT_QUERY,
                } = params || ({} as DestinationTrekQueryArgs);

                return {
                    url: "/api/v1/destination/trek/all",
                    method: "GET",
                    params: { destinationId, offset, limit, query },
                };
            },
        }),

        // /api/v1/destination/save  (form-data / x-www-form-urlencoded with files)
        saveDestination: builder.mutation<any, FormData>({
            query: (formData) => ({
                url: "/api/v1/destination/save",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Destination"],
        }),

        // /api/v1/destination/{id} (DELETE)
        deleteDestination: builder.mutation<any, number>({
            query: (id) => ({
                url: `/api/v1/destination/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Destination"],
        }),
    }),
});

export const {
    useGetDestinationsActiveQuery,
    useGetDestinationsQuery,
    useGetDestinationBySlugQuery,
    useGetDestinationByIdQuery,
    useGetTopDestinationsQuery,
    useGetDestinationTreksQuery,
    useSaveDestinationMutation,
    useDeleteDestinationMutation,
} = destinationAPI;
