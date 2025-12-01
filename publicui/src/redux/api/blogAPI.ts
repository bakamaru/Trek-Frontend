import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../config/apiConfig";

export const blogAPI = createApi({
    reducerPath: "blogAPI",
    baseQuery: baseQueryWithAuth,
    endpoints: (builder) => ({
        getBlogList: builder.query({
            query: (params) => ({
                url: "/api/v1/blog/list",
                method: "GET",
                params,
            }),
        }),
        getBlogDetail: builder.query({
            query: (slug) => ({
                url: `/api/v1/blog/detail/${slug}`,
                method: "GET",
            }),
        }),
        getLatestBlogs: builder.query({
            query: () => ({
                url: "/api/v1/blog/latest",
                method: "GET",
            }),
        }),
    }),
});

export const {
    useGetBlogListQuery,
    useGetBlogDetailQuery,
    useGetLatestBlogsQuery,
} = blogAPI;
