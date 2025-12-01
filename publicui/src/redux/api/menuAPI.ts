import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../config/apiConfig";

export const contentAPI = createApi({
    reducerPath: "contentAPI",
    baseQuery: baseQueryWithAuth,
    endpoints: (builder) => ({
        getMegaMenu: builder.query({
            query: () => ({
                url: "/api/v1/content/megamenu",
                method: "GET",
            }),
        }),
        getHeroBanner: builder.query({
            query: () => ({
                url: "/api/v1/content/hero",
                method: "GET",
            }),
        }),
        getGallery: builder.query({
            query: () => ({
                url: "/api/v1/content/gallery",
                method: "GET",
            }),
        }),
        getTestimonials: builder.query({
            query: () => ({
                url: "/api/v1/content/testimonials",
                method: "GET",
            }),
        }),
        getFooterMenu: builder.query({
            query: () => ({
                url: "/api/v1/content/footer",
                method: "GET",
            }),
        }),
        getAboutUs: builder.query({
            query: () => ({
                url: "/api/v1/content/about",
                method: "GET",
            }),
        }),
        getContactUs: builder.query({
            query: () => ({
                url: "/api/v1/content/contact",
                method: "GET",
            }),
        }),
    }),
});

export const {
    useGetMegaMenuQuery,
    useGetHeroBannerQuery,
    useGetGalleryQuery,
    useGetTestimonialsQuery,
    useGetFooterMenuQuery,
    useGetAboutUsQuery,
    useGetContactUsQuery,
} = contentAPI;
