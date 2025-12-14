import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ITokenResponse } from "../../types";
import { BaseEndpoints } from "../../config/BaseEndpoints";
import { baseQueryWithAuth } from "../../config/apiConfig";
import {
    AppUser,
    ChangePasswordDto,
    ChangePhoneDto,
    EmailOtp,
    LoginDto,
    NewUserDto,
    OtpCheck,
    PhoneDto,
    ProfilePictureUpdateDto,
    RefreshTokenDto,
    TokenResponseDto,
} from "../../types/usertypes";

interface ApiResponse<T> {
    Message: string;
    IsSuccess: boolean;
    Data: T;
    StatusCode: number;
}

export const userAPI = createApi({
    reducerPath: "userAPI",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["User"],
    endpoints: (builder) => ({
        // Original login (IdentityServer direct)
        login: builder.mutation<ITokenResponse, any>({
            query: (credentials) => ({
                url: "/connect/token",
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    grant_type: credentials.grant_type,
                    client_id: credentials.client_id,
                    client_secret: credentials.client_secret,
                    username: credentials.username,
                    password: credentials.password || '',
                    scope: credentials.scope || ''
                }),
            }),
        }),
        // New Controller login
        appLogin: builder.mutation<ApiResponse<{ User: AppUser }>, LoginDto>({
            query: (body) => ({
                url: "/api/v1/user/login",
                method: "POST",
                body,
            }),
            invalidatesTags: ["User"],
        }),
        signup: builder.mutation<ApiResponse<{ User: AppUser }>, NewUserDto>({
            query: (body) => ({
                url: "/api/v1/user/signup",
                method: "POST",
                body,
            }),
        }),
        getUserProfile: builder.query<ApiResponse<AppUser>, void>({
            query: () => "/api/v1/user/profile",
            providesTags: ["User"],
            // Cache for 60 seconds (1 minute)
            keepUnusedDataFor: 60,
        }),
        sendLoginOtp: builder.mutation<ApiResponse<boolean>, void>({
            query: () => ({ url: "/api/v1/user/login/otp/email/resend", method: "POST" }),
        }),
        sendLoginSmsOtp: builder.mutation<ApiResponse<boolean>, void>({
            query: () => ({ url: "/api/v1/user/login/otp/sms/resend", method: "POST" }),
        }),
        verifyOtp: builder.mutation<ApiResponse<boolean>, OtpCheck>({
            query: (body) => ({ url: "/api/v1/user/login/otp/verify", method: "POST", body }),
        }),
        checkEmail: builder.query<ApiResponse<boolean>, string>({
            query: (email) => `/api/v1/user/check/email?email=${email}`,
        }),
        sendEmailOtp: builder.mutation<ApiResponse<string>, EmailOtp>({
            query: (body) => ({ url: "/api/v1/user/send/email/otp", method: "POST", body }),
        }),
        sendPhoneOtp: builder.mutation<ApiResponse<string>, PhoneDto>({
            query: (body) => ({ url: "/api/v1/user/send/otp", method: "POST", body }),
        }),
        checkOtp: builder.mutation<ApiResponse<{ IsCorrect: boolean }>, OtpCheck>({
            query: (body) => ({ url: "/api/v1/user/check/otp", method: "POST", body }),
        }),
        checkActive: builder.query<ApiResponse<boolean>, void>({
            query: () => "/api/v1/user/check/active",
        }),
        changePhone: builder.mutation<ApiResponse<boolean>, ChangePhoneDto>({
            query: (body) => ({ url: "/api/v1/user/change/phone", method: "POST", body }),
        }),
        getPhoneVerificationStatus: builder.query<ApiResponse<boolean>, void>({
            query: () => "/api/v1/user/phone/verification/status",
        }),
        uploadProfilePicture: builder.mutation<ApiResponse<string>, FormData>({
            query: (body) => ({
                url: "/api/v1/user/picture/upload",
                method: "POST",
                body,
            }),
            invalidatesTags: ["User"],
        }),
        updatePicture: builder.mutation<ApiResponse<boolean>, ProfilePictureUpdateDto>({
            query: (body) => ({ url: "/api/v1/user/picture/update", method: "POST", body }),
            invalidatesTags: ["User"],
        }),
        changePassword: builder.mutation<ApiResponse<boolean>, ChangePasswordDto>({
            query: (body) => ({ url: "/api/v1/user/changepassword", method: "POST", body }),
        }),
        forgotPassword: builder.mutation<ApiResponse<boolean>, string>({
            query: (email) => ({ url: `/api/v1/user/forgotpassword?email=${email}`, method: "POST" }),
        }),
        sendVerificationEmail: builder.mutation<ApiResponse<boolean>, string>({
            query: (emailorUserName) => ({
                url: `/api/v1/user/email/send?emailorUserName=${emailorUserName}`,
                method: "POST",
            }),
        }),
        saveUser: builder.mutation<ApiResponse<AppUser>, AppUser>({
            query: (body) => ({ url: "/api/v1/user/save", method: "POST", body }),
            invalidatesTags: ["User"],
        }),
        refreshToken: builder.mutation<ApiResponse<TokenResponseDto>, RefreshTokenDto>({
            query: (body) => ({ url: "/api/v1/user/refresh/token", method: "POST", body }),
        }),
        resendPhoneOtp: builder.mutation<ApiResponse<boolean>, { user: AppUser; newPhone: string }>({
            query: ({ user, newPhone }) => ({
                url: `/api/v1/user/phone/otp/resend?newPhone=${newPhone}`,
                method: "POST",
                body: user,
            }),
        }),
        verifyPhone: builder.mutation<ApiResponse<boolean>, string>({
            query: (otpcode) => ({
                url: `/api/v1/user/phone/verify?otpcode=${otpcode}`,
                method: "POST",
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useAppLoginMutation,
    useSignupMutation,
    useGetUserProfileQuery,
    useLazyGetUserProfileQuery,
    useSendLoginOtpMutation,
    useSendLoginSmsOtpMutation,
    useVerifyOtpMutation,
    useCheckEmailQuery,
    useLazyCheckEmailQuery,
    useSendEmailOtpMutation,
    useSendPhoneOtpMutation,
    useCheckOtpMutation,
    useCheckActiveQuery,
    useChangePhoneMutation,
    useGetPhoneVerificationStatusQuery,
    useUploadProfilePictureMutation,
    useUpdatePictureMutation,
    useChangePasswordMutation,
    useForgotPasswordMutation,
    useSendVerificationEmailMutation,
    useSaveUserMutation,
    useRefreshTokenMutation,
    useResendPhoneOtpMutation,
    useVerifyPhoneMutation,
} = userAPI;
