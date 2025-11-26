import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../config/apiConfig";

export const chunkFileUploadAPI = createApi({
    reducerPath: "chunkFileUploadAPI",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["ChunkFileUpload"],
    endpoints: (builder) => ({
        createFileUpload: builder.mutation<any, { userId: number; data: any }>({
            query: ({ userId, data }) => ({
                url: `/api/v1/file/create/${userId}`,
                method: "POST",
                body: new URLSearchParams(data),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }),
        }),
        uploadFileChunk: builder.mutation<any, { userId: number; sessionId: string; chunkNumber: number; data: any }>({
            query: ({ userId, sessionId, chunkNumber, data }) => ({
                url: `/api/v1/file/upload/user/${userId}/session/${sessionId}`,
                method: "PUT",
                params: { chunkNumber },
                body: new URLSearchParams(data),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }),
        }),
        getFileUploadStatus: builder.query<any, string>({
            query: (sessionId) => ({
                url: `/api/v1/file/upload/${sessionId}`,
                method: "GET",
            }),
        }),
        getAllFileUploads: builder.query<any, void>({
            query: () => ({
                url: "/api/v1/file/uploads",
                method: "GET",
            }),
        }),
        downloadFile: builder.query<any, string>({
            query: (sessionId) => ({
                url: `/api/v1/file/download/${sessionId}`,
                method: "GET",
            }),
        }),
    }),
});

export const {
    useCreateFileUploadMutation,
    useUploadFileChunkMutation,
    useGetFileUploadStatusQuery,
    useGetAllFileUploadsQuery,
    useDownloadFileQuery,
} = chunkFileUploadAPI;
