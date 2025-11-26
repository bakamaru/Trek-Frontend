import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../config/apiConfig";
import { CurrencySaveRequest, PaginationParams } from "../../types/trekTypes";

export const currencyAPI = createApi({
    reducerPath: "currencyAPI",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["Currency"],
    endpoints: (builder) => ({
        getAllCurrencyActive: builder.query<any, PaginationParams>({
            query: (params) => ({
                url: "/api/v1/currency/all/active",
                method: "GET",
                params,
            }),
            providesTags: ["Currency"],
        }),
        getAllCurrency: builder.query<any, PaginationParams>({
            query: (params) => ({
                url: "/api/v1/currency/all",
                method: "GET",
                params,
            }),
            providesTags: ["Currency"],
        }),
        getCurrencyById: builder.query<any, number>({
            query: (id) => ({
                url: `/api/v1/currency/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Currency", id }],
        }),
        deleteCurrency: builder.mutation<any, number>({
            query: (id) => ({
                url: `/api/v1/currency/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Currency"],
        }),
        saveCurrency: builder.mutation<any, CurrencySaveRequest>({
            query: (data) => ({
                url: "/api/v1/currency/save",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Currency"],
        }),
    }),
});

export const {
    useGetAllCurrencyActiveQuery,
    useGetAllCurrencyQuery,
    useGetCurrencyByIdQuery,
    useDeleteCurrencyMutation,
    useSaveCurrencyMutation,
} = currencyAPI;
