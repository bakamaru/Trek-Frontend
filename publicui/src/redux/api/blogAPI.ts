// src/redux/api/blogAPI.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../config/apiConfig";
import { Post, ApiResponse, PostWithSEO } from "../../types/blogTypes";

type LatestPostQuery = {
    offset?: number;
    limit?: number;
};

type RelatedPostsQuery = {
    page?: number;
    limit?: number;
    postId?: number;
};

type CategoryListQuery = {
    page?: number;
    limit?: number;
};

const DEFAULT_OFFSET = 1;
const DEFAULT_LIMIT_LATEST = 12;
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const blogAPI = createApi({
    reducerPath: "blogAPI",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["Blog", "BlogCategory", "BlogSetting"],
    endpoints: (builder) => ({
        // GET /api/v1/post/latest?offset&limit
        getLatestPosts: builder.query<ApiResponse<Post[]>, LatestPostQuery>({
            query: (params = {}) => {
                const {
                    offset = DEFAULT_OFFSET,
                    limit = DEFAULT_LIMIT_LATEST,
                } = params;

                return {
                    url: "/api/v1/post/latest",
                    method: "GET",
                    params: { offset, limit },
                };
            },
            providesTags: ["Blog"],
        }),

        // GET /api/v1/post/detail/{url}
        getPostDetailByUrl: builder.query<ApiResponse<PostWithSEO>, string>({
            query: (urlSlug) => ({
                url: `/api/v1/post/detail/${encodeURIComponent(urlSlug)}`,
                method: "GET",
            }),
            providesTags: ["Blog"],
        }),

        // GET /api/v1/post/setting
        getBlogSettings: builder.query<any, void>({
            query: () => ({
                url: "/api/v1/post/setting",
                method: "GET",
            }),
            providesTags: ["BlogSetting"],
        }),

        // GET /api/v1/post/related/all?page&limit&postId
        getRelatedPosts: builder.query<any, RelatedPostsQuery>({
            query: (params = {}) => {
                const {
                    page = DEFAULT_PAGE,
                    limit = DEFAULT_LIMIT,
                    postId = 0,
                } = params;

                return {
                    url: "/api/v1/post/related/all",
                    method: "GET",
                    params: { page, limit, postId },
                };
            },
            providesTags: ["Blog"],
        }),

        // GET /api/v1/post/category/all?page&limit
        getPostCategories: builder.query<any, CategoryListQuery>({
            query: (params = {}) => {
                const {
                    page = DEFAULT_PAGE,
                    limit = DEFAULT_LIMIT,
                } = params;

                return {
                    url: "/api/v1/post/category/all",
                    method: "GET",
                    params: { page, limit },
                };
            },
            providesTags: ["BlogCategory"],
        }),

        // POST /api/v1/post/category/save  (body: PostCategory)
        savePostCategory: builder.mutation<any, any>({
            query: (body) => ({
                url: "/api/v1/post/category/save",
                method: "POST",
                body,
            }),
            invalidatesTags: ["BlogCategory"],
        }),

        // POST /api/v1/post/save
        // OpenAPI shows lots of query params + x-www-form-urlencoded with files.
        // Easiest on frontend: send FormData with all fields (incl. files) and let backend bind.
        savePost: builder.mutation<any, FormData>({
            query: (formData) => ({
                url: "/api/v1/post/save",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Blog"],
        }),

        // POST /api/v1/post/setting/save (body: PostSetting)
        saveBlogSettings: builder.mutation<any, any>({
            query: (body) => ({
                url: "/api/v1/post/setting/save",
                method: "POST",
                body,
            }),
            invalidatesTags: ["BlogSetting"],
        }),

        // GET /api/v1/post/popular
        getPopularPosts: builder.query<any, void>({
            query: () => ({
                url: "/api/v1/post/popular",
                method: "GET",
            }),
            providesTags: ["Blog"],
        }),

        // GET /api/v1/post/byid?id=...
        getPostById: builder.query<any, number>({
            query: (id) => ({
                url: "/api/v1/post/byid",
                method: "GET",
                params: { id },
            }),
            providesTags: ["Blog"],
        }),

        // DELETE /api/v1/post/delete/{id}
        deletePost: builder.mutation<any, number>({
            query: (id) => ({
                url: `/api/v1/post/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Blog"],
        }),
    }),
});

export const {
    useGetLatestPostsQuery,
    useGetPostDetailByUrlQuery,
    useGetBlogSettingsQuery,
    useGetRelatedPostsQuery,
    useGetPostCategoriesQuery,
    useSavePostCategoryMutation,
    useSavePostMutation,
    useSaveBlogSettingsMutation,
    useGetPopularPostsQuery,
    useGetPostByIdQuery,
    useDeletePostMutation,
} = blogAPI;
