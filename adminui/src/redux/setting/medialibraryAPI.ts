import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../config/apiConfig";

export type RenameFileRequest = { oldFileName: string; newFileName: string; dir?: string | null };
export type UploadFileRequest = { file?: File | null; dir?: string | null };

// Use your real types if available:
export type DirectoryViewModel = any;
export type MediaLibraryItem = any;
export type FileTransferRequest = { files: MediaLibraryItem[]; destinationDir: string };
export type DeleteFilesRequest = { files: MediaLibraryItem[] };

export const mediaLibraryAPI = createApi({
    reducerPath: "mediaLibraryAPI",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["MediaLibrary"],
    endpoints: (builder) => ({
        // POST api/v1/media-library/directory/save
        saveDirectory: builder.mutation<any, DirectoryViewModel>({
            query: (data) => ({
                url: "/api/v1/media-library/directory/save",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["MediaLibrary"],
        }),

        // POST api/v1/media-library/file/rename
        renameFile: builder.mutation<any, RenameFileRequest>({
            query: (data) => ({
                url: "/api/v1/media-library/file/rename",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["MediaLibrary"],
        }),

        // GET api/v1/media-library/content/all?currentDir=/
        getItemsByDirectory: builder.query<any, { currentDir?: string }>({
            query: ({ currentDir = "/" }) => ({
                url: `/api/v1/media-library/content/all?currentDir=${encodeURIComponent(currentDir)}`,
                method: "GET",
            }),
            providesTags: ["MediaLibrary"],
        }),

        // GET api/v1/media-library/directory/all?currentDir=/
        getDirectoriesOnly: builder.query<any, { currentDir?: string }>({
            query: ({ currentDir = "/" }) => ({
                url: `/api/v1/media-library/directory/all?currentDir=${encodeURIComponent(currentDir)}`,
                method: "GET",
            }),
            providesTags: ["MediaLibrary"],
        }),

        // POST api/v1/media-library/file/upload (multipart/form-data)
        uploadFile: builder.mutation<any, UploadFileRequest>({
            query: ({ file, dir }) => {
                const formData = new FormData();
                if (file) formData.append("File", file);
                if (dir != null) formData.append("Dir", dir);
                return {
                    url: "/api/v1/media-library/file/upload",
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: ["MediaLibrary"],
        }),

        // POST api/v1/media-library/file/copy
        copyFilesOrDirectories: builder.mutation<any, FileTransferRequest>({
            query: (data) => ({
                url: "/api/v1/media-library/file/copy",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["MediaLibrary"],
        }),

        // POST api/v1/media-library/file/move
        moveFilesOrDirectories: builder.mutation<any, FileTransferRequest>({
            query: (data) => ({
                url: "/api/v1/media-library/file/move",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["MediaLibrary"],
        }),

        // POST api/v1/media-library/file/delete
        deleteFilesOrDirectories: builder.mutation<any, DeleteFilesRequest>({
            query: (data) => ({
                url: "/api/v1/media-library/file/delete",
                method: "POST",
                body: data,
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
