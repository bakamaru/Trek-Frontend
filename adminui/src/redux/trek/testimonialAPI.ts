import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../config/apiConfig";

type TestimonialListQuery = {
    offset?: number;
    limit?: number;
    query?: string;
};

export const testimonialAPI = createApi({
    reducerPath: "testimonialAPI",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["Testimonial"],
    endpoints: (builder) => ({
        // GET /api/v1/testimonial/all/active
        getActiveTestimonials: builder.query<any, TestimonialListQuery>({
            query: (params = {}) => {
                const {
                    offset = 1,
                    limit = 20,
                    query = "",
                } = params;

                return {
                    url: `/api/v1/testimonial/all/active?offset=${offset}&limit=${limit}&query=${encodeURIComponent(
                        query
                    )}`,
                    method: "GET",
                };
            },
            providesTags: ["Testimonial"],
        }),

        // GET /api/v1/testimonial/all
        getAllTestimonials: builder.query<any, TestimonialListQuery>({
            query: (params = {}) => {
                const {
                    offset = 1,
                    limit = 20,
                    query = "",
                } = params;

                return {
                    url: `/api/v1/testimonial/all?offset=${offset}&limit=${limit}&query=${encodeURIComponent(
                        query
                    )}`,
                    method: "GET",
                };
            },
            providesTags: ["Testimonial"],
        }),

        // GET /api/v1/testimonial/{id}
        getTestimonialById: builder.query<any, number>({
            query: (id) => ({
                url: `/api/v1/testimonial/${id}`,
                method: "GET",
            }),
            providesTags: ["Testimonial"],
        }),

        // POST /api/v1/testimonial/save
        // NOTE: backend expects x-www-form-urlencoded (or you can send FormData)
        saveTestimonial: builder.mutation<any, FormData | Record<string, any>>({
            query: (body) => ({
                url: "/api/v1/testimonial/save",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Testimonial"],
        }),

        // DELETE /api/v1/testimonial/{id}
        deleteTestimonial: builder.mutation<any, number>({
            query: (id) => ({
                url: `/api/v1/testimonial/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Testimonial"],
        }),
    }),
});

export const {
    useGetActiveTestimonialsQuery,
    useGetAllTestimonialsQuery,
    useGetTestimonialByIdQuery,
    useSaveTestimonialMutation,
    useDeleteTestimonialMutation,
} = testimonialAPI;
