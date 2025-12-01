import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../config/apiConfig";
import { objectToFormData } from "../../utils/helpers";

export const categoryAPI = createApi({
  reducerPath: "categoryAPI",
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    // Get all categories
    getAllCategories: builder.query({
      query: (params) => ({
        url: "/api/v1/collection/category/all",
        method: "GET",
        params, // expects { offset, limit, query }
      }),
    }),
    // Get category detail by ID
    getCategoryDetail: builder.query({
      query: (id) => ({
        url: "/api/v1/collection/category/detail",
        method: "GET",
        params: { id }, // expects { KnowledgeBaseCategoryId }
      }),
    }),

    // Save category (create or update)
    saveCategory: builder.mutation({
      query: (data) => ({
        url: "/api/v1/collection/category/save",
        method: "POST",
        body: objectToFormData(data),
      }),
    }),

    // Delete category
    deleteCategory: builder.mutation({
      query: (data) => ({
        url: "/api/v1/collection/category/delete",
        method: "POST",
        body: objectToFormData(data),
      }),
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useSaveCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoryDetailQuery,
} = categoryAPI;

