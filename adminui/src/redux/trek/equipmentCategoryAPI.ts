import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../config/apiConfig";
import { EquipmentCategorySaveRequest, PaginationParams } from "../../types/trekTypes";

export const equipmentCategoryAPI = createApi({
    reducerPath: "equipmentCategoryAPI",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["EquipmentCategory"],
    endpoints: (builder) => ({
        getAllEquipmentCategoryActive: builder.query<any, PaginationParams>({
            query: (params) => ({
                url: "/api/v1/equipmentcategory/all/active",
                method: "GET",
                params,
            }),
            providesTags: ["EquipmentCategory"],
        }),
        getAllEquipmentCategory: builder.query<any, PaginationParams>({
            query: (params) => ({
                url: "/api/v1/equipmentcategory/all",
                method: "GET",
                params,
            }),
            providesTags: ["EquipmentCategory"],
        }),
        getEquipmentCategoryById: builder.query<any, number>({
            query: (id) => ({
                url: `/api/v1/equipmentcategory/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "EquipmentCategory", id }],
        }),
        deleteEquipmentCategory: builder.mutation<any, number>({
            query: (id) => ({
                url: `/api/v1/equipmentcategory/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["EquipmentCategory"],
        }),
        saveEquipmentCategory: builder.mutation<any, EquipmentCategorySaveRequest>({
            query: (data) => ({
                url: "/api/v1/equipmentcategory/save",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["EquipmentCategory"],
        }),
    }),
});

export const {
    useGetAllEquipmentCategoryActiveQuery,
    useGetAllEquipmentCategoryQuery,
    useGetEquipmentCategoryByIdQuery,
    useDeleteEquipmentCategoryMutation,
    useSaveEquipmentCategoryMutation,
} = equipmentCategoryAPI;
