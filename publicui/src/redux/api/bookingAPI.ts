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

// DTOs provided by user
export interface BookingDetailDto {
    BookingId: number;
    ProductType: string;
    ProductId: number;
    Adult: number;
    Children: number;
    PreferedStartDate?: string;
    ArrivalDate?: string;
    DepartureDate?: string;
    FirstName: string;
    MiddleName: string;
    LastName: string;
    Gender: string;
    DOB?: string;
    Nationality: string;
    PassportNumber: string;
    IssuedDate?: string;
    ExpiryDate?: string;
    HomePhoneNumber: string;
    WorkPhoneNumber: string;
    Email: string;
    FlightName: string;
    FlightNumber: string;
    AirportPickUp: boolean;
    SpecialRequest: string;
    ModeOfPayment: string;
    PaymentReference: string;
    TotalAmount: number;
    BookingStatus: string;
    CancelReason: string;
    AddedOn: string;
    Travellers: BookingTravellerDto[];
    HealthInfos: any[]; // BookingHealthInfoDto not provided, using any
    EmergencyContact: BookingEmergencyContactDto;
}

export interface BookingEmergencyContactDto {
    FirstName: string;
    MiddleName: string;
    LastName: string;
    Address: string;
    City: string;
    Zip: string;
    Country: string;
    RelationShip: string;
    Email: string;
    HomePhoneNumber: string;
    PersonalNumber: string;
}

export interface ProductSummaryDto {
    ProductType: string;
    ProductId: number;
    Name: string;
    UrlSlug: string;
    DurationDays: number;
    PreferedStartDate: string;
    PreferedEndDate: string;
    AdultCount: number;
    ChildrenCount: number;
}

export interface LeadCustomerDto {
    FirstName: string;
    MiddleName: string;
    LastName: string;
    Email: string;
    Phone: string;
    Nationality: string;
    PassportNumber: string;
}

export interface BookingTravellerDto {
    FirstName: string;
    LastName: string;
    Gender: string;
    DOB?: string;
    Nationality: string;
    PassportNumber: string;
    PassportIssuedDate?: string;
    PassportExpiryDate?: string;
    TravellerType: string;
    MedicalConditions: string;
    Allergies: string;
    FitnessLevel: string;
    InsuranceProvider: string;
    InsurancePolicyNo: string;
    EmergencyNotes: string;
    BookingTravellerId: number;
    BookingId: number;
}

export interface BookingPricingSummaryDto {
    AdultCount: number;
    ChildrenCount: number;
    AdultPricePerPerson: number;
    ChildPricePerPerson: number;
    Subtotal: number;
    Discount: number;
    Tax: number;
    Total: number;
    CurrencyId: number;
    CurrencyCode: string;
}

export interface BookingPaymentGatewayLogDto {
    GatewayName: string;
    TransactionId: string;
    PaymentStatus: string;
    PaidAmount: number;
    PaidOn: string;
    RawResponse: string;
}

export interface UserBookingOpenRequest {
    Product: ProductSummaryDto;
    LeadCustomer: LeadCustomerDto;
    Travellers: BookingTravellerDto[];
    EmergencyContact: BookingEmergencyContactDto;
    Pricing: BookingPricingSummaryDto;
    PaymentLog: BookingPaymentGatewayLogDto;
    Source?: string;
    Locale?: string;
}

export interface UserBookingOpenResult {
    BookingId: number;
    BookingCode: string;
    Status: string;
    Product: ProductSummaryDto;
    Pricing: BookingPricingSummaryDto;
    Payment: BookingPaymentGatewayLogDto;
    CreatedOn: string;
}

export interface AdminBookingOpenRequest {
    Product: ProductSummaryDto;
    LeadCustomer: LeadCustomerDto;
    Travellers: BookingTravellerDto[];
    Channel?: string;
    InternalNote?: string;
}

export interface AdminBookingOpenResult {
    BookingId: number;
    BookingCode: string;
    Status: string;
    Product: ProductSummaryDto;
    CreatedOn: string;
}

