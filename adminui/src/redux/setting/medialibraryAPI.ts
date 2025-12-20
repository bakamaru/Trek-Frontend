import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../config/apiConfig";
import type {
    DirectoryViewModel,
    MediaLibraryItem,
    MediaLibraryStatus,
    RenameFileRequest,
    UploadFileRequest,
    FileTransferRequest,
    DeleteFilesRequest,
} from "../../types/mediaLibraryTypes";

// API Response wrapper
interface ApiResponse<T> {
    Code: number;
    Message: string;
    Data: T;
    Errors: string[];
}

export const mediaLibraryAPI = createApi({
    reducerPath: "mediaLibraryAPI",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["MediaLibrary"],
    endpoints: (builder) => ({
        // POST api/v1/media-library/directory/save
        saveDirectory: builder.mutation<MediaLibraryStatus, DirectoryViewModel>({
            query: (data) => ({
                url: "/api/v1/media-library/directory/save",
                method: "POST",
                body: data,
            }),
            transformResponse: (response: ApiResponse<boolean>) => ({
                Success: response.Code === 200,
                Message: response.Message,
            }),
            invalidatesTags: ["MediaLibrary"],
        }),

        // POST api/v1/media-library/file/rename
        renameFile: builder.mutation<MediaLibraryStatus, RenameFileRequest>({
            query: (data) => ({
                url: "/api/v1/media-library/file/rename",
                method: "POST",
                body: data,
            }),
            transformResponse: (response: ApiResponse<boolean>) => ({
                Success: response.Code === 200,
                Message: response.Message,
            }),
            invalidatesTags: ["MediaLibrary"],
        }),

        // GET api/v1/media-library/content/all?currentDir=/
        getItemsByDirectory: builder.query<MediaLibraryItem[], { currentDir?: string }>({
            query: ({ currentDir = "/" }) => ({
                url: `/api/v1/media-library/content/all?currentDir=${encodeURIComponent(currentDir)}`,
                method: "GET",
            }),
            transformResponse: (response: ApiResponse<MediaLibraryItem[]>) => response.Data || [],
            providesTags: ["MediaLibrary"],
        }),

        // GET api/v1/media-library/directory/all?currentDir=/
        getDirectoriesOnly: builder.query<MediaLibraryItem[], { currentDir?: string }>({
            query: ({ currentDir = "/" }) => ({
                url: `/api/v1/media-library/directory/all?currentDir=${encodeURIComponent(currentDir)}`,
                method: "GET",
            }),
            transformResponse: (response: ApiResponse<MediaLibraryItem[]>) => response.Data || [],
            providesTags: ["MediaLibrary"],
        }),

        // POST api/v1/media-library/file/upload (multipart/form-data)
        uploadFile: builder.mutation<MediaLibraryStatus, UploadFileRequest>({
            query: ({ File, Dir }) => {
                const formData = new FormData();
                if (File) formData.append("File", File);
                if (Dir != null) formData.append("Dir", Dir);
                return {
                    url: "/api/v1/media-library/file/upload",
                    method: "POST",
                    body: formData,
                };
            },
            transformResponse: (response: ApiResponse<boolean>) => ({
                Success: response.Code === 200,
                Message: response.Message,
            }),
            invalidatesTags: ["MediaLibrary"],
        }),

        // POST api/v1/media-library/file/copy
        copyFilesOrDirectories: builder.mutation<MediaLibraryStatus, FileTransferRequest>({
            query: (data) => ({
                url: "/api/v1/media-library/file/copy",
                method: "POST",
                body: data,
            }),
            transformResponse: (response: ApiResponse<boolean>) => ({
                Success: response.Code === 200,
                Message: response.Message,
            }),
            invalidatesTags: ["MediaLibrary"],
        }),

        // POST api/v1/media-library/file/move
        moveFilesOrDirectories: builder.mutation<MediaLibraryStatus, FileTransferRequest>({
            query: (data) => ({
                url: "/api/v1/media-library/file/move",
                method: "POST",
                body: data,
            }),
            transformResponse: (response: ApiResponse<boolean>) => ({
                Success: response.Code === 200,
                Message: response.Message,
            }),
            invalidatesTags: ["MediaLibrary"],
        }),

        // POST api/v1/media-library/file/delete
        deleteFilesOrDirectories: builder.mutation<MediaLibraryStatus, DeleteFilesRequest>({
            query: (data) => ({
                url: "/api/v1/media-library/file/delete",
                method: "POST",
                body: data,
            }),
            transformResponse: (response: ApiResponse<boolean>) => ({
                Success: response.Code === 200,
                Message: response.Message,
            }),
            invalidatesTags: ["MediaLibrary"],
        }),
    }),
});

export const {
    useSaveDirectoryMutation,
    useRenameFileMutation,
    useGetItemsByDirectoryQuery,
    useGetDirectoriesOnlyQuery,
    useUploadFileMutation,
    useCopyFilesOrDirectoriesMutation,
    useMoveFilesOrDirectoriesMutation,
    useDeleteFilesOrDirectoriesMutation,
} = mediaLibraryAPI;
