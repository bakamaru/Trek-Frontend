import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../config/apiConfig";
import {
    BookingBasicSaveRequest,
    BookingChangeStatusRequest,
    BookingChangeTravelDateRequest,
    BookingTravellerSaveRequest,
    BookingHealthInfoSaveRequest,
    BookingEmergencyContactSaveRequest,
    PaginationParams,
} from "../../types/trekTypes";

export const bookingAPI = createApi({
    reducerPath: "bookingAPI",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["Booking"],
    endpoints: (builder) => ({
        getAllBookings: builder.query<any, PaginationParams>({
            query: (params) => ({
                url: "/api/v1/booking/all",
                method: "GET",
                params,
            }),
            providesTags: ["Booking"],
        }),
        getBookingDetail: builder.query<any, number>({
            query: (id) => ({
                url: `/api/v1/booking/detail/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Booking", id }],
        }),
        saveBookingBasic: builder.mutation<any, BookingBasicSaveRequest>({
            query: (data) => ({
                url: "/api/v1/booking/save-basic",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Booking"],
        }),
        changeBookingStatus: builder.mutation<any, BookingChangeStatusRequest>({
            query: (data) => ({
                url: "/api/v1/booking/status/change",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Booking"],
        }),
        changeBookingTravelDate: builder.mutation<any, BookingChangeTravelDateRequest>({
            query: (data) => ({
                url: "/api/v1/booking/traveldate/change",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Booking"],
        }),
        saveBookingTravellers: builder.mutation<any, { bookingId: number; data: BookingTravellerSaveRequest[] }>({
            query: ({ bookingId, data }) => ({
                url: `/api/v1/booking/${bookingId}/travellers/save`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Booking"],
        }),
        saveBookingHealth: builder.mutation<any, { bookingId: number; data: BookingHealthInfoSaveRequest[] }>({
            query: ({ bookingId, data }) => ({
                url: `/api/v1/booking/${bookingId}/health/save`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Booking"],
        }),
        saveBookingEmergency: builder.mutation<any, { bookingId: number; data: BookingEmergencyContactSaveRequest }>({
            query: ({ bookingId, data }) => ({
                url: `/api/v1/booking/${bookingId}/emergency/save`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Booking"],
        }),
        getBookingDashboardSummary: builder.query<any, void>({
            query: () => ({
                url: "/api/v1/booking/dashboard/summary",
                method: "GET",
            }),
            providesTags: ["Booking"],
        }),
    }),
});

export const {
    useGetAllBookingsQuery,
    useGetBookingDetailQuery,
    useSaveBookingBasicMutation,
    useChangeBookingStatusMutation,
    useChangeBookingTravelDateMutation,
    useSaveBookingTravellersMutation,
    useSaveBookingHealthMutation,
    useSaveBookingEmergencyMutation,
    useGetBookingDashboardSummaryQuery,
} = bookingAPI;
