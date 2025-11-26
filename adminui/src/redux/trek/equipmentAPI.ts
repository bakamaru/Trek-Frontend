import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../config/apiConfig";
import { EquipmentSaveRequest, PaginationParams } from "../../types/trekTypes";

export const equipmentAPI = createApi({
    reducerPath: "equipmentAPI",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["Equipment"],
    endpoints: (builder) => ({
        getAllEquipmentActive: builder.query<any, PaginationParams>({
            query: (params) => ({
                url: "/api/v1/equipment/all/active",
                method: "GET",
                params,
            }),
            providesTags: ["Equipment"],
        }),
        getAllEquipment: builder.query<any, PaginationParams>({
            query: (params) => ({
                url: "/api/v1/equipment/all",
                method: "GET",
                params,
            }),
            providesTags: ["Equipment"],
        }),
        getEquipmentById: builder.query<any, number>({
            query: (id) => ({
                url: `/api/v1/equipment/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Equipment", id }],
        }),
        deleteEquipment: builder.mutation<any, number>({
            query: (id) => ({
                url: `/api/v1/equipment/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Equipment"],
        }),
        saveEquipment: builder.mutation<any, EquipmentSaveRequest>({
            query: (data) => ({
                url: "/api/v1/equipment/save",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Equipment"],
        }),
    }),
});

export const {
    useGetAllEquipmentActiveQuery,
    useGetAllEquipmentQuery,
    useGetEquipmentByIdQuery,
    useDeleteEquipmentMutation,
    useSaveEquipmentMutation,
} = equipmentAPI;