export const bookingAPI = createApi({
    reducerPath: "bookingAPI",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["Booking"],
    endpoints: (builder) => ({
        getAllBooking: builder.query<any, PaginationParams>({
            query: (params) => ({
                url: "/api/v1/booking/all",
                method: "GET",
                params,
            }),
            providesTags: ["Booking"],
        }),
        getBookingDetail: builder.query<BookingDetailDto, number>({
            query: (id) => ({
                url: `/api/v1/booking/detail/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Booking", id }],
        }),
        openUserBooking: builder.mutation<UserBookingOpenResult, UserBookingOpenRequest>({
            query: (data) => ({
                url: "/api/v1/booking/open/user",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Booking"],
        }),
        openAdminBooking: builder.mutation<AdminBookingOpenResult, AdminBookingOpenRequest>({
            query: (data) => ({
                url: "/api/v1/booking/open/admin",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Booking"],
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
        printBookingConfirmation: builder.query<Blob, number>({
            query: (bookingId) => ({
                url: `/api/v1/booking/${bookingId}/print/confirmation`,
                method: "GET",
                responseHandler: (response) => response.blob(),
            }),
        }),
        printBookingInvoice: builder.query<Blob, number>({
            query: (bookingId) => ({
                url: `/api/v1/booking/${bookingId}/print/invoice`,
                method: "GET",
                responseHandler: (response) => response.blob(),
            }),
        }),
        getBookingAuditLog: builder.query<any, number>({
            query: (bookingId) => ({
                url: `/api/v1/booking/${bookingId}/audit-log`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Booking", id }],
        }),
        // Payments
        getBookingPayments: builder.query<any, number>({
            query: (bookingId) => ({
                url: `/api/v1/booking/${bookingId}/payments`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Booking", id }],
        }),
        addBookingPayment: builder.mutation<any, { bookingId: number; data: any }>({
            query: ({ bookingId, data }) => ({
                url: `/api/v1/booking/${bookingId}/payments`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Booking"],
        }),
        refundBookingPayment: builder.mutation<any, { bookingId: number; paymentId: number; data: any }>({
            query: ({ bookingId, paymentId, data }) => ({
                url: `/api/v1/booking/${bookingId}/payments/${paymentId}/refund`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Booking"],
        }),
        // Notes & Communication
        getBookingNotes: builder.query<any, number>({
            query: (bookingId) => ({
                url: `/api/v1/booking/${bookingId}/notes`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Booking", id }],
        }),
        addBookingNote: builder.mutation<any, { bookingId: number; note: string }>({
            query: ({ bookingId, note }) => ({
                url: `/api/v1/booking/${bookingId}/notes`,
                method: "POST",
                body: { note },
            }),
            invalidatesTags: ["Booking"],
        }),
        getBookingCommunicationLog: builder.query<any, number>({
            query: (bookingId) => ({
                url: `/api/v1/booking/${bookingId}/communication-log`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Booking", id }],
        }),
        sendBookingEmail: builder.mutation<any, { bookingId: number; emailType: string }>({
            query: ({ bookingId, emailType }) => ({
                url: `/api/v1/booking/${bookingId}/email/${emailType}`,
                method: "POST",
                body: { emailType },
            }),
        }),
        // Documents
        getBookingDocuments: builder.query<any, number>({
            query: (bookingId) => ({
                url: `/api/v1/booking/${bookingId}/documents`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Booking", id }],
        }),
        uploadBookingDocument: builder.mutation<any, { bookingId: number; formData: FormData }>({
            query: ({ bookingId, formData }) => ({
                url: `/api/v1/booking/${bookingId}/documents`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Booking"],
        }),
        deleteBookingDocument: builder.mutation<any, { bookingId: number; documentId: number }>({
            query: ({ bookingId, documentId }) => ({
                url: `/api/v1/booking/${bookingId}/documents/${documentId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Booking"],
        }),
        verifyBookingDocument: builder.mutation<any, { bookingId: number; documentId: number }>({
            query: ({ bookingId, documentId }) => ({
                url: `/api/v1/booking/${bookingId}/documents/${documentId}/verify`,
                method: "POST",
                body: {},
            }),
            invalidatesTags: ["Booking"],
        }),
    }),
});

export const {
    useGetAllBookingQuery,
    useGetBookingDetailQuery,
    useOpenUserBookingMutation,
    useOpenAdminBookingMutation,
    useSaveBookingBasicMutation,
    useChangeBookingStatusMutation,
    useChangeBookingTravelDateMutation,
    useSaveBookingTravellersMutation,
    useSaveBookingHealthMutation,
    useSaveBookingEmergencyMutation,
    useGetBookingDashboardSummaryQuery,
    useLazyPrintBookingConfirmationQuery,
    useLazyPrintBookingInvoiceQuery,
    useGetBookingAuditLogQuery,
    useGetBookingPaymentsQuery,
    useAddBookingPaymentMutation,
    useRefundBookingPaymentMutation,
    useGetBookingNotesQuery,
    useAddBookingNoteMutation,
    useGetBookingCommunicationLogQuery,
    useSendBookingEmailMutation,
    useGetBookingDocumentsQuery,
    useUploadBookingDocumentMutation,
    useDeleteBookingDocumentMutation,
    useVerifyBookingDocumentMutation,
} = bookingAPI;
